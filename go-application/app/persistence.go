package app

import (
	"encoding/json"
	"os"

	"github.com/luca-arch/go-help-palestine/models"
)

// Persistence is a concrete type that reads and saves already fetched Campaigns.
type Persistence struct{}

func NewDefaultPersistence() *Persistence {
	return &Persistence{}
}

// Hydrate imports a CampaignsGroup from a file.
func (p *Persistence) Hydrate(groupName string) *models.CampaignsGroup {
	var group *models.CampaignsGroup

	data, err := os.ReadFile(fileName(groupName))
	if err != nil {
		return nil
	}

	if err := json.Unmarshal(data, group); err != nil {
		return nil
	}

	return nil
}

// Store saves a CampaignsGroup in a file.
func (p *Persistence) Store(groupName string, group *models.CampaignsGroup) error {
	file, err := os.OpenFile(fileName(groupName), os.O_CREATE|os.O_WRONLY, os.ModePerm)

	if file != nil {
		defer file.Close()
	}

	if err != nil {
		return err //nolint:wrapcheck
	}

	encoder := json.NewEncoder(file)

	return encoder.Encode(group) //nolint:wrapcheck
}

func fileName(groupName string) string {
	dir := PersistenceDir
	if os.Getenv("ISDOCKER") != "1" {
		dir = os.TempDir()
	}

	return dir + groupName + ".json"
}
