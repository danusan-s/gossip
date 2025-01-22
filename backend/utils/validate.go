package utils

import (
	"fmt"
	"regexp"
)

func ValidateUsername(username string) error {
	// Username must be between 3 and 20 characters
	if len(username) < 3 || len(username) > 20 {
		return fmt.Errorf("username must be between 3 and 20 characters")
	}

	// Username must only contain alphanumeric characters
	if match, _ := regexp.MatchString("^[a-zA-Z0-9_]*$", username); !match {
		return fmt.Errorf("username must only contain alphanumeric characters and underscores")
	}

	return nil
}

func ValidatePassword(password string) error {
	// Password must be at least 8 characters
	if len(password) < 8 {
		return fmt.Errorf("password must be at least 8 characters")
	}

	// Password must contain at least one uppercase letter
	if match, _ := regexp.MatchString("[A-Z]", password); !match {
		return fmt.Errorf("password must contain at least one uppercase letter")
	}

	// Password must contain at least one lowercase letter
	if match, _ := regexp.MatchString("[a-z]", password); !match {
		return fmt.Errorf("password must contain at least one lowercase letter")
	}

	// Password must contain at least one digit
	if match, _ := regexp.MatchString("[0-9]", password); !match {
		return fmt.Errorf("password must contain at least one digit")
	}

	// Password must contain at least one special character
	if match, _ := regexp.MatchString(`[!@#$%^&*(),.?":{}|<>]`, password); !match {
		return fmt.Errorf("password must contain at least one special character")
	}

	return nil
}
