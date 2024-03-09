package ratservice

import (
	"context"
	"net/http"

	httptransport "github.com/go-kit/kit/transport/http"
	"github.com/gorilla/mux"
)

func NewHttpServer(ctx context.Context, endpoints Endpoints) http.Handler {
	r := mux.NewRouter()
	r.Use(commonMiddleware)

	r.Methods("GET").Path("/stations").Handler(httptransport.NewServer(
		endpoints.GetStations,
		httptransport.NopRequestDecoder,
		encodeResponse,
	))

	r.Methods("GET").Path("/lastrecord/{id}").Handler(httptransport.NewServer(
		endpoints.GetLastRecord,
		decodeGetLastRecordRequest,
		encodeResponse,
	))

	r.Methods("GET").Path("/lastrecords").Handler(httptransport.NewServer(
		endpoints.GetLastRecords,
		httptransport.NopRequestDecoder,
		encodeResponse,
	))

	return r
}

func commonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		w.Header().Add("Access-Control-Allow-Origin", "*")
		next.ServeHTTP(w, r)
	})
}
