package plotlyservice

import "context"

type Service interface {
	GetStationSummary(ctx context.Context, station_id string) (string, error)
	GetTotalSummary(ctx context.Context) (string, error)
}