package env

import (
	"fmt"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

var (
	DB_FILE              string
	PY_DIR               string
	HTTP_PORT            string
	HTTPS_PORT           string
	ALLOWED_ORIGINS      []string
	TLS_CERT_PATH        string
	TLS_KEY_PATH         string
	CLOUDFLARE_CERT_PATH string
)

func LoadVars() {
	envFile, err := godotenv.Read(".env")
	if err == nil {
		DB_FILE = envFile["DB_FILE"]
		PY_DIR = envFile["PY_DIR"]
		HTTP_PORT = envFile["HTTP_PORT"]
		HTTPS_PORT = envFile["HTTPS_PORT"]
		ALLOWED_ORIGINS = strings.Split(envFile["ALLOWED_ORIGINS"], ",")
		TLS_CERT_PATH = envFile["TLS_CERT_PATH"]
		TLS_KEY_PATH = envFile["TLS_KEY_PATH"]
		CLOUDFLARE_CERT_PATH = envFile["CLOUDFLARE_CERT_PATH"]
	} else {
		DB_FILE = os.Getenv("DB_FILE")
		PY_DIR = os.Getenv("PY_DIR")
		HTTP_PORT = os.Getenv("HTTP_PORT")
		HTTPS_PORT = os.Getenv("HTTPS_PORT")
		ALLOWED_ORIGINS = strings.Split(os.Getenv("ALLOWED_ORIGINS"), ",")
		TLS_CERT_PATH = os.Getenv("TLS_CERT_PATH")
		TLS_KEY_PATH = os.Getenv("TLS_KEY_PATH")
		CLOUDFLARE_CERT_PATH = os.Getenv("CLOUDFLARE_CERT_PATH")
	}
	if DB_FILE == "" ||
		PY_DIR == "" ||
		HTTP_PORT == "" ||
		HTTPS_PORT == "" ||
		len(ALLOWED_ORIGINS) == 0 ||
		TLS_CERT_PATH == "" ||
		TLS_KEY_PATH == "" ||
		CLOUDFLARE_CERT_PATH == "" {
		fmt.Println("Environment variable(s) not found")
		os.Exit(1)
	}
}
