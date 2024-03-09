package ratservice

import (
	"context"
	"database/sql"
	"errors"

	"github.com/go-kit/log"
)

var ErrGetStations = errors.New("failed to retrieve all stations")
var ErrGetLastRecord = errors.New("failed to retrieve most recent record for requested station")

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

func (repo *repo) GetLastRecord(ctx context.Context, station_id string) (*SightingRecord, error) {
	const SELECT_LAST_RECORD string = `
		SELECT * FROM sightings WHERE station_id=$1 ORDER BY date(date_end) DESC Limit 1
	`

	rows, err := repo.db.QueryContext(ctx, SELECT_LAST_RECORD, station_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var record SightingRecord

	for rows.Next() {
		if err := rows.Scan(&record.ID, &record.SoMany, &record.OneOrTwo, &record.None, &record.DateStart, &record.DateEnd); err != nil {
			return &record, err
		}
	}

	if err = rows.Err(); err != nil {
		return &record, err
	}

	return &record, nil
}

func (repo *repo) GetLastRecords(ctx context.Context) ([]SightingRecord, error) {
	const SELECT_LAST_RECORD string = `
		SELECT station_id, so_many, one_or_two, none, date_start, date_end
		FROM (
			SELECT *, max(date(date_end)) as latest
			FROM sightings
			GROUP BY station_id
		)
	`

	rows, err := repo.db.QueryContext(ctx, SELECT_LAST_RECORD)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var records []SightingRecord
	for rows.Next() {
		var record SightingRecord
		if err := rows.Scan(&record.ID, &record.SoMany, &record.OneOrTwo, &record.None, &record.DateStart, &record.DateEnd); err != nil {
			return records, err
		}
		records = append(records, record)
	}

	if err = rows.Err(); err != nil {
		return records, err
	}

	return records, nil
}
