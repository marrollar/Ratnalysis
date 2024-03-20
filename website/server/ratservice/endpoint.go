package ratservice

import (
	"context"

	"github.com/go-kit/kit/endpoint"
)

type Endpoints struct {
	GetStations   endpoint.Endpoint
	GetLastRecord endpoint.Endpoint
	GetLastRecords endpoint.Endpoint
}

func MakeEndpoints(s Service) Endpoints {
	return Endpoints{
		GetStations:   makeGetStationsEndpoint(s),
		GetLastRecord: makeGetLastRecordEndpoint(s),
		GetLastRecords: makeGetLastRecordsEndpoint(s),
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

func makeGetLastRecordEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		req := request.(GetLastRecordRequest)
		record, err := s.GetLastRecord(ctx, req.ID)

		return GetLastRecordResponse{
			Record: record,
		}, err
	}
}


func makeGetLastRecordsEndpoint(s Service) endpoint.Endpoint {
	return func(ctx context.Context, request interface{}) (interface{}, error) {
		records, err := s.GetLastRecords(ctx)

		return GetLastRecordsResponse{
			Records: records,
		}, err
	}
}

