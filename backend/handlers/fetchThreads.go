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

type ThreadGet struct {
	ID          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Author      string `json:"author"`
	Category    string `json:"category"`
	Time        string `json:"time"`
}

func findCategoryByID(db *sql.DB, id int) (string, error) {
	var category string
	err := db.QueryRow("SELECT category FROM CATEGORIES WHERE id = ?", id).Scan(&category)
	if err != nil {
		log.Println("Error querying database:", err)
		return "", err
	}
	return category, nil
}

// GetAllThreadsHandler retrieves all Threads from the database
func GetAllThreadsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetAllThreads")

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		rows, err := db.Query("SELECT id, title, description, author, category_id, created_at FROM THREADS")
		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			log.Println("Error querying database:", err)
			return
		}
		defer rows.Close()

		var threads []ThreadGet
		for rows.Next() {
			var thread ThreadGet
			var threadTime time.Time
			var categoryID int
			if err := rows.Scan(&thread.ID, &thread.Title, &thread.Description, &thread.Author, &categoryID, &threadTime); err != nil {
				http.Error(w, "Failed to parse database rows", http.StatusInternalServerError)
				log.Println("Error parsing database row:", err)
				return
			}
			thread.Category, err = findCategoryByID(db, categoryID)
			if err != nil {
				http.Error(w, "Failed to find category", http.StatusInternalServerError)
				return
			}
			thread.Time = threadTime.Format(time.RFC3339)
			threads = append(threads, thread)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, "Error iterating database rows", http.StatusInternalServerError)
			log.Println("Error iterating database rows:", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(threads); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Println("Successfully fetched threads")
	}
}

// GetSearchThreadsHandler retrieves all Threads from the database
func GetSearchThreadsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetSearchThreads")

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		vars := mux.Vars(r)
		search := vars["searchTerm"]
		log.Printf("Search Term: %s", search)

		rows, err := db.Query("SELECT id, title, description, author, category_id, created_at FROM THREADS WHERE title LIKE ?", "%"+search+"%")
		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			log.Println("Error querying database:", err)
			return
		}
		defer rows.Close()

		var threads []ThreadGet
		for rows.Next() {
			var thread ThreadGet
			var threadTime time.Time
			var categoryID int
			if err := rows.Scan(&thread.ID, &thread.Title, &thread.Description, &thread.Author, &categoryID, &threadTime); err != nil {
				http.Error(w, "Failed to parse database rows", http.StatusInternalServerError)
				log.Println("Error parsing database row:", err)
				return
			}
			thread.Category, err = findCategoryByID(db, categoryID)
			if err != nil {
				http.Error(w, "Failed to find category", http.StatusInternalServerError)
				return
			}
			thread.Time = threadTime.Format(time.RFC3339)
			threads = append(threads, thread)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, "Error iterating database rows", http.StatusInternalServerError)
			log.Println("Error iterating database rows:", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(threads); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Println("Successfully fetched threads with search term", search)
	}
}

// GetThreadByIDHandler retrieves a specific Thread by ID from the database
func GetThreadByIDHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetThreadByID")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Thread ID: %s", idStr)

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid Thread ID", http.StatusBadRequest)
			log.Println("Invalid Thread ID:", err)
			return
		}

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "SELECT title, description, author, category_id, created_at FROM THREADS WHERE id = ?"
		row := db.QueryRow(query, id)

		var thread ThreadGet
		thread.ID = id
		var threadTime time.Time
		var categoryID int
		if err := row.Scan(&thread.Title, &thread.Description, &thread.Author, &categoryID, &threadTime); err != nil {
			http.Error(w, "Failed to parse database row", http.StatusInternalServerError)
			log.Println("Error parsing database row:", err)
			return
		}
		thread.Category, err = findCategoryByID(db, categoryID)
		if err != nil {
			http.Error(w, "Failed to find category", http.StatusInternalServerError)
			return
		}
		thread.Time = threadTime.Format(time.RFC3339)

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(thread); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Printf("Successfully fetched thread with ID %d", thread.ID)
	}
}

// GetThreadsByUserHandler retrieves all Threads by a specific user from the database
func GetThreadsByUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetThreadByID")

		vars := mux.Vars(r)
		user := vars["user"]
		log.Printf("Username: %s", user)

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "SELECT id, title, description, category_id, created_at FROM THREADS WHERE author = ?"
		rows, err := db.Query(query, user)

		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			log.Println("Error querying database:", err)
			return
		}
		defer rows.Close()

		var threads []ThreadGet
		for rows.Next() {
			var thread ThreadGet
			thread.Author = user
			var threadTime time.Time
			var categoryID int
			if err = rows.Scan(&thread.ID, &thread.Title, &thread.Description, &categoryID, &threadTime); err != nil {
				http.Error(w, "Failed to parse database row", http.StatusInternalServerError)
				log.Println("Error parsing database row:", err)
				return
			}
			thread.Category, err = findCategoryByID(db, categoryID)
			if err != nil {
				http.Error(w, "Failed to find category", http.StatusInternalServerError)
				return
			}
			thread.Time = threadTime.Format(time.RFC3339)
			threads = append(threads, thread)
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(threads); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Printf("Successfully fetched threads with author %s", user)
	}
}
