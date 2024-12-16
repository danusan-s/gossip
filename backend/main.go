package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
)


type Forum struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

func main() {
	// Load environment variables from .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Get database connection details from environment variables
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbName := os.Getenv("DB_NAME")

	// Construct the DSN (Data Source Name)
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", dbUser, dbPassword, dbHost, dbPort, dbName)

	// Open the database connection
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	// Close the database at the end of the function
	defer db.Close()

	//Check the connection with the db
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Successfully connected to the database")

	http.HandleFunc("/forums", func(w http.ResponseWriter, r *http.Request) {
		handleForums(w, r, db)
	})

	log.Println("Server is running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))

}

func handleForums(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method == http.MethodGet {
		rows, err := db.Query("SELECT title, description FROM forums")
		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			log.Println("Database query error:", err)
			return
		}
		defer rows.Close()

		// Parse rows into an array of Forum structs
		var forums []Forum
		for rows.Next() {
			var forum Forum
			if err := rows.Scan(&forum.Title, &forum.Description); err != nil {
				http.Error(w, "Failed to parse database rows", http.StatusInternalServerError)
				log.Println("Row scan error:", err)
				return
			}
			forums = append(forums, forum)
		}

		// Check for errors after row iteration
		if err := rows.Err(); err != nil {
			http.Error(w, "Error iterating database rows", http.StatusInternalServerError)
			log.Println("Row iteration error:", err)
			return
		}

		// Send the forums as a JSON response
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(forums); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("JSON encoding error:", err)
		}
	} else if r.Method == http.MethodPost {
		var body Forum
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		if body.Title == "" || body.Description == "" {
			http.Error(w, "Title and Description are required", http.StatusBadRequest)
			return
		}

		// Insert into the database
		query := "INSERT INTO forums (title, description) VALUES (?, ?)"
		_, err := db.Exec(query, body.Title, body.Description)
		if err != nil {
			log.Printf("Error inserting into database: %v", err)
			http.Error(w, "Failed to insert data", http.StatusInternalServerError)
			return
		}

		// Respond with success
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully submitted"}`))
	} else {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}
	return
}
