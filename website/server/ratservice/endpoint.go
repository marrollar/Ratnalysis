package ratservice

import (
	"context"

	"github.com/go-kit/kit/endpoint"
)

type Endpoints struct {
	GetStations endpoint.Endpoint
}

func MakeEndpoints(s Service) Endpoints {
	return Endpoints{
		GetStations: makeGetStationsEndpoint(s),
	}
}

func makeGetStationsEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		stations, err := s.GetStations(ctx)

		return GetStationsResponse{
			Stations: stations,
		}, err
	}
}
