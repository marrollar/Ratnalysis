package plotlyservice

import (
	"context"

	"github.com/go-kit/kit/endpoint"
)

type Endpoints struct {
	GetStationSummary endpoint.Endpoint
	GetTotalSummary   endpoint.Endpoint
}

func MakeEndpoints(s Service) Endpoints {
	return Endpoints{
		GetStationSummary: makeGetStationSummaryEndpoint(s),
		GetTotalSummary:   makeGetTotalSummaryEndpoint(s),
	}
}

func makeGetStationSummaryEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req := request.(GetStationSummaryRequest)
		pjson, err := s.GetStationSummary(ctx, req.ID)

		return GetStationSummaryResponse{
			PJSON: pjson,
		}, err
	}
}

func makeGetTotalSummaryEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		pjson, err := s.GetTotalSummary(ctx)
		return GetStationSummaryResponse{
			PJSON: pjson,
		}, err
	}
}
