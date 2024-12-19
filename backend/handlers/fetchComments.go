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

type CommentGet struct {
	ID      int    `json:"id"`
	ForumID int    `json:"forum_id"`
	Content string `json:"content"`
	Author  string `json:"author"`
	Time    string `json:"time"`
}

// GetCommentsByUserHandler retrieves all comments of a forum from the database
func GetCommentsByForumHandler(db *sql.DB) http.HandlerFunc {
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
		log.Println("Received request for GetAllComments")

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "SELECT id, content, author, created_at FROM comments WHERE forum_id=?"
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
			comment.ForumID = forumID
			var commentTime time.Time
			if err := rows.Scan(&comment.ID, &comment.Content, &comment.Author, &commentTime); err != nil {
				http.Error(w, "Failed to parse database rows", http.StatusInternalServerError)
				log.Println("Error parsing database row:", err)
				return
			}
			comment.Time = commentTime.Format(time.RFC3339)
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

// GetCommentsByUserHandler retrieves all comments for a user from the database
func GetCommentsByUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		user := vars["user"]
		log.Printf("Username: %s", user)

		log.Println("Received request for GetCommentsForUser")

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "SELECT id,forum_id, content, created_at FROM comments WHERE author=?"
		rows, err := db.Query(query, user)
		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			log.Println("Error querying database:", err)
			return
		}
		defer rows.Close()

		var comments []CommentGet
		for rows.Next() {
			var comment CommentGet
			comment.Author = user
			var commentTime time.Time
			if err := rows.Scan(&comment.ID, &comment.ForumID, &comment.Content, &commentTime); err != nil {
				http.Error(w, "Failed to parse database rows", http.StatusInternalServerError)
				log.Println("Error parsing database row:", err)
				return
			}
			comment.Time = commentTime.Format(time.RFC3339)
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

		log.Printf("Successfully fetched comments with author %s", user)
	}
}
