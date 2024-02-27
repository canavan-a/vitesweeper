package middleware

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func PrintMiddleware(c *gin.Context) {
	fmt.Println("Route has been trigger")
	c.Next()
}
