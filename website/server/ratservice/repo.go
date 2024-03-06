package ratservice

import (
	"context"
	"database/sql"
	"errors"

	"github.com/go-kit/log"
)

var ErrGetStations = errors.New("failed to retrieve all stations")

type repo struct {
	db     *sql.DB
	logger log.Logger
}

func NewRepo(db *sql.DB, logger log.Logger) Repository {
	return &repo{
		db:     db,
		logger: log.With(logger, "repo", "sqlite3"),
	}
}

func (repo *repo) GetStations(ctx context.Context) ([]Station, error) {
	const SELECT_ALL_LOCATIONS string = `
		SELECT * FROM stations
	`
	rows, err := repo.db.QueryContext(ctx, SELECT_ALL_LOCATIONS)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var stations []Station
	for rows.Next() {
		var station Station

		if err := rows.Scan(&station.ID, &station.Name, &station.LinesServed, &station.Latitude, &station.Longitude); err != nil {
			return stations, err
		}

		stations = append(stations, station)
	}

	if err = rows.Err(); err != nil {
		return stations, err
	}

	return stations, nil
}
