package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/luca-arch/go-help-palestine/crawler"
	"github.com/luca-arch/go-help-palestine/telegram"
	"github.com/luca-arch/go-help-palestine/webserver"
)

const (
	CrawlerTimeout    = 30 * time.Second                                                                                                                  // Maximum request time for the crawler.
	SenderTimeout     = 30 * time.Second                                                                                                                  // Maximum request time for the Telegram sender.
	SourceCharity     = "https://docs.google.com/spreadsheets/d/1pPXurDxcr4VYqPaAXxrrZ6Gh56zTlJzOyeuBSXqEaHk/export?format=csv&gid=188001176&usp=sharing" // Source sheet (charity orgs).
	SourceIndividuals = "https://docs.google.com/spreadsheets/d/1pPXurDxcr4VYqPaAXxrrZ6Gh56zTlJzOyeuBSXqEaHk/export?format=csv&gid=0&usp=sharing"         //  Source sheet (individuals).
)

// Logger returns a new slog.Logger.
func Logger(debug bool) *slog.Logger {
	lvl := new(slog.LevelVar)
	opts := &slog.HandlerOptions{
		AddSource:   false,
		Level:       lvl,
		ReplaceAttr: nil,
	}

	if !debug {
		return slog.New(slog.NewJSONHandler(os.Stdout, opts))
	}

	lvl.Set(slog.LevelDebug)

	return slog.New(slog.NewTextHandler(os.Stdout, opts))
}

func main() {
	ctx := context.Background()
	client := &http.Client{Timeout: CrawlerTimeout} //nolint:exhaustruct // defaults are ok
	logger := Logger(true)

	crawler0 := crawler.New(client, SourceCharity).
		WithLogger(logger.With("source", "Charity Organisations"))

	crawler1 := crawler.New(client, SourceIndividuals).
		WithLogger(logger.With("source", "Individual Campaigns"))

	crawler0.Background(ctx)
	crawler1.Background(ctx)

	ws := webserver.New().
		WithLogger(logger)

	ws.WithCampaignsEndpoint("/api/list/charities", crawler0)
	ws.WithCampaignsEndpoint("/api/list/individuals", crawler1)

	tgChannel, tgToken := os.Getenv("TG_CHANNEL"), os.Getenv("TG_BOT_TOKEN")
	tgClient := &http.Client{Timeout: SenderTimeout} //nolint:exhaustruct // defaults are ok
	tg := telegram.NewMessageSender(tgClient, tgChannel, tgToken).
		WithLogger(logger)

	ws.WithContactsEndpoint("/api/contact", tg)

	if err := ws.ListenAndServe(ctx, ":10000"); err != nil {
		panic(err)
	}
}
