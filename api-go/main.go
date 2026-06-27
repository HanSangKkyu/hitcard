package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

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

	// optional: serve web frontend static files
	if webDir := envOr("WEB_DIR", ""); webDir != "" {
		if info, err := os.Stat(webDir); err == nil && info.IsDir() {
			log.Printf("serving web frontend from %s", webDir)
			for _, dir := range []string{"static", "_expo", "assets"} {
				path := filepath.Join(webDir, dir)
				if info, err := os.Stat(path); err == nil && info.IsDir() {
					r.Static("/"+dir, path)
				}
			}
			for _, name := range []string{"favicon.ico", "apple-touch-icon.png", "logo192.png", "logo512.png", "robots.txt", "manifest.json"} {
				path := filepath.Join(webDir, name)
				if _, err := os.Stat(path); err == nil {
					r.StaticFile("/"+name, path)
				}
			}
			r.NoRoute(func(c *gin.Context) {
				if c.Request.Method == http.MethodGet {
					http.ServeFile(c.Writer, c.Request, filepath.Join(webDir, "index.html"))
				}
			})
		} else {
			log.Printf("warning: WEB_DIR %q not found, skipping static serving", webDir)
		}
	}

	port := envOr("PORT", "8080")
	tlsPort := envOr("TLS_PORT", "")
	certFile := envOr("TLS_CERT", "")
	keyFile := envOr("TLS_KEY", "")

	if tlsPort != "" && certFile != "" && keyFile != "" {
		go func() {
			log.Printf("listening on https://0.0.0.0:%s", tlsPort)
			if err := r.RunTLS(":"+tlsPort, certFile, keyFile); err != nil {
				log.Fatalf("TLS server error: %v", err)
			}
		}()
	}

	log.Printf("listening on http://0.0.0.0:%s", port)
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
