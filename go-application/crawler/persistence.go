package crawler

import (
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"os"

	"github.com/luca-arch/go-help-palestine/models"
)

const PersistenceDir = "/mnt/data/" // Dockerfile's volume.

// Persistence is a concrete type that reads and saves already fetched Campaigns.
type Persistence struct {
	filePath string
}

func NewDefaultPersistence(sourceURL string) *Persistence {
	dir := PersistenceDir
	if os.Getenv("ISDOCKER") != "1" {
		dir = os.TempDir()
	}

	filePath := fmt.Sprintf("%s%x.json", dir, sha256.Sum256([]byte(sourceURL)))

	return &Persistence{
		filePath: filePath,
	}
}

func (p *Persistence) Hydrate() []models.Campaign {
	campaigns := make([]models.Campaign, 0)

	data, err := os.ReadFile(p.filePath)
	if err != nil {
		return campaigns
	}

	if err := json.Unmarshal(data, &campaigns); err != nil {
		return make([]models.Campaign, 0)
	}

	return campaigns
}

func (p *Persistence) Store(campaigns []models.Campaign) error {
	file, err := os.OpenFile(p.filePath, os.O_CREATE|os.O_WRONLY, os.ModePerm)

	if file != nil {
		defer file.Close()
	}

	if err != nil {
		return err //nolint:wrapcheck
	}

	encoder := json.NewEncoder(file)

	return encoder.Encode(campaigns) //nolint:wrapcheck
}
