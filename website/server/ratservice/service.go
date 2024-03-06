package ratservice

import "context"

type Service interface {
	GetStations(ctx context.Context) ([]Station, error)
}