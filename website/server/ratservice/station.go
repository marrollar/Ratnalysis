package ratservice

import "context"

type Station struct {
	ID          string `json:"id,omitempty"`
	Name        string `json:"name"`
	LinesServed string `json:"lines_served"`
	Latitude    string `json:"latitude"`
	Longitude   string `json:"longitude"`
}

type SightingRecord struct {
	ID        string `json:"id,omitempty"`
	SoMany    string `json:"so_many"`
	OneOrTwo  string `json:"one_or_two"`
	None      string `json:"none"`
	DateStart string `json:"date_start"`
	DateEnd   string `json:"date_end"`
}

type Repository interface {
	GetStations(ctx context.Context) ([]Station, error)
	GetLastRecord(ctx context.Context, station_id string) (*SightingRecord, error)
	GetLastRecords(ctx context.Context) ([]SightingRecord, error)
}
