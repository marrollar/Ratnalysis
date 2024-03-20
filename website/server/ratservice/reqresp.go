package ratservice

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

type (
	GetStationsResponse struct {
		Stations []Station `json:"stations"`
	}

	GetLastRecordRequest struct {
		ID string `json:"id"`
	}
	GetLastRecordResponse struct {
		Record *SightingRecord `json:"record"`
	}

	GetLastRecordsResponse struct {
		Records []SightingRecord `json:"records"`
	}
)

func encodeResponse(ctx context.Context, w http.ResponseWriter, response interface{}) error {
	return json.NewEncoder(w).Encode(response)
}

func decodeGetLastRecordRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var req GetLastRecordRequest
	vars := mux.Vars(r)

	req = GetLastRecordRequest{
		ID: vars["id"],
	}

	return req, nil
}
