package telegram

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
)

const (
	MinMessageLength = 8
	MinNameLength    = 2
	UserAgent        = "go-help-palestine/v1" // User-Agent header to use when downloading sheets from Google.
)

var (
	ErrInvalidMessage = errors.New("invalid message")
	ErrInvalidName    = errors.New("invalid name")
)

// httpDoer defines an interface to make HTTP requests.
type httpDoer interface {
	Do(*http.Request) (*http.Response, error)
}

type telegramLinks struct {
	IsDisabled bool `json:"is_disabled"` //nolint:tagliatelle // External API.
}

type Message struct {
	ChatID    string        `json:"chat_id"`              //nolint:tagliatelle // External API.
	Links     telegramLinks `json:"link_preview_options"` //nolint:tagliatelle // External API.
	ParseMode string        `json:"parse_mode"`           //nolint:tagliatelle // External API.
	Text      string        `json:"text"`
}

type MessageSender struct {
	botToken  string
	channelID string
	client    httpDoer
	lock      sync.Mutex
	logger    *slog.Logger
}

func NewMessageSender(client httpDoer, channel, token string) *MessageSender {
	return &MessageSender{
		botToken:  token,
		channelID: channel,
		client:    client,
		lock:      sync.Mutex{},
		logger:    slog.New(slog.NewTextHandler(io.Discard, nil)),
	}
}

// Send validates the message, the sender's name, and then enqueues the message for asynchronous sending.
func (ms *MessageSender) Send(name string, message string) error {
	if len(name) < MinNameLength {
		return ErrInvalidName
	}

	if len(message) < MinMessageLength {
		return ErrInvalidMessage
	}

	go ms.LimitedSend(name, message)

	return nil
}

// LimitedSend sends a message to the private Telegram group and backs off for a little to avoid hitting rate limits.
func (ms *MessageSender) LimitedSend(name string, message string) {
	if ms.botToken == "" || ms.channelID == "" {
		ms.logger.Info("Telegram notifications are disabled (TG_CHANNEL or TG_BOT_TOKEN environment variables not set)!", "name", name, "message", message)

		return
	}

	ms.lock.Lock()
	defer ms.lock.Unlock()

	ctx, cancel := context.WithTimeout(context.Background(), time.Minute)
	defer cancel()

	msg := Message{
		ChatID: ms.channelID,
		Links: telegramLinks{
			IsDisabled: true,
		},
		ParseMode: "MarkdownV2",
		Text:      fmt.Sprintf("**📣 New Message from %s**\n\n%s", name, message),
	}

	payload, err := json.Marshal(msg)
	if err != nil {
		ms.logger.Error("could not marshal message", "name", name, "message", message, "error", err)

		return
	}

	apiURL := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", ms.botToken)

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, apiURL, bytes.NewReader(payload))
	if err != nil {
		ms.logger.Error("could not initialise http.Request", "name", name, "message", message, "error", err)

		return
	}

	req.Header.Set("User-Agent", UserAgent)
	req.Header.Set("Content-Type", "application/json")

	res, err := ms.client.Do(req)
	if res != nil && res.Body != nil {
		defer res.Body.Close()
	}

	if err != nil {
		ms.logger.Error("could not send Telegram message", "name", name, "message", message, "error", err)

		return
	}

	if res.StatusCode == http.StatusOK {
		ms.logger.Debug("Telegram message sent", "name", name)
	} else {
		ms.logger.Error("could not send Telegram message", "name", name, "message", message, "http.response.status_code", res.StatusCode)
	}

	time.Sleep(time.Second)
}

// WithLogger sets the senders's logger.
func (ms *MessageSender) WithLogger(logger *slog.Logger) *MessageSender {
	ms.logger = logger

	return ms
}
