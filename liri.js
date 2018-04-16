var dotenv = require("dotenv").config();
var keys = require("./keys.js")
var inquirer = require("inquirer");
var request = require("request");

// var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);


var app = {
    initialize: function () {
        inquirer.prompt([{
            type: "list",
            message: "What would you like to do?",
            choices: ["Tweets", "Spotify", "Movies", "Do What it Says", "Exit"],
            name: "initial"
        }]).then(function (inquirerResponse) {
            if (inquirerResponse.initial === "Tweets") {
                console.log(1)
            } else if (inquirerResponse.initial === "Spotify") {
                console.log(2)
            } else if (inquirerResponse.initial === "Movies") {
                app.omdbPrompt()
            } else if (inquirerResponse.initial === "Do What it says") {
                console.log(4)
            } else if(inquirerResponse.initial === "Exit"){
                console.log("==================="); 
                console.log("Goodbye!!"); 
                console.log("===================");
            }
        })
    },
    spotifyPrompt: function () {
        inquirer.prompt([{
            type: "input",
            message: "What song would you like to Spotify?",
            name: "song"
        }]).then(function (inquirerResponse) {

        })
    },
    omdbPrompt: function () {
        inquirer.prompt([{
            type: "input",
            message: "What Movie would you like to search for?",
            name: "movie"
        }]).then(function (inquirerResponse) {
            if(inquirerResponse.movie === ""){
                inquirerResponse.movie = "Mr. Nobody"
            }
            request("http://www.omdbapi.com/?t=" + inquirerResponse.movie + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    console.log("===================");
                    console.log("Title: " + JSON.parse(body).Title);
                    console.log("Year: " + JSON.parse(body).Year);
                    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                    console.log("Rotton Tomatos Rating: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Country: " + JSON.parse(body).Country);
                    console.log("Langauge: " + JSON.parse(body).Language);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("Actors: " + JSON.parse(body).Actors);
                    console.log("===================");
                    app.againPrompt()
                }
            });
        })
    },
    againPrompt: function(){
        inquirer.prompt([{
            type: "list",
            message: "Would you like to do something else?",
            choices: ["Yes", "No"],
            name: "again"
        }]).then(function (inquirerResponse){
            if(inquirerResponse.again === "Yes"){
                app.initialize()
            } else {
                console.log("==================="); 
                console.log("Goodbye!!"); 
                console.log("===================");
            }
        });
    }
}

app.initialize()

