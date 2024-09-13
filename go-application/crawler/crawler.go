package crawler

import (
	"context"
	"encoding/csv"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/luca-arch/go-help-palestine/models"
)

const (
	CrawlFrequency = time.Hour              // How often the crawler should run.
	UserAgent      = "go-help-palestine/v1" // User-Agent header to use when downloading sheets from Google.
)

var ErrCrawlerFailure = errors.New("crawler error")

// httpDoer defines an interface to make HTTP requests.
type httpDoer interface {
	Do(*http.Request) (*http.Response, error)
}

// persister defines an interface that reads and saves Campaigns.
type persister interface {
	Hydrate() []models.Campaign
	Store(campaigns []models.Campaign) error
}

// Crawler is a Google Sheets crawler that fetches a list of campaigns from a public Google document.
type Crawler struct {
	campaigns []models.Campaign
	client    httpDoer
	logger    *slog.Logger
	store     persister
	source    string
}

// New sets up a Google Sheet crawler and returns it.
func New(client httpDoer, sourceURL string) *Crawler {
	p := NewDefaultPersistence(sourceURL)

	return &Crawler{
		campaigns: p.Hydrate(), // Pre-warm campaigns that might have been downloaded already.
		client:    client,
		logger:    slog.New(slog.NewTextHandler(io.Discard, nil)),
		store:     p,
		source:    sourceURL,
	}
}

// Background immediately starts the crawler and then schedules subsequent runs.
func (c *Crawler) Background(ctx context.Context) {
	go func() {
		// Start first loop immediately.
		delay := time.Millisecond

		for {
			select {
			case <-ctx.Done():
				c.logger.Info("stopping crawler...")

				return
			case <-time.After(delay):
				if err := c.Crawl(ctx); err != nil {
					c.logger.Error("could not crawl", "error", err)
				}
			}

			// Then schedule next run.
			delay = CrawlFrequency
		}
	}()
}

// Campaigns returns the list of campaigns already fetched by the crawler.
func (c *Crawler) Campaigns() []models.Campaign {
	return c.campaigns
}

// Crawl fetches all campaigns contained in the Google Sheet document.
func (c *Crawler) Crawl(ctx context.Context) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, c.source, nil)
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
		item := parseCampaign(row)

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

	c.logger.Info("Done crawling", "items", len(campaigns))

	c.campaigns = campaigns

	if err := c.store.Store(campaigns); err != nil {
		c.logger.Warn("Could not store downloaded campaigns", "error", err)
	}

	return nil
}

// WithLogger sets the crawler's logger.
func (c *Crawler) WithLogger(logger *slog.Logger) *Crawler {
	c.logger = logger

	return c
}

// parseCampaign reads a single CSV line and returns a Campaign pointer. It returns nil if the line is not valid.
func parseCampaign(csvRow []string) *models.Campaign {
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

	campaign := &models.Campaign{
		Description: "",
		Link:        urlToString(link),
		Title:       "",
	}

	// Always use the shortest text as title.
	if len(text[0]) > len(text[1]) {
		campaign.Description = text[0]
		campaign.Title = text[1]
	} else {
		campaign.Description = text[1]
		campaign.Title = text[0]
	}

	return campaign
}

// urlToString returns a valid URL string, stripped of many tracking tags.
func urlToString(u *url.URL) string {
	q := u.Query()

	q.Del("_gl")
	q.Del("fbclid")
	q.Del("utm_campaign")
	q.Del("utm_medium")
	q.Del("utm_source")

	// q.Del("fbclid")
	// q.Del("fbclid")
	// q.Del("fbclid")

	u.RawQuery = q.Encode()

	return u.String()
}
