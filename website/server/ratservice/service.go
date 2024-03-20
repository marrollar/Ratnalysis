package ratservice

import "context"

type Service interface {
	GetStations(ctx context.Context) ([]Station, error)
	GetLastRecord(ctx context.Context, station_id string) (*SightingRecord, error)
	GetLastRecords(ctx context.Context) ([]SightingRecord, error)
}