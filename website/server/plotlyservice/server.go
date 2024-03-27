package plotlyservice

import (
	"context"
	"main/env"
	"net/http"
	"strings"

	httptransport "github.com/go-kit/kit/transport/http"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
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

	c := cors.New(cors.Options{
		AllowedOrigins: strings.Split(env.ALLOWED_ORIGINS, ","),
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
