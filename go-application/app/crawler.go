package app

import (
	"context"
	"crypto/sha256"
	"encoding/csv"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/luca-arch/go-help-palestine/models"
	"github.com/redis/go-redis/v9"
)

const (
	CrawlFrequency = 30 * time.Minute // How often the crawler should run.
)

var (
	ErrCrawlerFailure = errors.New("crawler error")
	ErrRegister       = errors.New("could not register click")
)

// persister defines an interface that reads and saves Campaigns.
type persister interface {
	Hydrate(string) *models.CampaignsGroup
	Store(string, *models.CampaignsGroup) error
}

// Crawler is a Google Sheets crawler that fetches a list of campaigns from a public Google document.
type Crawler struct {
	client httpDoer
	groups map[string]models.CampaignsGroup
	index  map[string]models.Campaign
	logger *slog.Logger
	rdb    *redis.Client
	store  persister
}

// NewCrawler sets up a Google Sheet crawler and returns it.
func NewCrawler(client httpDoer, redisDB *redis.Client) *Crawler {
	return &Crawler{
		client: client,
		groups: make(map[string]models.CampaignsGroup, 0),
		index:  make(map[string]models.Campaign, 0),
		logger: slog.New(slog.NewTextHandler(io.Discard, nil)),
		rdb:    redisDB,
		store:  NewDefaultPersistence(),
	}
}

func (c *Crawler) AddGroup(name, sourceURL string) *Crawler {
	// Pre-warm campaigns that might have been downloaded already.
	group := c.store.Hydrate(name)

	if group == nil {
		group = &models.CampaignsGroup{
			Campaigns: make([]models.Campaign, 0),
			SourceURL: sourceURL,
		}
	} else {
		group.SourceURL = sourceURL
	}

	c.groups[name] = *group

	return c
}

// Background immediately starts the crawler and then schedules subsequent runs.
func (c *Crawler) Background(ctx context.Context) *Crawler {
	go func() {
		// Start first loop immediately.
		delay := time.Millisecond

		for {
			select {
			case <-ctx.Done():
				c.logger.Info("stopping crawler...")

				return
			case <-time.After(delay):
				c.CrawlAll(ctx)
				c.Reindex()
			}

			// Then schedule next run.
			delay = CrawlFrequency
		}
	}()

	return c
}

// Campaign returns a specific campaign by its id, or nil if not found.
func (c *Crawler) Campaign(id string) *models.Campaign {
	campaign, ok := c.index[id]
	if !ok {
		return nil
	}

	return &campaign
}

// Campaigns returns the list of campaigns already fetched by the crawler.
func (c *Crawler) Campaigns(groupName string) []models.Campaign {
	group, ok := c.groups[groupName]
	if !ok {
		c.logger.Warn("group not found", "group", groupName)

		return make([]models.Campaign, 0)
	}

	return group.Campaigns
}

// CrawlAll fetches all campaigns contained in the Google Sheet document.
func (c *Crawler) CrawlAll(ctx context.Context) {
	for groupName, group := range c.groups {
		err := c.Crawl(ctx, &group)
		if err != nil {
			c.logger.Error("could not crawl", "group", groupName, "error", err)

			continue
		}

		if err := c.store.Store(groupName, &group); err != nil {
			c.logger.Warn("Could not store downloaded campaigns", "error", err)
		}

		c.groups[groupName] = group

		c.logger.Info("Done crawling", "group", groupName, "campaigns", len(group.Campaigns))
	}
}

