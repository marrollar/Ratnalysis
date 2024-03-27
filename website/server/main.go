package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"main/plotlyservice"
	"main/ratservice"
	"main/env"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
	"github.com/gorilla/mux"
	_ "modernc.org/sqlite"

	"net/http"
)

func main() {
	env.LoadVars()

	if env.DB_FILE == "" || env.PY_DIR == "" || env.PORT == "" || env.ALLOWED_ORIGINS == "" {
		fmt.Println("Environment variable(s) not found")
		os.Exit(1)
	}

	var httpaddr = flag.String("http", ":"+env.PORT, "Golang server addr")
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
		fmt.Println("Listening on port: ", *httpaddr)
		errs <- http.ListenAndServe(*httpaddr, mux)
	}()

	level.Error(logger_ratservice).Log("exit", <-errs)
}
