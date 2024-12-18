package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ForumCreate struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Author      string `json:"author"`
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

// DeleteForumHandler handles the deletion of a forum
func DeleteForumHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Forum ID: %s", idStr)

		forumID, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid forum ID", http.StatusBadRequest)
			log.Println("Invalid forum ID:", err)
			return
		}

		user := r.Context().Value("user").(string) // Retrieving the user (username)

		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		log.Println("Received request for DeleteForum")

		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "DELETE FROM forums WHERE id=? AND author=?"
		_, err = db.Exec(query, forumID, user)
		if err != nil {
			http.Error(w, "Failed to delete data", http.StatusInternalServerError)
			log.Println("Error deleting data from database:", err)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully deleted"}`))
		log.Println("Forum deleted successfully")
	}
}
