package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type ThreadReactionGet struct {
	Likes    int `json:"like"`
	Dislikes int `json:"dislike"`
}

type ThreadReactionCreate struct {
	Reaction string `json:"reaction"`
}

// GetThreadReaction returns the reaction of a Thread
func GetThreadReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetThreadReaction")

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

		query := "SELECT COUNT(*) FROM THREAD_REACTIONS WHERE thread_id=? AND state=?"
		likeRow := db.QueryRow(query, id, 1)
		dislikeRow := db.QueryRow(query, id, 0)

		var reaction ThreadReactionGet
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

		log.Printf("Successfully fetched reactions for thread with ID %d", id)
	}
}

func GetThreadUserReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetThreadUserReaction")

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

		user := r.Context().Value("user").(string)
		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var user_id int
		err = db.QueryRow("SELECT id FROM USERS WHERE username = ?", user).Scan(&user_id)
		if err != nil {
			http.Error(w, "Failed to get user ID", http.StatusInternalServerError)
			log.Println("Error getting user ID:", err)
			return
		}

		query := "SELECT state FROM THREAD_REACTIONS WHERE thread_id=? AND user_id=?"
		row := db.QueryRow(query, id, user_id)

		var reaction ThreadReactionCreate
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

		log.Printf("Successfully fetched reaction for thread with ID %d by user %s", id, user)
	}
}

// UpdateThreadReaction updates the reaction of a Thread
func UpdateThreadReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for UpdateThreadReaction")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Thread ID: %s", idStr)

		user := r.Context().Value("user").(string) // Retrieving the user (username)

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

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid Thread ID", http.StatusBadRequest)
			log.Println("Invalid Thread ID:", err)
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		var body ThreadReactionCreate
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			log.Println("Error decoding request body:", err)
			return
		}

		query := "INSERT INTO THREAD_REACTIONS (user_id,thread_id,state) VALUES(?,?,?) ON DUPLICATE KEY UPDATE state = VALUES(state)"

		_, err = db.Exec(query, user_id, id, body.Reaction)

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully submitted"}`))

		log.Printf("Successfully updated reaction for thread with ID %d by user %s", id, user)
	}
}

// DeleteThreadReaction deletes the reaction of a Thread from a user
func DeleteThreadReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for DeleteThreadReaction")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Thread ID: %s", idStr)

		user := r.Context().Value("user").(string) // Retrieving the user (username)
		var user_id int
		err := db.QueryRow("SELECT id FROM USERS WHERE username = ?", user).Scan(&user_id)
		if err != nil {
			http.Error(w, "Failed to get user ID", http.StatusInternalServerError)
			log.Println("Error getting user ID:", err)
			return
		}

		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid Thread ID", http.StatusBadRequest)
			log.Println("Invalid Thread ID:", err)
			return
		}

		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "DELETE FROM THREAD_REACTIONS WHERE user_id=? AND thread_id=?"

		_, err = db.Exec(query, user_id, id)

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully deleted"}`))

		log.Printf("Successfully removed reaction for thread with ID %d by user %s", id, user)
	}
}
