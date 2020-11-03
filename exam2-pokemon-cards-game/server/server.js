const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { response } = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cors())

// Connect to MongoDB.
console.log("Connecting to MongoDB database...");
mongoose.connect('mongodb://localhost/exam2-rockPaperScissors', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
const db = mongoose.connection;
// On error...
db.on('error', console.error.bind(console, 'Connection error:'));

// On success...
db.once('open', function() {
    
    console.log("Connected to MongoDB database.");

    const gameSchema = new mongoose.Schema({
        // Games should be deleted when the host leaves so game IDs can be reused later.
        // While a game is active, the ID should be unique.
        gameID: { type: String, required: true, unique: true },
        nicknameHost: { type: String, required: true },
        nicknameGuest: { type: String },
        hostChoice: String,
        guestChoice: String
    });

    const Game = mongoose.model('Game', gameSchema);
    
    // Routes.
    // Ignore favicon.
    app.get('/favicon.ico', (req, res) => res.status(204));
    // Create game.
    app.post('/create/:nickname', async (req, res) => {
        
        let newGame = new Game();

        const nickname = req.params["nickname"];
        
        // Generate a valid and unique game ID.
        let gameID = "";
        let queryRes = null;
        
        do {
            gameID = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
            queryRes = await Game.findOne({gameID}).exec();
        } while (queryRes != null);
        
        newGame.gameID = gameID;
        newGame.nicknameHost = nickname;
        newGame.nicknameGuest = null;
        newGame.hostChoice = null;
        newGame.guestChoice = null;

        console.log("Creating game with ID " + gameID + "...");
        
        // Save the game.
        newGame.save(function (err, result) {
            if (err) {
                console.log(err);
                res.status(500);
                res.send("error:could_not_create_game");
            } else {
                console.log(result);
            }
        });

        res.status(201);
        res.send(gameID);
    });

    // Join game.
    app.get('/join/:gameID,:nickname', async (req, res) => {
        
        const gameID = req.params["gameID"];
        const nickname = req.params["nickname"];

        const game = await Game.findOne({gameID}).exec();

        if (game != null) {
            
            game.nicknameGuest = nickname;
            game.save();

            res.status(200);
            res.send(game);

        } else {
            console.log("Guest '" + nickname + "' tried to join a game that does not exist (game ID: " + gameID + ").");
            res.status(404);
            res.send("error:game_does_not_exist");
        }
        
    });

    // Get the current state of the game.
    app.get('/getState/:gameID'), async (req, res) => {

        const gameID = req.params["gameID"];
        const game = await Game.findOne({gameID}).exec();

        if (game != null) {
            res.status(200);
            res.send(game);
        } else {
            res.status(404);
            res.send("error:game_does_not_exist");
        }

    }

    app.listen(port)

}); // end of on successful connection to MongoDB