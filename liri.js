var Spotify = require("node-spotify-api")
var Twitter = require("twitter")
var dotenv = require("dotenv").config();
var keys = require("./keys.js")
var inquirer = require("inquirer");
var request = require("request");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var app = {
    initialize: function () {
        inquirer.prompt([{
            type: "list",
            message: "What would you like to do?",
            choices: ["Tweets", "Spotify", "Movies", "Do What it Says", "Exit"],
            name: "initial"
        }]).then(function (inquirerResponse) {
            if (inquirerResponse.initial === "Tweets") {
                app.getTwitter()
            } else if (inquirerResponse.initial === "Spotify") {
                app.spotifyPrompt()
            } else if (inquirerResponse.initial === "Movies") {
                app.omdbPrompt()
            } else if (inquirerResponse.initial === "Do What it says") {
                console.log(4)
            } else if (inquirerResponse.initial === "Exit") {
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
            if (inquirerResponse.song === "") {
                inquirerResponse.song = "The Sign Ace of Base"
            }
            spotify.search({ type: 'track', query: inquirerResponse.song, limit: 1 }, function (err, data) {
                if (err) {
                    return console.log('Error occurred: ' + err);
                }
                // console.log(data.tracks.items[0]);
                console.log("===================");
                console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
                console.log("Title: " + data.tracks.items[0].name);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("Preview: " + data.tracks.items[0].preview_url);
                console.log("===================");
                app.againPrompt()
            });
        })
    },
    omdbPrompt: function () {
        inquirer.prompt([{
            type: "input",
            message: "What Movie would you like to search for?",
            name: "movie"
        }]).then(function (inquirerResponse) {
            if (inquirerResponse.movie === "") {
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
    getTwitter: function () {
        var params = { screen_name: 'Bot_tanical' };
        client.get('statuses/user_timeline', params, function (error, tweets, response) {
            if (!error) {
                // console.log(tweets);
                // console.log(response);
                tweets.forEach(function(element) {
                    console.log("===================");
                    console.log("Created At: " + element.created_at);
                    console.log("Message: " + element.text);
                    console.log("===================");
                });
                app.againPrompt()
            }
        });
    },
    againPrompt: function () {
        inquirer.prompt([{
            type: "list",
            message: "Would you like to do something else?",
            choices: ["Yes", "No"],
            name: "again"
        }]).then(function (inquirerResponse) {
            if (inquirerResponse.again === "Yes") {
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

