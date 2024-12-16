package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

type ForumGet struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
}

type ForumCreate struct {
	Title       string `json:"title"`
	Description string `json:"description"`
}

func GetForumsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		rows, err := db.Query("SELECT id, title, description FROM forums")
		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		// Parse rows into an array of Forum structs
		var forums []ForumGet
		for rows.Next() {
			var forum ForumGet
			if err := rows.Scan(&forum.ID, &forum.Title, &forum.Description); err != nil {
				http.Error(w, "Failed to parse database rows", http.StatusInternalServerError)
				return
			}
			forums = append(forums, forum)
		}

		// Check for errors after row iteration
		if err := rows.Err(); err != nil {
			http.Error(w, "Error iterating database rows", http.StatusInternalServerError)
			return
		}

		// Send the forums as a JSON response
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(forums); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
		}
	}
}

func CreateForumHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}
		var body ForumCreate

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
			http.Error(w, "Failed to insert data", http.StatusInternalServerError)
			return
		}

		// Respond with success
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully submitted"}`))
	}
}
