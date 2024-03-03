package controllers

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

type UserScore struct {
	ID           int       `json:"id"`
	Username     string    `json:"username"`
	Score        int       `json:"score"`
	DateRecorded time.Time `json:"dateRecorded"`
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
	rows, err := db.Query("SELECT id, username, score, date_recorded FROM scores WHERE board_size = $1 ORDER BY score ASC LIMIT 50;", size)
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
		if err := rows.Scan(&user.ID, &user.Username, &user.Score, &user.DateRecorded); err != nil {
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

	if len(scores) == 0 {
		c.JSON(http.StatusOK, []UserScore{})
	} else {
		c.JSON(http.StatusOK, scores)
	}

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
	result := db.QueryRow("INSERT INTO scores (username, score, board_size) VALUES ($1, $2, $3) RETURNING id;", entry.Username, entry.Score, entry.Size)
	var insertedID int
	err = result.Scan(&insertedID)
	if err != nil {
		fmt.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "could not make leaderboard entry"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"scoreID": insertedID})
}

func GetRankById(c *gin.Context) {
	var payload struct {
		ID int `json:"id"`
	}

	if err := c.BindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not supplied"})
		return
	}

	connStr := os.Getenv("PG_CONN_STR")
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "database connection error"})
		return
	}
	defer db.Close()

	var scoreRank int
	var score int
	var user string

	err = db.QueryRow(`
		WITH ranked_scores AS (
			SELECT id, username, RANK() OVER (PARTITION BY board_size ORDER BY score ASC) AS score_rank
			FROM scores
		)
		SELECT id, username, score_rank
		FROM ranked_scores
		WHERE id = $1;
	`, payload.ID).Scan(&score, &user, &scoreRank)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusBadRequest, gin.H{"error": "id not found"})
		return
	} else if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "type error"})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{"rank": scoreRank, "score": score, "user": user})
	}

}
