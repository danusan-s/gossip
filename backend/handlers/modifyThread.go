package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ThreadCreate struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Author      string `json:"author"`
	Category    string `json:"category"`
}

// CreateThreadHandler handles the creation of a new Thread
func CreateThreadHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for CreateThread")

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		var body ThreadCreate
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

		if len(body.Title) > 100 {
			http.Error(w, "Title is too long", http.StatusBadRequest)
			log.Println("Title is too long")
			return
		}

		var categoryID int
		err := db.QueryRow("SELECT id FROM CATEGORIES WHERE category=?", body.Category).Scan(&categoryID)
		if err != nil {
			http.Error(w, "Failed to get category ID", http.StatusInternalServerError)
			log.Println("Error getting category ID from database:", err)
			return
		}

		query := "INSERT INTO THREADS (title, description, author, category_id) VALUES (?, ?, ?, ?)"
		_, err = db.Exec(query, body.Title, body.Description, body.Author, categoryID)
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

// DeleteThreadHandler handles the deletion of a Thread
func DeleteThreadHandler(db *sql.DB) http.HandlerFunc {
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

		user := r.Context().Value("user").(string) // Retrieving the user (username)

		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		log.Println("Received request for DeleteThread")

		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "DELETE FROM THREADS WHERE id=? AND author=?"
		_, err = db.Exec(query, threadID, user)
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

// Similar to create but modifies existing thread
func UpdateThreadHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for UpdateThread")

		if r.Method != http.MethodPut {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		idStr := mux.Vars(r)["id"]
		threadID, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid Thread ID", http.StatusBadRequest)
			log.Println("Invalid Thread ID:", err)
			return
		}

		user := r.Context().Value("user").(string)
		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		userQuery := "SELECT author FROM THREADS WHERE id=?"
		var author string
		err = db.QueryRow(userQuery, threadID).Scan(&author)
		if err != nil {
			http.Error(w, "Failed to get author", http.StatusInternalServerError)
			log.Println("Error getting author from database:", err)
			return
		}

		if user != author {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var body ThreadCreate
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

		if len(body.Title) > 100 {
			http.Error(w, "Title is too long", http.StatusBadRequest)
			log.Println("Title is too long")
			return
		}

		var categoryID int
		err = db.QueryRow("SELECT id FROM CATEGORIES WHERE category=?", body.Category).Scan(&categoryID)
		if err != nil {
			http.Error(w, "Failed to get category ID", http.StatusInternalServerError)
			log.Println("Error getting category ID from database:", err)
			return
		}

		query := "UPDATE THREADS SET title=?, description=?, author=?, category_id=? WHERE id=?"
		_, err = db.Exec(query, body.Title, body.Description, body.Author, categoryID, threadID)
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
