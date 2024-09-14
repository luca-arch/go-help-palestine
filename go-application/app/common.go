package app

import "net/http"

const (
	PersistenceDir = "/mnt/data/"           // Dockerfile's volume.
	UserAgent      = "go-help-palestine/v1" // User-Agent header to use sending HTTP requests.
)

// httpDoer defines an interface to make HTTP requests.
type httpDoer interface {
	Do(*http.Request) (*http.Response, error)
}
