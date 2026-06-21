package main

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

// ---------- helpers ----------

type arrayResponse struct {
	Array []map[string]string `json:"array"`
}

func rowsAffectedResult(res sql.Result) string {
	n, _ := res.RowsAffected()
	if n > 0 {
		return "true"
	}
	return "false"
}

func notFound(c *gin.Context) {
	c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
}

func scanUser(row *sql.Row) (map[string]string, error) {
	var sn, id, pw, introduction string
	err := row.Scan(&sn, &id, &pw, &introduction)
	if err != nil {
		return nil, err
	}
	return map[string]string{
		"SN": sn, "id": id, "pw": pw, "introduction": introduction,
	}, nil
}

func scanUserRows(rows *sql.Rows) ([]map[string]string, error) {
	defer rows.Close()
	list := make([]map[string]string, 0)
	for rows.Next() {
		var sn, id, pw, introduction string
		if err := rows.Scan(&sn, &id, &pw, &introduction); err != nil {
			return nil, err
		}
		list = append(list, map[string]string{
			"SN": sn, "id": id, "pw": pw, "introduction": introduction,
		})
	}
	return list, nil
}

func scanProblemSetRows(rows *sql.Rows) ([]map[string]string, error) {
	defer rows.Close()
	list := make([]map[string]string, 0)
	for rows.Next() {
		var sn, name, owner, tag, hit, created, modified string
		if err := rows.Scan(&sn, &name, &owner, &tag, &hit, &created, &modified); err != nil {
			return nil, err
		}
		list = append(list, map[string]string{
			"SN": sn, "name": name, "owner": owner, "tag": tag,
			"hit": hit, "created_data": created, "modified_data": modified,
		})
	}
	return list, nil
}

func scanCategoryRows(rows *sql.Rows) ([]map[string]string, error) {
	defer rows.Close()
	list := make([]map[string]string, 0)
	for rows.Next() {
		var sn, name, problemSet string
		if err := rows.Scan(&sn, &name, &problemSet); err != nil {
			return nil, err
		}
		list = append(list, map[string]string{
			"SN": sn, "name": name, "problemSet": problemSet,
		})
	}
	return list, nil
}

func scanProblemRows(rows *sql.Rows) ([]map[string]string, error) {
	defer rows.Close()
	list := make([]map[string]string, 0)
	for rows.Next() {
		var sn, question, answer, category, hit string
		if err := rows.Scan(&sn, &question, &answer, &category, &hit); err != nil {
			return nil, err
		}
		list = append(list, map[string]string{
			"SN": sn, "question": question, "answer": answer,
			"category": category, "hit": hit,
		})
	}
	return list, nil
}

// ---------- login ----------

