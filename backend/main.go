package main

import (
	_ "github.com/go-sql-driver/mysql"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"web-forum/db"
	"web-forum/routes"
)

type User struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	port = ":" + port

	// Initialize database connection
	database, err := db.Connect()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer database.Close()

	// Set up routes
	mux := routes.SetupRoutes(database)

	// Start the server
	log.Printf("Server running on http://localhost%s", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatalf("Server failed: %v", err)
	}
}
