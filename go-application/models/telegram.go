package models

// TelegramMessage is a simple Telegram message with content and sender's name.
type TelegramMessage struct {
	Message string `json:"message"`
	Name    string `json:"name"`
}
