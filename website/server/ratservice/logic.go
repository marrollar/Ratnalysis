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
