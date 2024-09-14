package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/luca-arch/go-help-palestine/app"
	"github.com/redis/go-redis/v9"
)

const (
	CrawlerTimeout    = 10 * time.Second                                                                                                                  // Maximum request time for the crawler.
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

// Redis returns a new Redis connection.
func Redis() *redis.Client {
	addr := "redis:6379"
	if os.Getenv("ISDOCKER") != "1" {
		addr = "localhost:6379"
	}

	return redis.NewClient(&redis.Options{ //nolint:exhaustruct // defaults are ok
		Addr:         addr,
		DB:           0,
		Password:     "",
		ReadTimeout:  time.Second,
		WriteTimeout: time.Second,
	})
}

func main() {
	// Set up dependencies.
	client := &http.Client{Timeout: CrawlerTimeout} //nolint:exhaustruct // defaults are ok
	ctx := context.Background()
	logger := Logger(true)
	tgChannel, tgToken := os.Getenv("TG_CHANNEL"), os.Getenv("TG_BOT_TOKEN")
	tgClient := &http.Client{Timeout: SenderTimeout} //nolint:exhaustruct // defaults are ok

	// Set up Redis.
	rdb := Redis()

	// Set up crawler.
	crawler := app.NewCrawler(client, rdb).
		WithLogger(logger).
		AddGroup("charities", SourceCharity).
		AddGroup("individuals", SourceIndividuals).
		Reindex().
		Background(ctx)

	// Set up webserver.
	ws := app.NewWebServer().
		WithLogger(logger)

	ws.WithCampaignsEndpoint("charities", crawler)
	ws.WithCampaignsEndpoint("individuals", crawler)
	ws.WithRedirectEndpoint(crawler)

	// Set up Telegram integration.
	tg := app.NewTelegram(tgClient, tgChannel, tgToken).
		WithLogger(logger)

	ws.WithContactsEndpoint(tg)

	// Serve.
	if err := ws.ListenAndServe(ctx, ":10000"); err != nil {
		panic(err)
	}
}
