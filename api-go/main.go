package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	if err := initDB(); err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	r := gin.Default()
	r.Use(cors())

	// login
	r.POST("/login", login)

	// user
	r.GET("/user", userGet)
	r.GET("/user/:SN", userGetOne)
	r.POST("/user", userPost)
	r.POST("/userbyid", userGetById)
	r.PUT("/user/:SN", userPut)
	r.DELETE("/user/:SN", userDelete)

	// problem-set
	r.GET("/problem-set", problemSetGet)
	r.GET("/problem-set/owner/:owner", problemSetGetOfOwner)
	r.GET("/problem-set/:SN", problemSetGetOne)
	r.POST("/problem-set", problemSetPost)
	r.PUT("/problem-set/:SN", problemSetPut)
	r.PUT("/problem-set/:SN/hitup", problemSetHitUp)
	r.PUT("/problem-set/:SN/hitdown", problemSetHitDown)
	r.DELETE("/problem-set/:SN", problemSetDelete)

	// category
	r.GET("/category", categoryGet)
	r.GET("/problem-set/:SN/category", categoryGetOfProblemSet)
	r.GET("/category/:SN", categoryGetOne)
	r.POST("/category", categoryPost)
	r.PUT("/category/:SN", categoryPut)
	r.DELETE("/category/:SN", categoryDelete)

	// problem
	r.GET("/problem", problemGet)
	r.GET("/category/:SN/problem", problemGetOfCategory)
	r.GET("/problem/:SN", problemGetOne)
	r.POST("/problem", problemPost)
	r.PUT("/problem/:SN", problemPut)
	r.PUT("/problem/:SN/category", problemCategoryPut)
	r.PUT("/problem/:SN/hitup", problemHitUp)
	r.PUT("/problem/:SN/hitdown", problemHitDown)
	r.DELETE("/problem/:SN", problemDelete)

	port := getEnv("PORT", "8080")
	r.Run(":" + port)
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	}
}
