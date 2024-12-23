package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"web-forum/utils"

	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type UserResponse struct {
	User string `json:"user"`
}

func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// Fetch user from the database
		var hash string
		err := db.QueryRow("SELECT password_hash FROM USERS WHERE username = ?", req.Username).Scan(&hash)
		if err == sql.ErrNoRows {
			http.Error(w, "Username does not exist", http.StatusUnauthorized)
			return
		} else if err != nil {
			http.Error(w, "Server error", http.StatusInternalServerError)
			log.Println("Failed to get user info from database: ", err)
			return
		}

		// Compare the password hash
		if err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(req.Password)); err != nil {
			http.Error(w, "Password does not match", http.StatusUnauthorized)
			return
		}

		// Generate JWT token
		token, err := utils.GenerateJWT(req.Username)
		if err != nil {
			http.Error(w, "Error generating token", http.StatusInternalServerError)
			log.Println("Error generating token:", err)
			return
		}

		// Send the token in the response
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(LoginResponse{Token: token})
	}
}

func LoginWithToken() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		user := r.Context().Value("user").(string) // Retrieving the user (username)

		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(UserResponse{User: user})
	}
}
