package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
)

const defaultBaseURL = "http://localhost:8080"

var baseURL = defaultBaseURL

func main() {
	if u := os.Getenv("HITCARD_API"); u != "" {
		baseURL = u
	}

	args := os.Args[1:]
	if len(args) == 0 {
		printUsage()
		os.Exit(1)
	}

	first := args[0]
	if first == "-h" || first == "--help" || first == "help" {
		if len(args) == 1 {
			printUsage()
		} else {
			entityHelp(args[1])
		}
		os.Exit(0)
	}

	if len(args) < 2 {
		printUsage()
		os.Exit(1)
	}

	entity, action := args[0], args[1]
	rest := args[2:]

	if action == "-h" || action == "--help" || action == "help" {
		entityHelp(entity)
		os.Exit(0)
	}

	switch entity {
	case "user":
		userCmd(action, rest)
	case "ps", "problem-set":
		problemSetCmd(action, rest)
	case "cat", "category":
		categoryCmd(action, rest)
	case "prob", "problem":
		problemCmd(action, rest)
	default:
		fatalf("unknown entity: %s\n", entity)
	}
}

func entityHelp(entity string) {
	switch entity {
	case "user":
		fmt.Fprint(os.Stderr, userHelp)
	case "ps", "problem-set":
		fmt.Fprint(os.Stderr, problemSetHelp)
	case "cat", "category":
		fmt.Fprint(os.Stderr, categoryHelp)
	case "prob", "problem":
		fmt.Fprint(os.Stderr, problemHelp)
	default:
		printUsage()
	}
}

const userHelp = `Usage: hitcard user <action> [args]

Actions:
  list                    list all users
  get <sn>                get user by SN
  create <json>           create user (JSON or file path)
  update <sn> <json>      update user by SN
  delete <sn>             delete user by SN

Examples:
  hitcard user list
  hitcard user get 1
  hitcard user create '{"id":"new","pw":"1234","introduction":"hi"}'
  hitcard user update 1 '{"id":"changed","pw":"newpw","introduction":"hi"}'
  hitcard user delete 1
`

const problemSetHelp = `Usage: hitcard ps <action> [args]

Alias: problem-set

Actions:
  list                    list all problem-sets
  get <sn>                get problem-set by SN
  list-by-owner <owner>   list problem-sets by owner SN
  create <json>           create problem-set (JSON or file path)
  update <sn> <json>      update problem-set by SN
  hitup <sn>              increment hit count
  hitdown <sn>            decrement hit count
  delete <sn>             delete problem-set by SN

Examples:
  hitcard ps list
  hitcard ps get 1
  hitcard ps list-by-owner 1
  hitcard ps create '{"name":"my set","owner":"1","tag":"korean"}'
  hitcard ps update 1 '{"name":"new name","owner":"1","tag":"history"}'
  hitcard ps hitup 1
  hitcard ps delete 1
`

const categoryHelp = `Usage: hitcard cat <action> [args]

Alias: category

Actions:
  list                    list all categories
  get <sn>                get category by SN
  list-by-ps <sn>         list categories by problem-set SN
  create <json>           create category (JSON or file path)
  update <sn> <json>      update category by SN
  delete <sn>             delete category by SN

Examples:
  hitcard cat list
  hitcard cat get 1
  hitcard cat list-by-ps 1
  hitcard cat create '{"name":"grammar","problemSet":"1"}'
  hitcard cat update 1 '{"name":"vocab","problemSet":"1"}'
  hitcard cat delete 1
`

const problemHelp = `Usage: hitcard prob <action> [args]

Alias: problem

Actions:
  list                    list all problems
  get <sn>                get problem by SN
  list-by-cat <sn>        list problems by category SN
  create <json>           create problem (JSON or file path)
  update <sn> <json>      update problem by SN
  set-category <sn> <json> change problem's category
  hitup <sn>              increment hit count
  hitdown <sn>            decrement hit count
  delete <sn>             delete problem by SN

Examples:
  hitcard prob list
  hitcard prob get 1
  hitcard prob list-by-cat 1
  hitcard prob create '{"question":"뭐야?","answer":"what","category":"1","hit":"0"}'
  hitcard prob update 1 '{"question":"who?","answer":"누구","category":"1","hit":"0"}'
  hitcard prob set-category 1 '{"category":"2"}'
  hitcard prob hitup 1
  hitcard prob delete 1
`

