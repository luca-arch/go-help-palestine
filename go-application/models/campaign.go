package models

// Campaign is a donations campaign fetched from a public Google document.
type Campaign struct {
	Description string `description:"Campaign description" json:"description"`
	Link        string `description:"Link to campaign website" json:"link"`
	Title       string `description:"Campaign title" json:"title"`
}
