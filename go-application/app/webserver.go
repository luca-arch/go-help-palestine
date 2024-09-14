package app

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net"
	"net/http"
	"time"

	"github.com/luca-arch/go-help-palestine/models"
	"github.com/x-way/crawlerdetect"
)

const (
	// Timeout values for the http.Server.
	serverIdleTimeout  = 60 * time.Second
	serverReadTimeout  = 30 * time.Second
	serverWriteTimeout = 30 * time.Second
)

var ErrWebServer = errors.New("webserver error")

// Indexer defines an interface that provides a Campaign lookup function.
type Indexer interface {
	Campaign(string) *models.Campaign
	RegisterClick(context.Context, string)
}

// Provider defines an interface that provides a list of Campaign objects.
type Provider interface {
	Campaigns(string) []models.Campaign
}

// Sender defines an interface that sends Telegram messages.
type Sender interface {
	Send(models.TelegramMessage) error
}

// WebServer is a concrete type that wraps an HTTP ServeMux.
type WebServer struct {
	logger *slog.Logger
	mux    *http.ServeMux
}

// NewWebServer sets up a new WebServer with defaults and then returns it.
func NewWebServer() *WebServer {
	return &WebServer{
		logger: slog.New(slog.NewTextHandler(io.Discard, nil)),
		mux:    &http.ServeMux{},
	}
}

// ListenAndServe starts the HTTP server. Blocking.
func (ws *WebServer) ListenAndServe(ctx context.Context, addr string) error {
	s := &http.Server{ //nolint:exhaustruct // Defaults are ok
		Addr:              addr,
		Handler:           ws.mux,
		IdleTimeout:       serverIdleTimeout,
		ReadHeaderTimeout: serverReadTimeout,
		ReadTimeout:       serverReadTimeout,
		WriteTimeout:      serverWriteTimeout,
		BaseContext: func(_ net.Listener) context.Context {
			return ctx
		},
	}

	if err := s.ListenAndServe(); err != nil {
		return errors.Join(ErrWebServer, err)
	}

	return nil
}

// WithCampaignsEndpoint exposes the data source Campaigns in a JSON endpoint.
func (ws *WebServer) WithCampaignsEndpoint(groupName string, source Provider) {
	ws.mux.Handle("GET /api/list/"+groupName, http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "public, max-age=1800")
		w.WriteHeader(http.StatusOK)

		if err := json.NewEncoder(w).Encode(source.Campaigns(groupName)); err != nil {
			ws.logger.Warn("could not serve response", "error", err)
		}
	}))
}

// WithContactsEndpoint enables the endpoint used by the contact form.
func (ws *WebServer) WithContactsEndpoint(tg Sender) {
	ws.mux.Handle("POST /api/contact", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var in models.TelegramMessage

		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			w.WriteHeader(http.StatusBadRequest)

			return
		}

		if err := tg.Send(in); err != nil {
			w.WriteHeader(http.StatusBadRequest)

			json.NewEncoder(w).Encode(err.Error()) //nolint:errcheck

			return
		}

		w.WriteHeader(http.StatusOK)
	}))
}

// WithLogger sets the webserver's logger.
func (ws *WebServer) WithLogger(logger *slog.Logger) *WebServer {
	ws.logger = logger

	return ws
}

// WithRedirectEndpoint redirects to a campaign URL given its ID.
func (ws *WebServer) WithRedirectEndpoint(index Indexer) {
	ws.mux.Handle("GET /api/campaign/{id}", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		campaign := index.Campaign(id)

		if campaign == nil {
			w.WriteHeader(http.StatusNotFound)

			return
		}

		if !crawlerdetect.IsCrawler(r.UserAgent()) {
			// Background execution not to block the request.
			go index.RegisterClick(context.Background(), id) //nolint:contextcheck
		}

		w.Header().Set("Location", campaign.Link)
		w.WriteHeader(http.StatusPermanentRedirect)
	}))
}