func printUsage() {
	fmt.Fprintf(os.Stderr, `Usage: hitcard [-h] <entity> <action> [args...]

Entities:
  user                  User CRUD
  ps (problem-set)      Problem-set CRUD
  cat (category)        Category CRUD
  prob (problem)        Problem CRUD

Entity help:
  hitcard -h <entity>
  hitcard help <entity>
  hitcard <entity> help

Actions (entity-specific):
  user  list | get <sn> | create <json> | update <sn> <json> | delete <sn>
  ps    list | get <sn> | list-by-owner <owner> |
        create <json> | update <sn> <json> | delete <sn> |
        hitup <sn> | hitdown <sn>
  cat   list | get <sn> | list-by-ps <sn> |
        create <json> | update <sn> <json> | delete <sn>
  prob  list | get <sn> | list-by-cat <sn> |
        create <json> | update <sn> <json> | delete <sn> |
        set-category <sn> <json> | hitup <sn> | hitdown <sn>

Environment:
  HITCARD_API   base URL (default: %s)
`, defaultBaseURL)
}

func fatalf(format string, args ...interface{}) {
	fmt.Fprintf(os.Stderr, format, args...)
	os.Exit(1)
}

func get(path string) string {
	resp, err := http.Get(baseURL + path)
	if err != nil {
		fatalf("GET %s: %v\n", path, err)
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	return string(b)
}

func post(path string, body interface{}) string {
	return httpBody("POST", path, body)
}

func put(path string, body interface{}) string {
	return httpBody("PUT", path, body)
}

func del(path string) string {
	req, _ := http.NewRequest("DELETE", baseURL+path, nil)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fatalf("DELETE %s: %v\n", path, err)
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	return string(b)
}

func httpBody(method, path string, body interface{}) string {
	var r io.Reader
	if body != nil {
		b, _ := json.Marshal(body)
		r = bytes.NewReader(b)
	}
	req, _ := http.NewRequest(method, baseURL+path, r)
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fatalf("%s %s: %v\n", method, path, err)
	}
	defer resp.Body.Close()
	b, _ := io.ReadAll(resp.Body)
	return string(b)
}

func printJSON(data string) {
	var v interface{}
	if err := json.Unmarshal([]byte(data), &v); err == nil {
		b, _ := json.MarshalIndent(v, "", "  ")
		fmt.Println(string(b))
	} else {
		fmt.Println(data)
	}
}

// ---------- user ----------

func userCmd(action string, args []string) {
	switch action {
	case "list":
		printJSON(get("/user"))
	case "get":
		if len(args) < 1 {
			fatalf("usage: hitcard user get <sn>\n")
		}
		printJSON(get("/user/" + args[0]))
	case "create":
		if len(args) < 1 {
			fatalf("usage: hitcard user create <json>\n")
		}
		fmt.Println(post("/user", parseJSON(args[0])))
	case "update":
		if len(args) < 2 {
			fatalf("usage: hitcard user update <sn> <json>\n")
		}
		fmt.Println(put("/user/"+args[0], parseJSON(args[1])))
	case "delete":
		if len(args) < 1 {
			fatalf("usage: hitcard user delete <sn>\n")
		}
		fmt.Println(del("/user/" + args[0]))
	default:
		fatalf("unknown user action: %s\n", action)
	}
}

// ---------- problem-set ----------

