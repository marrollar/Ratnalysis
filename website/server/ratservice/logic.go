package ratservice

import (
	"context"

	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
)

type service struct {
	repository Repository
	logger     log.Logger
}

func NewService(rep Repository, logger log.Logger) Service {
	return &service{
		repository: rep,
		logger:     logger,
	}
}


func (s service) GetStations(ctx context.Context) ([]Station, error) {
	logger := log.With(s.logger, "method", "GetStations")

	stations, err := s.repository.GetStations(ctx)
	if err != nil {
		level.Error(logger).Log("err", err)
		return nil, err
	}

	logger.Log("status", "ok")

	return stations, nil
}

func (s service) GetLastRecord(ctx context.Context, station_id string) (*SightingRecord, error) {
	logger := log.With(s.logger, "method", "GetLastRecord")

	record, err := s.repository.GetLastRecord(ctx, station_id)
	if err != nil {
		level.Error(logger).Log("err", err)
		return nil, err
	}

	logger.Log("status", "ok")
	
	return record, nil
}

func (s service) GetLastRecords(ctx context.Context) ([]SightingRecord, error) {
	logger := log.With(s.logger, "method", "GetLastRecords")

	records, err := s.repository.GetLastRecords(ctx)
	if err != nil {
		level.Error(logger).Log("err", err)
		return nil, err
	}

	logger.Log("status", "ok")
	
	return records, nil
}