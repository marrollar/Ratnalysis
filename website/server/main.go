package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"main/env"
	"main/plotlyservice"
	"main/ratservice"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
	"github.com/gorilla/mux"
	_ "modernc.org/sqlite"

	"crypto/tls"
	"crypto/x509"
	"net/http"
)

func main() {
	env.LoadVars()

	var httpaddr = flag.String("http", ":"+env.HTTP_PORT, "Golang server addr")
	var httpsaddr = flag.String("https", ":"+env.HTTPS_PORT, "Golang server addr")

	var logger_ratservice log.Logger
	var logger_plotlyservice log.Logger
	{
		logger_ratservice = log.NewLogfmtLogger(os.Stderr)
		logger_ratservice = log.NewSyncLogger(logger_ratservice)
		logger_ratservice = log.With(logger_ratservice,
			"service", "ratservice",
			"time", log.DefaultTimestampUTC,
			"caller", log.DefaultCaller,
		)

		logger_plotlyservice = log.NewLogfmtLogger(os.Stderr)
		logger_plotlyservice = log.NewSyncLogger(logger_plotlyservice)
		logger_plotlyservice = log.With(logger_plotlyservice,
			"service", "plotlyservice",
			"time", log.DefaultTimestampUTC,
			"caller", log.DefaultCaller,
		)
	}

	level.Info(logger_ratservice).Log("msg", "ratservice started")
	defer level.Info(logger_ratservice).Log("msg", "ratservice stopped")

	level.Info(logger_plotlyservice).Log("msg", "plotlyservice started")
	defer level.Info(logger_plotlyservice).Log("msg", "plotlyservice stopped")

	var db *sql.DB
	{
		var err error
		db, err = sql.Open("sqlite", env.DB_FILE)
		if err != nil {
			level.Error(logger_ratservice).Log("exit", err)
			os.Exit(-1)
		}
	}

	flag.Parse()
	ratservice_ctx := context.Background()
	plotlyservice_ctx := context.Background()
	var ratservice_srv ratservice.Service
	var plotlyservice_srv plotlyservice.Service
	{
		repository := ratservice.NewRepo(db, logger_ratservice)
		ratservice_srv = ratservice.NewService(repository, logger_ratservice)
		plotlyservice_srv = plotlyservice.NewService(logger_plotlyservice, env.PY_DIR)
	}

	errs := make(chan error)

	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, syscall.SIGINT, syscall.SIGTERM)
		errs <- fmt.Errorf("%s", <-c)
	}()

	ratservice_endpoints := ratservice.MakeEndpoints(ratservice_srv)
	plotlyservice_endpoints := plotlyservice.MakeEndpoints(plotlyservice_srv)

	// mux := http.NewServeMux()
	// mux.Handle("/rs", ratservice.NewHttpServer(ratservice_ctx, ratservice_endpoints))
	// mux.Handle("/ps", plotlyservice.NewHttpServer(plotlyservice_ctx, plotlyservice_endpoints))

	// http.Handle("/", mux)

	mux := mux.NewRouter()
	mux.PathPrefix("/rs").Handler(ratservice.NewHttpServer(ratservice_ctx, ratservice_endpoints))
	mux.PathPrefix("/ps").Handler(plotlyservice.NewHttpServer(plotlyservice_ctx, plotlyservice_endpoints))

	go func() {
		fmt.Println("HTTP Listening on port: ", *httpaddr)
		errs <- http.ListenAndServe(*httpaddr, mux)
	}()

	serverCert, err := tls.LoadX509KeyPair(env.TLS_CERT_PATH, env.TLS_KEY_PATH)
	if err != nil {
		fmt.Println("Error loading certificate and private key:", err)
		return
	}

	// Load Cloudflare's root certificate
	cfCert, err := os.ReadFile(env.CLOUDFLARE_CERT_PATH)
	if err != nil {
		fmt.Println("Error loading Cloudflare root certificate:", err)
		return
	}

	// Create a certificate pool and add Cloudflare's root certificate to it
	rootCAs := x509.NewCertPool()
	if !rootCAs.AppendCertsFromPEM(cfCert) {
		fmt.Println("Failed to add Cloudflare root certificate to pool")
		return
	}

	tlsConfig := &tls.Config{
		Certificates: []tls.Certificate{serverCert},
		RootCAs:      rootCAs,
	}

	https_srv := &http.Server{
		Addr:      *httpsaddr,
		Handler:   mux,
		TLSConfig: tlsConfig,
	}

	go func() {
		fmt.Println("HTTPS Listening on port: ", *httpsaddr)
		errs <- https_srv.ListenAndServeTLS(env.TLS_CERT_PATH, env.TLS_KEY_PATH)
	}()

	level.Error(logger_ratservice).Log("exit", <-errs)
}
