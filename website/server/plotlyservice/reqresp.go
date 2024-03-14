package plotlyservice

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/gorilla/mux"
)

type (
	GetStationSummaryRequest struct {
		ID string `json:"id"`
	}
	GetStationSummaryResponse struct {
		PJSON string `json:"pjson"`
	}
)

func encodeResponse(ctx context.Context, w http.ResponseWriter, response interface{}) error {
	return json.NewEncoder(w).Encode(response)
}

func decodeGetStationSummaryRequest(ctx context.Context, r *http.Request) (interface{}, error) {
	var req GetStationSummaryRequest
	vars := mux.Vars(r)

	req = GetStationSummaryRequest{
		ID: vars["id"],
	}

	return req, nil
}
