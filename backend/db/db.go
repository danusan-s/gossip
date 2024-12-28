package db

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func Connect() (*sql.DB, error) {
	// Get database connection details from environment variables
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// Construct the DSN (Data Source Name)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&tls=true", dbUser, dbPassword, dbHost, dbPort, dbName)

	// Open the database connection
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database connection: %v", err)
	}

	// Check the connection with the database
	if err := db.Ping(); err != nil {
		db.Close() // Ensure resources are freed in case of an error
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	fmt.Println("Successfully connected to the database")

	return db, nil
}
