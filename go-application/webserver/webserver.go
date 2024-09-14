package webserver

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
)

const (
	// Timeout values for the http.Server.
	serverIdleTimeout  = 60 * time.Second
	serverReadTimeout  = 30 * time.Second
	serverWriteTimeout = 30 * time.Second
)

var ErrWebServer = errors.New("webserver error")

// Provider defines an interface that provides a list of Campaign objects.
type Provider interface {
	Campaigns() []models.Campaign
}

// Sender defines an interface that sends Telegram messages.
type Sender interface {
	Send(string, string) error
}

// WebServer is a concrete type that wraps an HTTP ServeMux.
type WebServer struct {
	logger *slog.Logger
	mux    *http.ServeMux
}

// New sets up a new WebServer with defaults and then returns it.
func New() *WebServer {
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
func (ws *WebServer) WithCampaignsEndpoint(path string, source Provider) {
	ws.mux.Handle("GET "+path, http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "public, max-age=1800")
		w.WriteHeader(http.StatusOK)

		if err := json.NewEncoder(w).Encode(source.Campaigns()); err != nil {
			ws.logger.Warn("could not serve response", "error", err)
		}
	}))
}

// WithContactsEndpoint enables the endpoint used by the contact form.
func (ws *WebServer) WithContactsEndpoint(path string, tg Sender) {
	type contact struct {
		Message string `json:"message"`
		Name    string `json:"name"`
	}

	ws.mux.Handle("POST "+path, http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var in contact

		if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
			w.WriteHeader(http.StatusBadRequest)

			return
		}

		if err := tg.Send(in.Name, in.Message); err != nil {
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
