package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ForumReactionGet struct {
	Likes    string `json:"like"`
	Dislikes string `json:"dislike"`
}

type ForumReactionCreate struct {
	Reaction string `json:"reaction"`
}

// GetForumReaction returns the reaction of a forum
func GetForumReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetForumReaction")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Forum ID: %s", idStr)

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid forum ID", http.StatusBadRequest)
			log.Println("Invalid forum ID:", err)
			return
		}

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "SELECT COUNT(*) FROM forum_reactions WHERE forum_id=? AND state=?"
		likeRow := db.QueryRow(query, id, 1)
		dislikeRow := db.QueryRow(query, id, 0)

		var reaction ForumReactionGet
		if err := likeRow.Scan(&reaction.Likes); err != nil {
			http.Error(w, "Failed to parse database row", http.StatusInternalServerError)
			log.Println("Error parsing database row:", err)
			return
		}
		if err := dislikeRow.Scan(&reaction.Dislikes); err != nil {
			http.Error(w, "Failed to parse database row", http.StatusInternalServerError)
			log.Println("Error parsing database row:", err)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(reaction); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Printf("Successfully fetched reactions for forum with ID %d", id)
	}
}

func GetForumUserReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetForumUserReaction")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Forum ID: %s", idStr)

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid forum ID", http.StatusBadRequest)
			log.Println("Invalid forum ID:", err)
			return
		}

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		user := r.Context().Value("user").(string)
		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		query := "SELECT state FROM forum_reactions WHERE forum_id=? AND user_id=?"
		row := db.QueryRow(query, id, user)

		var reaction ForumReactionCreate
		if err := row.Scan(&reaction.Reaction); err != nil {
			if err == sql.ErrNoRows {
				reaction.Reaction = "none"
			} else {
				http.Error(w, "Failed to parse database row", http.StatusInternalServerError)
				log.Println("Error parsing database row:", err)
				return
			}
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(reaction); err != nil {
			http.Error(w, "Failed to encode JSON", http.StatusInternalServerError)
			log.Println("Error encoding JSON:", err)
		}

		log.Printf("Successfully fetched reaction for forum with ID %d by user %s", id, user)
	}
}

// UpdateForumReaction updates the reaction of a forum
func UpdateForumReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for UpdateForumReaction")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Forum ID: %s", idStr)

		user := r.Context().Value("user").(string) // Retrieving the user (username)

		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		user_id, err := db.Exec("SELECT id FROM users WHERE username = ?", user)

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid forum ID", http.StatusBadRequest)
			log.Println("Invalid forum ID:", err)
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		var body ForumReactionCreate
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			log.Println("Error decoding request body:", err)
			return
		}

		query := "INSERT INTO forum_reactions (user_id,forum_id,state) VALUES(?,?,?) ON DUPLICATE KEY UPDATE state = VALUES(state)"

		_, err = db.Exec(query, user_id, id, body.Reaction)

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully submitted"}`))

		log.Printf("Successfully updated reaction for forum with ID %d by user %s", id, user)
	}
}

// DeleteForumReaction deletes the reaction of a forum from a user
func DeleteForumReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for DeleteForumReaction")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Forum ID: %s", idStr)

		user := r.Context().Value("user").(string) // Retrieving the user (username)
		user_id, err := db.Exec("SELECT id FROM users WHERE username = ?", user)

		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid forum ID", http.StatusBadRequest)
			log.Println("Invalid forum ID:", err)
			return
		}

		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "DELETE FROM forum_reactions WHERE user_id=? AND forum_id=?"

		_, err = db.Exec(query, user_id, id)

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully deleted"}`))

		log.Printf("Successfully removed reaction for forum with ID %d by user %s", id, user)
	}
}
