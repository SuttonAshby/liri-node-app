var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var dotenv = require("dotenv").config();
var keys = require("./keys.js");
var inquirer = require("inquirer");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var toLog;
var score = 0;

var app = {
    initialize: function () {
        inquirer.prompt([{
            type: "list",
            message: "What would you like to do?",
            choices: ["Tweets", "Spotify", "Movies", "Do What it Says", "Play RPS", "Read Log", "Exit"],
            name: "initial"
        }]).then(function (inquirerResponse) {
            if (inquirerResponse.initial === "Tweets") {
                app.getTwitter()
            } else if (inquirerResponse.initial === "Spotify") {
                app.spotifyPrompt()
            } else if (inquirerResponse.initial === "Movies") {
                app.omdbPrompt()
            } else if (inquirerResponse.initial === "Do What it Says") {
                app.doWhat()
            } else if (inquirerResponse.initial === "Read Log") {
                app.readLog()
            } else if (inquirerResponse.initial === "Play RPS") {
                app.RPS()
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
        }]).then(app.getSpotify)
    },
    getSpotify: function (inquirerResponse) {
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
            toLog = "Spotify: " + inquirerResponse.song;
            app.log()
            app.againPrompt()
        });
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
                    toLog = "Movie: " + inquirerResponse.movie;
                    app.log()
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
                tweets.forEach(function (element) {
                    console.log("===================");
                    console.log("Created At: " + element.created_at);
                    console.log("Message: " + element.text);
                    console.log("===================");
                });
                toLog = "Get Twitter";
                app.log();
                app.againPrompt();
            }
        });
    },
    doWhat: function () {
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            var dataArr = data.split(",");
            if (dataArr[0] === "spotify-this-song") {
                var text = dataArr[1];
                spotify.search({ type: 'track', query: text, limit: 1 }, function (err, data) {
                    if (err) {
                        return console.log('Error occurred: ' + err);
                    }
                    console.log("===================");
                    console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
                    console.log("Title: " + data.tracks.items[0].name);
                    console.log("Album: " + data.tracks.items[0].album.name);
                    console.log("Preview: " + data.tracks.items[0].preview_url);
                    console.log("===================");
                    app.againPrompt()
                });
            } else if (dataArr[0] === "movie-this") {
                var text = dataArr[1];
                request("http://www.omdbapi.com/?t=" + text + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
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
            } else if (dataArr[0] === `my-tweets`) {
                app.getTwitter()
            }
        });
    },
    RPS: function () {
        inquirer.prompt([{
            type: "list",
            message: "Pick",
            choices: ["Rock", "Paper", "Scissors"],
            name: "rps"
        }]).then(function (inquirerResponse) {
            console.log("running")
            var randArr = ["Rock", "Paper", "Scissors"]
            var rand = randArr[Math.floor(Math.random() * 3)];
            console.log(rand)
            console.log(inquirerResponse.rps)
            if (inquirerResponse.rps === rand) {
                console.log("===================");
                console.log("You tied! Your score: " + score);
                console.log("===================");
                app.playAgain()
            } else if (inquirerResponse.rps === "Rock" && rand === "Scissors") {
                score++
                console.log("===================");
                console.log("You Won! Your score: " + score);
                console.log("===================");
                app.playAgain()
            } else if (inquirerResponse.rps === "Paper" && rand === "Rock") {
                score++
                console.log("===================");
                console.log("You Won! Your score: " + score);
                console.log("===================");
                app.playAgain()
            } else if (inquirerResponse.rps === "Scissors" && rand === "Paper") {
                score++
                console.log("===================");
                console.log("You Won! Your score: " + score);
                console.log("===================");
                app.playAgain()
            } else {
                console.log("===================");
                console.log("You Lost! Your score: " + score);
                console.log("===================");
                app.playAgain()
            }
        })
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
    },
    log: function () {
        fs.appendFile("log.txt", ", " + toLog, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    },
    readLog: function () {
        fs.readFile("log.txt", "utf8", function (error, data) {
            if (error) {
                return console.log(error);
            }
            var dataArr = data.split(",");
            for (var i = 0; i < dataArr.length; i++) {
                console.log("===================");
                console.log(dataArr[i]);
            }
            console.log("===================");
            app.againPrompt()
        });
    },
    playAgain: function () {
        inquirer.prompt([{
            type: "list",
            message: "Play Again?",
            choices: ["Yes", "No"],
            name: "playAgain"
        }]).then(function (inquirerResponse) {
            if (inquirerResponse.playAgain === "Yes") {
                app.RPS()
            } else {
                app.initialize()
            }
        });
    }
}

app.initialize()

