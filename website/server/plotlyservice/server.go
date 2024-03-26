package plotlyservice

import (
	"context"
	"net/http"

	httptransport "github.com/go-kit/kit/transport/http"
	"github.com/gorilla/mux"
)

func NewHttpServer(ctx context.Context, endpoints Endpoints) http.Handler {
	r := mux.NewRouter()
	r.Use(commonMiddleware)

	r.Methods("GET").Path("/ps/graphs/{id}").Handler(httptransport.NewServer(
		endpoints.GetStationSummary,
		decodeGetStationSummaryRequest,
		encodeResponse,
	))
	
	r.Methods("GET").Path("/ps/summary").Handler(httptransport.NewServer(
		endpoints.GetTotalSummary,
		httptransport.NopRequestDecoder,
		encodeResponse,
	))

	return r
}

func commonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		w.Header().Add("Access-Control-Allow-Origin", "http://129.80.154.53:3000")
		w.Header().Add("Access-Control-Allow-Methods", "GET")
		w.Header().Add("Access-Control-Allow-Headers", "Content-Type")
		next.ServeHTTP(w, r)
	})
}
