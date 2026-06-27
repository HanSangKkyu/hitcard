package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB

func initDB() error {
	user := envOr("DB_USER", "hitcard")
	pass := envOr("DB_PASSWORD", "hitcard")
	host := envOr("DB_HOST", "localhost")
	port := envOr("DB_PORT", "3306")
	name := envOr("DB_NAME", "HITCARD")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true",
		user, pass, host, port, name,
	)

	var err error
	db, err = sql.Open("mysql", dsn)
	if err != nil {
		return err
	}
	return db.Ping()
}

func envOr(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
