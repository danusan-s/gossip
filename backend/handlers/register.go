package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"web-forum/utils"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func RegisterHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request on /register")

		if r.Method != http.MethodPost {
			log.Printf("Invalid method: %s\n", r.Method)
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req RegisterRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			log.Printf("Failed to decode JSON: %v\n", err)
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		log.Printf("Decoded request: Username=%s, Email=%s\n", req.Username, req.Email)

		// Hash the password
		hash, err := utils.HashPassword(req.Password)
		if err != nil {
			log.Printf("Failed to hash password for Username=%s: %v\n", req.Username, err)
			http.Error(w, "Failed to hash password", http.StatusInternalServerError)
			return
		}

		log.Printf("Password hashed successfully for Username=%s\n", req.Username)

		// Insert user into the database
		_, err = db.Exec("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
			req.Username, req.Email, hash)
		if err != nil {
			log.Printf("Failed to insert user into database for Username=%s: %v\n", req.Username, err)
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}

		log.Printf("User created successfully: Username=%s, Email=%s\n", req.Username, req.Email)
		w.WriteHeader(http.StatusCreated)
	}
}