func login(c *gin.Context) {
	var req struct {
		ID string `json:"id"`
		PW string `json:"pw"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := scanUser(db.QueryRow("SELECT * FROM USER WHERE ID = ? AND PW = ?", req.ID, req.PW))
	if err != nil {
		notFound(c)
		return
	}
	c.JSON(http.StatusOK, user)
}

// ---------- user ----------

func userGet(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM USER")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	list, err := scanUserRows(rows)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.JSON(http.StatusOK, arrayResponse{Array: list})
}

func userGetOne(c *gin.Context) {
	user, err := scanUser(db.QueryRow("SELECT * FROM USER WHERE SN = ?", c.Param("SN")))
	if err != nil {
		notFound(c)
		return
	}
	c.JSON(http.StatusOK, user)
}

func userPost(c *gin.Context) {
	var req struct {
		ID           string `json:"id"`
		PW           string `json:"pw"`
		Introduction string `json:"introduction"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := db.Exec("INSERT INTO USER(id, pw, introduction) VALUES (?, ?, ?)", req.ID, req.PW, req.Introduction)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func userGetById(c *gin.Context) {
	var req struct {
		ID string `json:"id"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := scanUser(db.QueryRow("SELECT * FROM USER WHERE ID = ?", req.ID))
	if err != nil {
		notFound(c)
		return
	}
	c.JSON(http.StatusOK, user)
}

func userPut(c *gin.Context) {
	var req struct {
		ID           string `json:"id"`
		PW           string `json:"pw"`
		Introduction string `json:"introduction"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := db.Exec("UPDATE USER SET id = ?, pw = ?, introduction = ? WHERE SN = ?",
		req.ID, req.PW, req.Introduction, c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func userDelete(c *gin.Context) {
	res, err := db.Exec("DELETE FROM USER WHERE SN = ?", c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

// ---------- problem-set ----------

func problemSetGet(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM PROBLEM_SET")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	list, err := scanProblemSetRows(rows)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.JSON(http.StatusOK, arrayResponse{Array: list})
}

func problemSetGetOfOwner(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM PROBLEM_SET WHERE OWNER = ?", c.Param("owner"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	list, err := scanProblemSetRows(rows)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.JSON(http.StatusOK, arrayResponse{Array: list})
}

func problemSetGetOne(c *gin.Context) {
	row := db.QueryRow("SELECT * FROM PROBLEM_SET WHERE SN = ?", c.Param("SN"))
	var sn, name, owner, tag, hit, created, modified string
	if err := row.Scan(&sn, &name, &owner, &tag, &hit, &created, &modified); err != nil {
		notFound(c)
		return
	}
	c.JSON(http.StatusOK, map[string]string{
		"SN": sn, "name": name, "owner": owner, "tag": tag,
		"hit": hit, "created_data": created, "modified_data": modified,
	})
}

func problemSetPost(c *gin.Context) {
	var req struct {
		Name  string `json:"name"`
		Owner string `json:"owner"`
		Tag   string `json:"tag"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := db.Exec("INSERT INTO PROBLEM_SET(name, owner, tag) VALUES (?, ?, ?)", req.Name, req.Owner, req.Tag)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func problemSetPut(c *gin.Context) {
	var req struct {
		Name  string `json:"name"`
		Owner string `json:"owner"`
		Tag   string `json:"tag"`
		Hit   string `json:"hit"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := db.Exec("UPDATE PROBLEM_SET SET name = ?, owner = ?, tag = ?, hit = ?, MODIFIED_DATE = CURRENT_TIMESTAMP() WHERE SN = ?",
		req.Name, req.Owner, req.Tag, req.Hit, c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func problemSetHitUp(c *gin.Context) {
	res, err := db.Exec("UPDATE PROBLEM_SET SET HIT = (HIT+1) WHERE SN = ?", c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func problemSetHitDown(c *gin.Context) {
	res, err := db.Exec("UPDATE PROBLEM_SET SET HIT = (HIT-1) WHERE SN = ?", c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func problemSetDelete(c *gin.Context) {
	res, err := db.Exec("DELETE FROM PROBLEM_SET WHERE SN = ?", c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

// ---------- category ----------

func categoryGet(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM CATEGORY")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	list, err := scanCategoryRows(rows)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.JSON(http.StatusOK, arrayResponse{Array: list})
}

func categoryGetOfProblemSet(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM CATEGORY WHERE PROBLEM_SET = ?", c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	list, err := scanCategoryRows(rows)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.JSON(http.StatusOK, arrayResponse{Array: list})
}

func categoryGetOne(c *gin.Context) {
	row := db.QueryRow("SELECT * FROM CATEGORY WHERE SN = ?", c.Param("SN"))
	var sn, name, problemSet string
	if err := row.Scan(&sn, &name, &problemSet); err != nil {
		notFound(c)
		return
	}
	c.JSON(http.StatusOK, map[string]string{
		"SN": sn, "name": name, "problemSet": problemSet,
	})
}

func categoryPost(c *gin.Context) {
	var req struct {
		Name       string `json:"name"`
		ProblemSet string `json:"problemSet"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := db.Exec("INSERT INTO CATEGORY(NAME, PROBLEM_SET) VALUES (?, ?)", req.Name, req.ProblemSet)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func categoryPut(c *gin.Context) {
	var req struct {
		Name       string `json:"name"`
		ProblemSet string `json:"problemSet"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := db.Exec("UPDATE CATEGORY SET NAME = ?, PROBLEM_SET = ? WHERE SN = ?",
		req.Name, req.ProblemSet, c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func categoryDelete(c *gin.Context) {
	res, err := db.Exec("DELETE FROM CATEGORY WHERE SN = ?", c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

// ---------- problem ----------

func problemGet(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM PROBLEM")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	list, err := scanProblemRows(rows)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.JSON(http.StatusOK, arrayResponse{Array: list})
}

func problemGetOfCategory(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM PROBLEM WHERE CATEGORY = ?", c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	list, err := scanProblemRows(rows)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.JSON(http.StatusOK, arrayResponse{Array: list})
}

func problemGetOne(c *gin.Context) {
	row := db.QueryRow("SELECT * FROM PROBLEM WHERE SN = ?", c.Param("SN"))
	var sn, question, answer, category, hit string
	if err := row.Scan(&sn, &question, &answer, &category, &hit); err != nil {
		notFound(c)
		return
	}
	c.JSON(http.StatusOK, map[string]string{
		"SN": sn, "question": question, "answer": answer,
		"category": category, "hit": hit,
	})
}

func problemPost(c *gin.Context) {
	var req struct {
		Question string `json:"question"`
		Answer   string `json:"answer"`
		Category string `json:"category"`
		Hit      string `json:"hit"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := db.Exec("INSERT INTO PROBLEM(QUESTION, ANSWER, CATEGORY, HIT) VALUES (?, ?, ?, ?)",
		req.Question, req.Answer, req.Category, req.Hit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func problemPut(c *gin.Context) {
	var req struct {
		Question string `json:"question"`
		Answer   string `json:"answer"`
		Category string `json:"category"`
		Hit      string `json:"hit"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := db.Exec("UPDATE PROBLEM SET QUESTION = ?, ANSWER = ?, CATEGORY = ?, HIT = ? WHERE SN = ?",
		req.Question, req.Answer, req.Category, req.Hit, c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func problemCategoryPut(c *gin.Context) {
	var req struct {
		Category string `json:"category"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	res, err := db.Exec("UPDATE PROBLEM SET CATEGORY = ? WHERE SN = ?", req.Category, c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func problemHitUp(c *gin.Context) {
	res, err := db.Exec("UPDATE PROBLEM SET HIT = (HIT+1) WHERE SN = ?", c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func problemHitDown(c *gin.Context) {
	res, err := db.Exec("UPDATE PROBLEM SET HIT = (HIT-1) WHERE SN = ?", c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}

func problemDelete(c *gin.Context) {
	res, err := db.Exec("DELETE FROM PROBLEM WHERE SN = ?", c.Param("SN"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"status": "500"})
		return
	}
	c.String(http.StatusOK, rowsAffectedResult(res))
}


