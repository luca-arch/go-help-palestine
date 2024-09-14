package app

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"sync"
	"time"

	"github.com/luca-arch/go-help-palestine/models"
)

const (
	MinMessageLength = 8
	MinNameLength    = 2
)

var (
	ErrInvalidMessage = errors.New("invalid message")
	ErrInvalidName    = errors.New("invalid name")
)

type apiMessage struct {
	ChatID string          `json:"chat_id"`              //nolint:tagliatelle // External API.
	Links  apiMessageLinks `json:"link_preview_options"` //nolint:tagliatelle // External API.
	Text   string          `json:"text"`
	// ParseMode string        `json:"parse_mode"` // Needs escaping!
}

type apiMessageLinks struct {
	IsDisabled bool `json:"is_disabled"` //nolint:tagliatelle // External API.
}

// Telegram is a concrete type that implements `Send()` and sends a message via Telegram API.
type Telegram struct {
	botToken  string
	channelID string
	client    httpDoer
	lock      sync.Mutex
	logger    *slog.Logger
}

// NewTelegram returns a new Telegram message sender.
func NewTelegram(client httpDoer, channel, token string) *Telegram {
	return &Telegram{
		botToken:  token,
		channelID: channel,
		client:    client,
		lock:      sync.Mutex{},
		logger:    slog.New(slog.NewTextHandler(io.Discard, nil)),
	}
}

// Send validates the message, the sender's name, and then enqueues the message for asynchronous sending.
func (tg *Telegram) Send(msg models.TelegramMessage) error {
	if len(msg.Name) < MinNameLength {
		return ErrInvalidName
	}

	if len(msg.Message) < MinMessageLength {
		return ErrInvalidMessage
	}

	go tg.ThrottledSend(msg)

	return nil
}

// ThrottledSend sends a message to the private Telegram group and backs off for a little to avoid hitting rate limits.
func (tg *Telegram) ThrottledSend(msg models.TelegramMessage) {
	if tg.botToken == "" || tg.channelID == "" {
		tg.logger.Info("Telegram notifications are disabled (TG_CHANNEL or TG_BOT_TOKEN environment variables not set)!", "name", msg.Name, "message", msg.Message)

		return
	}

	tg.lock.Lock()
	defer tg.lock.Unlock()

	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()

	payload := apiMessage{
		ChatID: tg.channelID,
		Links: apiMessageLinks{
			IsDisabled: true,
		},
		// ParseMode: "MarkdownV2", // Needs escaping!
		Text: fmt.Sprintf("📣 New Message from %s\n\n%s", msg.Name, msg.Message),
	}

	body, err := json.Marshal(payload)
	if err != nil {
		tg.logger.Error("could not marshal message", "name", msg.Name, "message", msg.Message, "error", err)

		return
	}

	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", tg.botToken)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, apiURL, bytes.NewReader(body))
	if err != nil {
		tg.logger.Error("could not initialise http.Request", "name", msg.Name, "message", msg.Message, "error", err)

		return
	}

	req.Header.Set("User-Agent", UserAgent)
	req.Header.Set("Content-Type", "application/json")

	res, err := tg.client.Do(req)
	if res != nil && res.Body != nil {
		defer res.Body.Close()
	}

	if err != nil {
		tg.logger.Error("could not send Telegram message", "name", msg.Name, "message", msg.Message, "error", err)

		return
	}

	if tg.logger.Handler().Enabled(ctx, slog.LevelDebug) {
		body, err := io.ReadAll(res.Body)

		tg.logger.Debug("api.telegram.org response", "body", string(body), "error", err)
	}

	if res.StatusCode == http.StatusOK {
		tg.logger.Debug("Telegram message sent", "name", msg.Name)
	} else {
		tg.logger.Error("could not send Telegram message", "name", msg.Name, "message", msg.Message, "http.response.status_code", res.StatusCode)
	}

	time.Sleep(time.Second)
}

// WithLogger sets the senders's logger.
func (tg *Telegram) WithLogger(logger *slog.Logger) *Telegram {
	tg.logger = logger

	return tg
}
