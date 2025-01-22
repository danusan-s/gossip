package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

type ReportCreate struct {
	ID     int    `json:"id"`
	Type   string `json:"type"`
	Reason string `json:"reason"`
}

// CreateReportHandler handles the creation of a new Report
func CreateReportHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for CreateReport")

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		user := r.Context().Value("user").(string)
		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var user_id int
		err := db.QueryRow("SELECT id FROM USERS WHERE username = ?", user).Scan(&user_id)
		if err != nil {
			http.Error(w, "Failed to get user ID", http.StatusInternalServerError)
			log.Println("Error getting user ID:", err)
			return
		}

		var body ReportCreate
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			log.Println("Error decoding request body:", err)
			return
		}

		if body.Reason == "" {
			http.Error(w, "Reason is required", http.StatusBadRequest)
			log.Println("Reason is missing")
			return
		}

		if body.Type != "thread" && body.Type != "comment" {
			http.Error(w, "Invalid type", http.StatusBadRequest)
			log.Println("Invalid type")
			return
		}

		query := "INSERT INTO REPORTS (reported_id,reporter_id,reported_type,reason) VALUES (?, ?, ?, ?)"
		_, err = db.Exec(query, body.ID, user_id, body.Type, body.Reason)
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
