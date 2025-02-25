// filepath: backend/handlers/income.go
package handlers

import (
    "net/http"
)

func GetIncome(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.Write([]byte(`{"totalIncome": 1000}`))
}
