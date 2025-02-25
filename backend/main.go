// filepath: backend/main.go
package main

import (
    "log"
    "net/http"

    "github.com/gorilla/mux"
    "backend/handlers"
)

func main() {
    r := mux.NewRouter()
    r.HandleFunc("/api/income", handlers.GetIncome).Methods("GET")

    log.Println("Starting server on :8080")
    log.Fatal(http.ListenAndServe(":8080", r))
}