package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type UserScore struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Score    int    `json:"score"`
}

func GetAllScores(c *gin.Context) {

	//get URL parameter for size
	size := c.Query("size")
	if size == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Bad request: 'size' parameter is required"})
		return
	}

	//create connection to the database
	connStr := os.Getenv("PG_CONN_STR")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	//select all scores from the database
	rows, err := db.Query("SELECT id, username, score FROM scores where board_size = $1 ORDER BY SCORE DESC;", size)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Incorrect size value"})
		return
	}
	defer rows.Close()

	//add data to struct list
	var scores []UserScore
	for rows.Next() {
		var user UserScore
		if err := rows.Scan(&user.ID, &user.Username, &user.Score); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "cannot scan data"})
			return
		}
		scores = append(scores, user)
	}

	//catch row errors
	if err := rows.Err(); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "row error"})
		return
	}

	//send data to client
	c.JSON(http.StatusOK, scores)
}

type LeaderboardEntry struct {
	Score    int    `json:"score"`
	Username string `json:"username"`
	Size     string `json:"size"`
}

func PushScore(c *gin.Context) {

	//INSERT INTO scores (score, username, board_size) VALUES (300, 'ac_123', 'medium');
	var entry LeaderboardEntry

	//bind json payload to the struct
	if err := c.ShouldBindJSON(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	connStr := os.Getenv("PG_CONN_STR")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	// INSERT statement
	result, err := db.Exec("INSERT INTO scores (username, score, board_size) VALUES ($1, $2, $3);", entry.Username, entry.Score, entry.Size)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert data"})
		return
	}

	// Check the number of rows affected by the insert
	rowsAffected, _ := result.RowsAffected()
	fmt.Printf("Rows affected by insert: %d\n", rowsAffected)

	c.JSON(http.StatusOK, gin.H{"message": "Score Updated successfully"})
}
