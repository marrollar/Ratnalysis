package ratservice

import "context"

type Station struct {
	ID          string `json:"id,omitempty"`
	Name        string `json:"name"`
	LinesServed string `json:"lines_served"`
	Latitude    string `json:"latitude"`
	Longitude   string `json:"longitude"`
}

type Repository interface {
	GetStations(ctx context.Context) ([]Station, error)
}
