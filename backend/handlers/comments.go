package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type CommentGet struct {
	ID      int    `json:"id"`
	Content string `json:"content"`
	Author  string `json:"author"`
}

type CommentCreate struct {
	Content string `json:"content"`
	Author  string `json:"author"`
}

// GetCommentsHandler retrieves all comments for a forum from the database
func GetCommentsHandler(db *sql.DB) http.HandlerFunc {
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
		log.Println("Received request for GetAllForums")

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "SELECT id, content, author FROM comments WHERE forum_id = ?"
		rows, err := db.Query(query, forumID)
		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			log.Println("Error querying database:", err)
			return
		}
		defer rows.Close()

		var comments []CommentGet
		for rows.Next() {
			var comment CommentGet
			if err := rows.Scan(&comment.ID, &comment.Content, &comment.Author); err != nil {
				http.Error(w, "Failed to parse database rows", http.StatusInternalServerError)
				log.Println("Error parsing database row:", err)
				return
			}
			comments = append(comments, comment)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, "Error iterating database rows", http.StatusInternalServerError)
			log.Println("Error iterating database rows:", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(comments); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Println("Successfully fetched comments")
	}
}

// CreateCommentHandler creates a new comment in the database
func CreateCommentHandler(db *sql.DB) http.HandlerFunc {
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

		log.Println("Received request for CreateComment")

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		var body CommentCreate
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			log.Println("Error decoding request body:", err)
			return
		}

		if body.Content == "" {
			http.Error(w, "Content is required.", http.StatusBadRequest)
			log.Println("Content is required.")
			return
		}

		query := "INSERT INTO comments (content, author, forum_id) VALUES (?, ?, ?)"
		_, err = db.Exec(query, body.Content, body.Author, forumID)
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
