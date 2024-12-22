package db

import (
	"database/sql"
	"fmt"
)

func CreateTables(db *sql.DB) error {
	createForumsTableSQL := `
	CREATE TABLE IF NOT EXISTS forums (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`

	createUsersTableSQL := `
    CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`

	createCommentsTableSQL := `
  CREATE TABLE IF NOT EXISTS comments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    forum_id INT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`

	createForumReactionsTableSQL := `
  CREATE TABLE IF NOT EXISTS forum_reactions (
    user_id INT NOT NULL,
    forum_id INT NOT NULL,
    state TINYINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, forum_id),
    FOREIGN KEY (forum_id) REFERENCES forums(id) ON DELETE CASCADE
);`

	createCommentReactionsTableSQL := `
  CREATE TABLE IF NOT EXISTS comment_reactions (
    user_id INT NOT NULL,
    comment_id BIGINT UNSIGNED NOT NULL,
    state TINYINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, comment_id),
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE
);`

	_, err := db.Exec(createForumsTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create forums table: %v", err)
	}
	_, err = db.Exec(createUsersTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create users table: %v", err)
	}
	_, err = db.Exec(createCommentsTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create comments table: %v", err)
	}
	_, err = db.Exec(createForumReactionsTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create forum_reactions table: %v", err)
	}
	_, err = db.Exec(createCommentReactionsTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create comment_reactions table: %v", err)
	}

	return nil
}
