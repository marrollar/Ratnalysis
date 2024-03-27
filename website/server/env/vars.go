package env

import (
	"os"

	"github.com/joho/godotenv"
)

var (
	DB_FILE         string
	PY_DIR          string
	PORT            string
	ALLOWED_ORIGINS string
)

func LoadVars() {
	envFile, err := godotenv.Read(".env")
	if err == nil {
		DB_FILE = envFile["DB_FILE"]
		PY_DIR = envFile["PY_DIR"]
		PORT = envFile["PORT"]
		ALLOWED_ORIGINS = envFile["ALLOWED_ORIGINS"]
	} else {
		DB_FILE = os.Getenv("DB_FILE")
		PY_DIR = os.Getenv("PY_DIR")
		PORT = os.Getenv("PORT")
		ALLOWED_ORIGINS = os.Getenv("ALLOWED_ORIGINS")
	}
}
