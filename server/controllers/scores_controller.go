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
	rows, err := db.Query("SELECT id, username, score FROM scores where board_size = $1;", size)
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
