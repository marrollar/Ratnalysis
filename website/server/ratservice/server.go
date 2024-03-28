package ratservice

import (
	"context"
	"main/env"
	"net/http"

	httptransport "github.com/go-kit/kit/transport/http"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func NewHttpServer(ctx context.Context, endpoints Endpoints) http.Handler {
	r := mux.NewRouter()
	r.Use(commonMiddleware)

	r.Methods("GET").Path("/rs/stations").Handler(httptransport.NewServer(
		endpoints.GetStations,
		httptransport.NopRequestDecoder,
		encodeResponse,
	))

	r.Methods("GET").Path("/rs/lastrecord/{id}").Handler(httptransport.NewServer(
		endpoints.GetLastRecord,
		decodeGetLastRecordRequest,
		encodeResponse,
	))

	r.Methods("GET").Path("/rs/lastrecords").Handler(httptransport.NewServer(
		endpoints.GetLastRecords,
		httptransport.NopRequestDecoder,
		encodeResponse,
	))

	c := cors.New(cors.Options{
		AllowedOrigins: env.ALLOWED_ORIGINS,
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Origin", "Content-Type"},
		Debug:          true,
	})

	return c.Handler(r)
}

func commonMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}
