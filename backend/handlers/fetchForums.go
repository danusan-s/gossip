package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

type ForumGet struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Author      string `json:"author"`
	Time        string `json:"time"`
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

		rows, err := db.Query("SELECT id, title, description, author, created_at FROM forums")
		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			log.Println("Error querying database:", err)
			return
		}
		defer rows.Close()

		var forums []ForumGet
		for rows.Next() {
			var forum ForumGet
			var forumTime time.Time
			if err := rows.Scan(&forum.ID, &forum.Title, &forum.Description, &forum.Author, &forumTime); err != nil {
				http.Error(w, "Failed to parse database rows", http.StatusInternalServerError)
				log.Println("Error parsing database row:", err)
				return
			}
			forum.Time = forumTime.Format(time.RFC3339)
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

		query := "SELECT title, description, author, created_at FROM forums WHERE id = ?"
		row := db.QueryRow(query, id)

		var forum ForumGet
		forum.ID = id
		var forumTime time.Time
		if err := row.Scan(&forum.Title, &forum.Description, &forum.Author, &forumTime); err != nil {
			http.Error(w, "Failed to parse database row", http.StatusInternalServerError)
			log.Println("Error parsing database row:", err)
			return
		}
		forum.Time = forumTime.Format(time.RFC3339)

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(forum); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Printf("Successfully fetched forum with ID %d", forum.ID)
	}
}

// GetForumsByUserHandler retrieves all forums by a specific user from the database
func GetForumsByUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetForumByID")

		vars := mux.Vars(r)
		user := vars["user"]
		log.Printf("Username: %s", user)

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "SELECT id, title, description, created_at FROM forums WHERE author = ?"
		row := db.QueryRow(query, user)

		var forum ForumGet
		forum.Author = user
		var forumTime time.Time
		if err := row.Scan(&forum.ID, &forum.Title, &forum.Description, &forumTime); err != nil {
			http.Error(w, "Failed to parse database row", http.StatusInternalServerError)
			log.Println("Error parsing database row:", err)
			return
		}
		forum.Time = forumTime.Format(time.RFC3339)

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(forum); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Printf("Successfully fetched forum with author %s", forum.Author)
	}
}
