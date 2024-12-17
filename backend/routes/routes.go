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
	router.Handle("/api/login/token", handlers.JWTMiddleware(handlers.LoginWithToken())).Methods("POST")
	router.HandleFunc("/api/forums", handlers.GetAllForumsHandler(db)).Methods("GET")
	router.HandleFunc("/api/forums/{id}", handlers.GetForumByIDHandler(db)).Methods("GET")
	router.HandleFunc("/api/forums/{id}/comments", handlers.GetCommentsHandler(db)).Methods("GET")
	router.Handle("/api/forums/{id}/comments", handlers.JWTMiddleware(handlers.CreateCommentHandler(db))).Methods("POST")
	router.Handle("/api/forums", handlers.JWTMiddleware(handlers.CreateForumHandler(db))).Methods("POST")

	return router
}