// Crawl fetches all campaigns in a group.
func (c *Crawler) Crawl(ctx context.Context, group *models.CampaignsGroup) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, group.SourceURL, nil)
	if err != nil {
		return errors.Join(ErrCrawlerFailure, err)
	}

	req.Header.Set("User-Agent", UserAgent)

	res, err := c.client.Do(req)
	if res != nil && res.Body != nil {
		defer res.Body.Close()
	}

	if err != nil {
		return errors.Join(ErrCrawlerFailure, err)
	}

	parser := csv.NewReader(res.Body)
	parser.FieldsPerRecord = 3

	data, err := parser.ReadAll()
	if err != nil {
		return errors.Join(ErrCrawlerFailure, err)
	}

	campaigns := make([]models.Campaign, 0)

	for i, row := range data {
		item := c.parseCampaign(ctx, row)

		switch {
		case item != nil:
			campaigns = append(campaigns, *item)
		case i == 0:
			// Ignore error on the first line, it's likely the heading
			continue
		default:
			c.logger.Warn("Invalid campaign item found", "csv", row, "line", i)
		}
	}

	group.Campaigns = campaigns

	return nil
}

func (c *Crawler) Metrics() map[string]int {
	m := make(map[string]int, 0)

	for _, group := range c.groups {
		for _, campaign := range group.Campaigns {
			if campaign.TotalClicks == 0 {
				continue
			}

			m[campaign.Title] = campaign.TotalClicks
		}
	}

	return m
}

func (c *Crawler) RegisterClick(ctx context.Context, id string) {
	err := c.rdb.Incr(ctx, "click:"+id).Err()
	if err != nil {
		c.logger.Error("could not increase click counter", "campaign", id, "error", err)
	}
}

func (c *Crawler) Reindex() *Crawler {
	idx := make(map[string]models.Campaign, 0)

	for _, group := range c.groups {
		for _, campaign := range group.Campaigns {
			idx[campaign.ID] = campaign
		}
	}

	c.index = idx

	return c
}

// WithLogger sets the crawler's logger.
func (c *Crawler) WithLogger(logger *slog.Logger) *Crawler {
	c.logger = logger

	return c
}

// parseCampaign reads a single CSV line and returns a Campaign pointer. It returns nil if the line is not valid.
func (c *Crawler) parseCampaign(ctx context.Context, csvRow []string) *models.Campaign {
	var link *url.URL

	text := make([]string, 0)

	// Iterate over columns to separate link from title/description.
	for _, col := range csvRow {
		if !strings.HasPrefix(col, "http://") && !strings.HasPrefix(col, "https://") {
			text = append(text, col)

			continue
		}

		link, _ = url.Parse(col)
	}

	// If no legit URL is found, assume the record is invalid.
	if link == nil || !strings.HasPrefix(link.String(), "http") {
		return nil
	}

	// This means unexpected input.
	if len(text) != 2 { //nolint:mnd
		return nil
	}

	linkStr := urlToString(link)

	id := urlToID(linkStr)

	clicks, err := c.rdb.Get(ctx, "click:"+id).Int()
	if err != nil && !errors.Is(err, redis.Nil) {
		c.logger.Warn("could not fetch total clicks number", "campaign", id, "error", err)
	}

	campaign := &models.Campaign{
		Description: "",
		ID:          id,
		Link:        linkStr,
		Title:       "",
		TotalClicks: clicks,
	}

	// Always use the shortest text as title.
	if len(text[0]) > len(text[1]) {
		campaign.Description = text[0]
		campaign.Title = text[1]
	} else {
		campaign.Description = text[1]
		campaign.Title = text[0]
	}

	c.logger.Debug("parsed", "campaign", campaign)

	return campaign
}

// urlToID returns a given URL's hash that can be used as primary key.
func urlToID(s string) string {
	// fixme: this might generate collisions!
	sum := sha256.Sum256([]byte(s))
	hash := fmt.Sprintf("%x", sum)

	return hash[0:8]
}

// urlToString returns a valid URL string, stripped of many tracking tags.
func urlToString(u *url.URL) string {
	q := u.Query()

	q.Del("_gl")
	q.Del("fbclid")
	q.Del("utm_campaign")
	q.Del("utm_medium")
	q.Del("utm_source")

	u.RawQuery = q.Encode()

	return u.String()
}
