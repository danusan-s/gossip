package handlers

import (
	"context"
	"encoding/base64"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

// Middleware to Validate JWT
func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// Load environment variables from .env file
		err := godotenv.Load()
		if err != nil {
			return
		}

		encodedSecret := os.Getenv("JWT_SECRET")

		decodedSecret, err := base64.StdEncoding.DecodeString(encodedSecret)
		if err != nil {
			return
		}

		// Extract the token from the Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header is missing", http.StatusUnauthorized)
			return
		}

		// Check the format "Bearer <token>"
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			http.Error(w, "Authorization header format must be 'Bearer <token>'", http.StatusUnauthorized)
			return
		}

		// Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Verify the signing method
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return decodedSecret, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}
		// If token is valid, extract claims and attach them to the request context
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Attach the claims (or any specific data like the user ID) to the request context
		user := claims["username"].(string) // Extracting username as an example
		ctx := context.WithValue(r.Context(), "user", user)

		// Pass the request with the attached context to the next handler
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
