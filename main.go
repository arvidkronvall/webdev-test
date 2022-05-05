package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

type CatData struct {
	CatData []Cat `json:"cats"`
}

type Cat struct {
	Name               string `json:"name"`
	Image              string `json:"image"`
	CutenessLevel      int    `json:"cutenessLevel"`
	AllergyInducingFur bool   `json:"allergyInducingFur"`
	LivesLeft          int    `json:"livesLeft"`
}

//convert struct back to JSON and writes
func Cats(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		cats := readJsonFile()
		json.NewEncoder(w).Encode(cats)
	}

}

func main() {
	http.HandleFunc("/cats", Cats)

	//Listens to the port that we're hosting our client on
	//Fatal to receive error messages
	log.Fatal(http.ListenAndServe(":5600", nil))
}

//Reads local file and return data as struct
func readJsonFile() CatData {
	file, _ := ioutil.ReadFile("catdata.json")
	data := CatData{}

	//Convert json to struct
	_ = json.Unmarshal([]byte(file), &data)
	return data
}
