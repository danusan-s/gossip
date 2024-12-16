package routes

import (
	"database/sql"
	"web-forum/handlers"

	"github.com/gorilla/mux"
)

func SetupRoutes(db *sql.DB) *mux.Router {
	router := mux.NewRouter()

	// Define routes
	router.HandleFunc("/api/register", handlers.RegisterHandler(db)).Methods("POST")
	router.HandleFunc("/api/login", handlers.LoginHandler(db)).Methods("POST")
	router.HandleFunc("/api/forums", handlers.GetForumsHandler(db)).Methods("GET")
	router.HandleFunc("/api/forums", handlers.CreateForumHandler(db)).Methods("POST")

	return router
}
