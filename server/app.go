package main

import (
	"fmt"
	"main/controllers"
	"main/middleware"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func main() {

	//load the project .env
	if err := godotenv.Load(); err != nil {
		fmt.Println("Error loading .env file")
	}

	r := gin.Default()

	//testing middleware
	r.Use(middleware.PrintMiddleware)

	r.LoadHTMLGlob("templates/*")

	r.Static("/static", "./static")

	r.GET("/allscores", controllers.GetAllScores)

	r.POST("/pushscore", controllers.PushScore)

	r.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	fmt.Println("server has started")
	r.Run(":8080")
}
