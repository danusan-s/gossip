package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ForumGet struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Author      string `json:"author"`
}

type ForumCreate struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Author      string `json:"author"`
}

// GetAllForumsHandler retrieves all forums from the database
func GetAllForumsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetAllForums")

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		rows, err := db.Query("SELECT id, title, description, author FROM forums")
		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			log.Println("Error querying database:", err)
			return
		}
		defer rows.Close()

		var forums []ForumGet
		for rows.Next() {
			var forum ForumGet
			if err := rows.Scan(&forum.ID, &forum.Title, &forum.Description, &forum.Author); err != nil {
				http.Error(w, "Failed to parse database rows", http.StatusInternalServerError)
				log.Println("Error parsing database row:", err)
				return
			}
			forums = append(forums, forum)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, "Error iterating database rows", http.StatusInternalServerError)
			log.Println("Error iterating database rows:", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(forums); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Println("Successfully fetched forums")
	}
}

// GetForumByIDHandler retrieves a specific forum by ID from the database
func GetForumByIDHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetForumByID")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Forum ID: %s", idStr)

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid forum ID", http.StatusBadRequest)
			log.Println("Invalid forum ID:", err)
			return
		}

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "SELECT title, description, author FROM forums WHERE id = ?"
		row := db.QueryRow(query, id)

		var forum ForumGet
		forum.ID = id
		if err := row.Scan(&forum.Title, &forum.Description, &forum.Author); err != nil {
			http.Error(w, "Failed to parse database row", http.StatusInternalServerError)
			log.Println("Error parsing database row:", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(forum); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Printf("Successfully fetched forum with ID %d", forum.ID)
	}
}

// CreateForumHandler handles the creation of a new forum
func CreateForumHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for CreateForum")

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		var body ForumCreate
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			log.Println("Error decoding request body:", err)
			return
		}

		if body.Title == "" || body.Description == "" {
			http.Error(w, "Title and Description are required", http.StatusBadRequest)
			log.Println("Title or Description is missing")
			return
		}

		query := "INSERT INTO forums (title, description, author) VALUES (?, ?, ?)"
		_, err := db.Exec(query, body.Title, body.Description, body.Author)
		if err != nil {
			http.Error(w, "Failed to insert data", http.StatusInternalServerError)
			log.Println("Error inserting data into database:", err)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully submitted"}`))
		log.Println("Forum created successfully")
	}
}
