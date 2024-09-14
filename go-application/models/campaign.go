package models

// Campaign is a donations campaign fetched from a public Google document.
type Campaign struct {
	Description string `description:"Campaign description" json:"description"`
	ID          string `description:"Unique ID" json:"id"`
	Link        string `description:"Link to campaign website" json:"link"`
	Title       string `description:"Campaign title" json:"title"`
	TotalClicks int    `description:"Total number of clicks" json:"clicks"`
}

type CampaignsGroup struct {
	Campaigns []Campaign `description:"List of campaigns that belong to the group"`
	SourceURL string     `description:"Source file URL"`
}
