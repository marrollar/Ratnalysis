package plotlyservice

import (
	"context"
	"os/exec"

	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
)

type service struct {
	py_dir string
	logger log.Logger
}

func NewService(logger log.Logger, py_dir string) Service {
	return &service{
		py_dir: py_dir,
		logger: logger,
	}
}

func (s service) GetStationSummary(ctx context.Context, station_id string) (string, error) {
	logger := log.With(s.logger, "method", "GetStationSummary")

	cmd := exec.Command(
		"python",
		"graphs.py",
		"plot_station_summary",
		station_id)
	cmd.Dir = s.py_dir

	out, err := cmd.CombinedOutput()
	if err != nil {
		level.Error(logger).Log("err", err)
		return string(out[:]), err
	}
	logger.Log("status", "ok")

	return string(out[:]), nil
}
