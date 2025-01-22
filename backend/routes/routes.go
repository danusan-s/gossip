package routes

import (
	"database/sql"
	"web-forum/handlers"

	"github.com/gorilla/mux"
)

func SetupRoutes(db *sql.DB) *mux.Router {
	// Create a new router
	router := mux.NewRouter()

	// Define routes
	router.HandleFunc("/api/register", handlers.RegisterHandler(db)).Methods("POST")
	router.HandleFunc("/api/login", handlers.LoginHandler(db)).Methods("POST")
	router.Handle("/api/login/token", handlers.JWTMiddleware(handlers.LoginWithToken())).Methods("POST")

	router.HandleFunc("/api/threads", handlers.GetAllThreadsHandler(db)).Methods("GET")
	router.HandleFunc("/api/threads/search/{searchTerm}", handlers.GetSearchThreadsHandler(db)).Methods("GET")
	router.Handle("/api/threads", handlers.JWTMiddleware(handlers.CreateThreadHandler(db))).Methods("POST")
	router.Handle("/api/threads/{id}", handlers.JWTMiddleware(handlers.UpdateThreadHandler(db))).Methods("PUT")
	router.HandleFunc("/api/threads/{id}", handlers.GetThreadByIDHandler(db)).Methods("GET")
	router.Handle("/api/threads/{id}", handlers.JWTMiddleware(handlers.DeleteThreadHandler(db))).Methods("DELETE")

	router.HandleFunc("/api/threads/{id}/reactions", handlers.GetThreadReaction(db)).Methods("GET")
	router.Handle("/api/threads/{id}/reactions/user", handlers.JWTMiddleware(handlers.GetThreadUserReaction(db))).Methods("GET")
	router.Handle("/api/threads/{id}/reactions", handlers.JWTMiddleware(handlers.UpdateThreadReaction(db))).Methods("POST")
	router.Handle("/api/threads/{id}/reactions", handlers.JWTMiddleware(handlers.DeleteThreadReaction(db))).Methods("DELETE")

	router.HandleFunc("/api/threads/{id}/comments", handlers.GetCommentsByThreadHandler(db)).Methods("GET")
	router.Handle("/api/threads/{id}/comments", handlers.JWTMiddleware(handlers.CreateCommentHandler(db))).Methods("POST")
	router.Handle("/api/comments/{id}", handlers.JWTMiddleware(handlers.UpdateCommentHandler(db))).Methods("PUT")
	router.Handle("/api/comments/{id}", handlers.JWTMiddleware(handlers.DeleteCommentHandler(db))).Methods("DELETE")

	router.HandleFunc("/api/comments/{id}/reactions", handlers.GetCommentReaction(db)).Methods("GET")
	router.Handle("/api/comments/{id}/reactions/user", handlers.JWTMiddleware(handlers.GetCommentUserReaction(db))).Methods("GET")
	router.Handle("/api/comments/{id}/reactions", handlers.JWTMiddleware(handlers.UpdateCommentReaction(db))).Methods("POST")
	router.Handle("/api/comments/{id}/reactions", handlers.JWTMiddleware(handlers.DeleteCommentReaction(db))).Methods("DELETE")

	router.HandleFunc("/api/user/{user}/comments", handlers.GetCommentsByUserHandler(db)).Methods("GET")
	router.HandleFunc("/api/user/{user}/threads", handlers.GetThreadsByUserHandler(db)).Methods("GET")

	router.HandleFunc("/api/categories", handlers.GetAllCategoriesHandler(db)).Methods("GET")

	router.Handle("/api/report", handlers.JWTMiddleware(handlers.CreateReportHandler(db))).Methods("POST")

	return router
}
