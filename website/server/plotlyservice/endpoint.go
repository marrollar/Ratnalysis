package plotlyservice

import (
	"context"

	"github.com/go-kit/kit/endpoint"
)

type Endpoints struct {
	GetStationSummary endpoint.Endpoint
}

func MakeEndpoints(s Service) Endpoints {
	return Endpoints{
		GetStationSummary: makeGetStationSummaryEndpoint(s),
	}
}

func makeGetStationSummaryEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req := request.(GetStationSummaryRequest)
		html, err := s.GetStationSummary(ctx, req.ID)

		return GetStationSummaryResponse{
			HTML: html,
		}, err
	}
}
