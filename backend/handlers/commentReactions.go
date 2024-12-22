package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type CommentReactionGet struct {
	Likes    string `json:"like"`
	Dislikes string `json:"dislike"`
}

type CommentReactionCreate struct {
	Reaction string `json:"reaction"`
}

// GetCommentReaction returns the reaction of a comment
func GetCommentReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetCommentReaction")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Comment ID: %s", idStr)

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid comment ID", http.StatusBadRequest)
			log.Println("Invalid comment ID:", err)
			return
		}

		if r.Method != http.MethodGet {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "SELECT COUNT(*) FROM comment_reactions WHERE comment_id=? AND state=?"
		likeRow := db.QueryRow(query, id, 1)
		dislikeRow := db.QueryRow(query, id, 0)

		var reaction CommentReactionGet
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

		log.Printf("Successfully fetched reactions for comment with ID %d", id)
	}
}

func GetCommentUserReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for GetCommentUserReaction")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Comment ID: %s", idStr)

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid comment ID", http.StatusBadRequest)
			log.Println("Invalid comment ID:", err)
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

		query := "SELECT state FROM comment_reactions WHERE comment_id=? AND user_id=?"
		row := db.QueryRow(query, id, user)

		var reaction CommentReactionCreate
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

		log.Printf("Successfully fetched reaction for comment with ID %d by user %s", id, user)
	}
}

// UpdateCommentReaction updates the reaction of a comment
func UpdateCommentReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for UpdateCommentReaction")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Comment ID: %s", idStr)

		user := r.Context().Value("user").(string) // Retrieving the user (username)

		user_id, err := db.Exec("SELECT id FROM users WHERE username = ?", user)

		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid comment ID", http.StatusBadRequest)
			log.Println("Invalid comment ID:", err)
			return
		}

		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		var body CommentReactionCreate
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			log.Println("Error decoding request body:", err)
			return
		}

		query := "INSERT INTO comment_reactions (user_id,comment_id,state) VALUES(?,?,?) ON DUPLICATE KEY UPDATE state = VALUES(state)"

		_, err = db.Exec(query, user_id, id, body.Reaction)

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully submitted"}`))

		log.Printf("Successfully updated reaction for comment with ID %d by user %s", id, user)
	}
}

// DeleteCommentReaction deletes the reaction of a comment by a user
func DeleteCommentReaction(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("Received request for DeleteCommentReaction")

		vars := mux.Vars(r)
		idStr := vars["id"]
		log.Printf("Comment ID: %s", idStr)

		user := r.Context().Value("user").(string) // Retrieving the user (username)

		user_id, err := db.Exec("SELECT id FROM users WHERE username = ?", user)

		if user == "" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		id, err := strconv.Atoi(idStr)
		if err != nil {
			http.Error(w, "Invalid comment ID", http.StatusBadRequest)
			log.Println("Invalid comment ID:", err)
			return
		}

		if r.Method != http.MethodDelete {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			log.Println("Method not allowed")
			return
		}

		query := "DELETE FROM comment_reactions WHERE user_id=? AND comment_id=?"

		_, err = db.Exec(query, user_id, id)

		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"message":"Data successfully deleted"}`))

		log.Printf("Successfully removed reaction for comment with ID %d by user %s", id, user)
	}
}
