package main

import (
	"fmt"
	"main/controllers"
	"main/middleware"
	"net/http"
	"time"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func keyFunc(c *gin.Context) string {
	return c.ClientIP()
}

func errorHandler(c *gin.Context, info ratelimit.Info) {
	c.String(429, "Too many requests. Try again in "+time.Until(info.ResetTime).String())
}

func main() {

	//load the project .env
	if err := godotenv.Load(); err != nil {
		fmt.Println("Error loading .env file")
	}

	//set mode to release mode
	gin.SetMode(gin.ReleaseMode)

	r := gin.Default()
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"*"}
	r.Use(cors.New(config))

	store := ratelimit.InMemoryStore(&ratelimit.InMemoryOptions{
		Rate:  time.Minute,
		Limit: 15,
	})

	mw := ratelimit.RateLimiter(store, &ratelimit.Options{
		ErrorHandler: errorHandler,
		KeyFunc:      keyFunc,
	})

	//testing middleware
	r.Use(middleware.PrintMiddleware)

	r.LoadHTMLGlob("templates/*")

	r.Static("/assets", "./assets")

	r.GET("/ping", func(c *gin.Context){
		c.JSON(200, gin.H{"response":"pong"})
	})

	r.GET("/hello", func(c *gin.Context){
		c.JSON(200, gin.H{"response":"world"})
	})

	r.GET("/drake", func(c *gin.Context){
		c.JSON(200, gin.H{"response":"josh"})
	})

	r.GET("/tester", func(c *gin.Context){
		c.JSON(200, gin.H{"response":"tester"})
	})


	r.GET("/allscores", controllers.GetAllScores)

	r.POST("/pushscore", mw, controllers.PushScore)

	r.POST("/getrank", controllers.GetRankById)

	r.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	fmt.Println("server has started")
	r.Run(":80")
}
