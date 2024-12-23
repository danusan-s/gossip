package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

type CategoryGet struct {
	ID       int    `json:"id"`
	Category string `json:"category"`
}

// GetAllCategoriesHandler retrieves all Threads from the database
func GetAllCategoriesHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetAllCategories")

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		rows, err := db.Query("SELECT id,category FROM CATEGORIES")
		if err != nil {
			http.Error(w, "Failed to query database", http.StatusInternalServerError)
			log.Println("Error querying database:", err)
			return
		}
		defer rows.Close()

		var categories []CategoryGet
		for rows.Next() {
			var category CategoryGet
			if err := rows.Scan(&category.ID, &category.Category); err != nil {
				http.Error(w, "Failed to parse database rows", http.StatusInternalServerError)
				log.Println("Error parsing database row:", err)
				return
			}
			categories = append(categories, category)
		}

		if err := rows.Err(); err != nil {
			http.Error(w, "Error iterating database rows", http.StatusInternalServerError)
			log.Println("Error iterating database rows:", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(categories); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Println("Successfully fetched categories")
	}
}
