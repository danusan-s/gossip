package utils

import (
	"encoding/base64"
	"github.com/golang-jwt/jwt/v5"
	"os"
	"time"
)

func GenerateJWT(username string) (string, error) {
	encodedSecret := os.Getenv("JWT_SECRET")

	decodedSecret, err := base64.StdEncoding.DecodeString(encodedSecret)
	if err != nil {
		return "", err
	}

	claims := jwt.MapClaims{
		"username": username,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // Expires in 24 hours
	}

	// Create the token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	tokenString, err := token.SignedString(decodedSecret)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
