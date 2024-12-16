package main

import (
	_ "github.com/go-sql-driver/mysql"
	"log"
	"net/http"

	"web-forum/db"
	"web-forum/routes"
)

type User struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func main() {
	// Initialize database connection
	database, err := db.Connect()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Set up routes
	mux := routes.SetupRoutes(database)

	// Start the server
	log.Println("Server running on http://localhost:8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
