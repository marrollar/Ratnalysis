package ratservice

import (
	"context"
	"encoding/json"
	"net/http"
)

type (
	GetStationsResponse struct {
		Stations []Station `json:"stations"`
	}
)

// func encodeStationsResponse(ctx context.Context, w http.ResponseWriter, response interface{}) error {

// }

func encodeResponse(ctx context.Context, w http.ResponseWriter, response interface{}) error {
	return json.NewEncoder(w).Encode(response)
}