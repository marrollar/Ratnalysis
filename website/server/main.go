package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"main/ratservice"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-kit/log"
	"github.com/go-kit/log/level"
	_ "modernc.org/sqlite"

	"net/http"
)

const DB_FILE string = "../../python_data_management/rat_data.db"

func main() {
	var httpaddr = flag.String("http", ":8080", "Golang server addr")
	var logger log.Logger
	{
		logger = log.NewLogfmtLogger(os.Stderr)
		logger = log.NewSyncLogger(logger)
		logger = log.With(logger,
			"service", "ratservice",
			"time", log.DefaultTimestampUTC,
			"caller", log.DefaultCaller,
		)
	}

	level.Info(logger).Log("msg", "ratservice started")
	defer level.Info(logger).Log("msg", "ratservice stopped")

	var db *sql.DB
	{
		var err error
		db, err = sql.Open("sqlite", DB_FILE)
		if err != nil {
			level.Error(logger).Log("exit", err)
			os.Exit(-1)
		}
	}

	flag.Parse()
	ctx := context.Background()
	var srv ratservice.Service
	{
		repository := ratservice.NewRepo(db, logger)
		srv = ratservice.NewService(repository, logger)
	}

	errs := make(chan error)

	go func() {
		c := make(chan os.Signal, 1)
		signal.Notify(c, syscall.SIGINT, syscall.SIGTERM)
		errs <- fmt.Errorf("%s", <-c)
	}()

	endpoints := ratservice.MakeEndpoints(srv)

	go func() {
		fmt.Println("Listening on port: ", *httpaddr)
		handler := ratservice.NewHttpServer(ctx, endpoints)
		errs <- http.ListenAndServe(*httpaddr, handler)
	}()

	level.Error(logger).Log("exit", <-errs)
}