func problemSetCmd(action string, args []string) {
	switch action {
	case "list":
		printJSON(get("/problem-set"))
	case "get":
		if len(args) < 1 {
			fatalf("usage: hitcard ps get <sn>\n")
		}
		printJSON(get("/problem-set/" + args[0]))
	case "list-by-owner":
		if len(args) < 1 {
			fatalf("usage: hitcard ps list-by-owner <owner>\n")
		}
		printJSON(get("/problem-set/owner/" + args[0]))
	case "create":
		if len(args) < 1 {
			fatalf("usage: hitcard ps create <json>\n")
		}
		fmt.Println(post("/problem-set", parseJSON(args[0])))
	case "update":
		if len(args) < 2 {
			fatalf("usage: hitcard ps update <sn> <json>\n")
		}
		fmt.Println(put("/problem-set/"+args[0], parseJSON(args[1])))
	case "hitup":
		if len(args) < 1 {
			fatalf("usage: hitcard ps hitup <sn>\n")
		}
		fmt.Println(put("/problem-set/"+args[0]+"/hitup", nil))
	case "hitdown":
		if len(args) < 1 {
			fatalf("usage: hitcard ps hitdown <sn>\n")
		}
		fmt.Println(put("/problem-set/"+args[0]+"/hitdown", nil))
	case "delete":
		if len(args) < 1 {
			fatalf("usage: hitcard ps delete <sn>\n")
		}
		fmt.Println(del("/problem-set/" + args[0]))
	default:
		fatalf("unknown problem-set action: %s\n", action)
	}
}

// ---------- category ----------

func categoryCmd(action string, args []string) {
	switch action {
	case "list":
		printJSON(get("/category"))
	case "get":
		if len(args) < 1 {
			fatalf("usage: hitcard cat get <sn>\n")
		}
		printJSON(get("/category/" + args[0]))
	case "list-by-ps":
		if len(args) < 1 {
			fatalf("usage: hitcard cat list-by-ps <problemSetSN>\n")
		}
		printJSON(get("/problem-set/" + args[0] + "/category"))
	case "create":
		if len(args) < 1 {
			fatalf("usage: hitcard cat create <json>\n")
		}
		fmt.Println(post("/category", parseJSON(args[0])))
	case "update":
		if len(args) < 2 {
			fatalf("usage: hitcard cat update <sn> <json>\n")
		}
		fmt.Println(put("/category/"+args[0], parseJSON(args[1])))
	case "delete":
		if len(args) < 1 {
			fatalf("usage: hitcard cat delete <sn>\n")
		}
		fmt.Println(del("/category/" + args[0]))
	default:
		fatalf("unknown category action: %s\n", action)
	}
}

// ---------- problem ----------

func problemCmd(action string, args []string) {
	switch action {
	case "list":
		printJSON(get("/problem"))
	case "get":
		if len(args) < 1 {
			fatalf("usage: hitcard prob get <sn>\n")
		}
		printJSON(get("/problem/" + args[0]))
	case "list-by-cat":
		if len(args) < 1 {
			fatalf("usage: hitcard prob list-by-cat <categorySN>\n")
		}
		printJSON(get("/category/" + args[0] + "/problem"))
	case "create":
		if len(args) < 1 {
			fatalf("usage: hitcard prob create <json>\n")
		}
		fmt.Println(post("/problem", parseJSON(args[0])))
	case "update":
		if len(args) < 2 {
			fatalf("usage: hitcard prob update <sn> <json>\n")
		}
		fmt.Println(put("/problem/"+args[0], parseJSON(args[1])))
	case "set-category":
		if len(args) < 2 {
			fatalf("usage: hitcard prob set-category <sn> <json>\n")
		}
		fmt.Println(put("/problem/"+args[0]+"/category", parseJSON(args[1])))
	case "hitup":
		if len(args) < 1 {
			fatalf("usage: hitcard prob hitup <sn>\n")
		}
		fmt.Println(put("/problem/"+args[0]+"/hitup", nil))
	case "hitdown":
		if len(args) < 1 {
			fatalf("usage: hitcard prob hitdown <sn>\n")
		}
		fmt.Println(put("/problem/"+args[0]+"/hitdown", nil))
	case "delete":
		if len(args) < 1 {
			fatalf("usage: hitcard prob delete <sn>\n")
		}
		fmt.Println(del("/problem/" + args[0]))
	default:
		fatalf("unknown problem action: %s\n", action)
	}
}

func parseJSON(s string) interface{} {
	var v interface{}
	// if it looks like a file, read it
	if !strings.HasPrefix(s, "{") {
		b, err := os.ReadFile(s)
		if err == nil {
			s = strings.TrimSpace(string(b))
		}
	}
	if err := json.Unmarshal([]byte(s), &v); err != nil {
		fatalf("invalid JSON: %v\n", err)
	}
	return v
}
