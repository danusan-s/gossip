package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type CommentCreate struct {
	Content string `json:"content"`
	Author  string `json:"author"`
}

// CreateCommentHandler creates a new comment in the database
func CreateCommentHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Thread ID: %s", idStr)

		threadID, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid Thread ID", http.StatusBadRequest)
			log.Println("Invalid Thread ID:", err)
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

		query := "INSERT INTO COMMENTS (content, author, thread_id) VALUES (?, ?, ?)"
		_, err = db.Exec(query, body.Content, body.Author, threadID)
		if err != nil {
			http.Error(w, "Failed to insert data", http.StatusInternalServerError)
			log.Println("Error inserting data into database:", err)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully submitted"}`))
		log.Println("Thread created successfully")
	}
}

// DeleteCommentHandler deletes a comment from the database
func DeleteCommentHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Comment ID: %s", idStr)

		commentId, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid comment ID", http.StatusBadRequest)
			log.Println("Invalid comment ID:", err)
			return
		}

		user := r.Context().Value("user").(string) // Retrieving the user (username)

		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		log.Println("Received request for DeleteComment")

		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "DELETE FROM COMMENTS WHERE id=? AND author=?"
		_, err = db.Exec(query, commentId, user)
		if err != nil {
			http.Error(w, "Failed to delete data", http.StatusInternalServerError)
			log.Println("Error deleting data from database:", err)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully deleted"}`))
		log.Println("Thread deleted successfully")
	}
}

// Similar to create but modifies existing comment
func UpdateCommentHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for UpdateComment")

		if r.Method != http.MethodPut {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		idStr := mux.Vars(r)["id"]
		commentID, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid Comment ID", http.StatusBadRequest)
			log.Println("Invalid Comment ID:", err)
			return
		}

		user := r.Context().Value("user").(string)
		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		userQuery := "SELECT author FROM COMMENTS WHERE id=?"
		var author string
		err = db.QueryRow(userQuery, commentID).Scan(&author)
		if err != nil {
			http.Error(w, "Failed to get author", http.StatusInternalServerError)
			log.Println("Error getting author from database:", err)
			return
		}

		if user != author {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
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

		query := "UPDATE COMMENTS SET content=? WHERE id=?"
		_, err = db.Exec(query, body.Content, commentID)
		if err != nil {
			http.Error(w, "Failed to insert data", http.StatusInternalServerError)
			log.Println("Error inserting data into database:", err)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully submitted"}`))
		log.Println("Thread created successfully")
	}
}
