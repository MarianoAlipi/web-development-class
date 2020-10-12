const express = require('express')
const cors = require('cors')
const axios = require('axios')
const { response } = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 8080
// The cards in the Mongo database.
let cards = {};
// The cards without any Mongo format.
// Use this one for "get" routes.
let cardsInfo = {};

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cors())

// Connect to MongoDB.
console.log("Connecting to MongoDB database...");
mongoose.connect('mongodb://localhost/lab04', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
// On error...
db.on('error', console.error.bind(console, 'Connection error:'));

// On success...
db.once('open', function() {
    
    console.log("Connected to MongoDB database.");

    const cardSchema = new mongoose.Schema({
        name: { type: String, required: true, unique: true},
        cardType: { type: String, required: true },
        details: String,
        pokemonTypes: [String],
        weight: { type: Number, min: 0 },
        height: { type: Number, min: 0 },
        baseExperience: { type: Number, min: 0 }
    });

    const Card = mongoose.model('Card', cardSchema);
    cards = Card.find({});
    console.log("typeof: " + typeof cards);
    console.log("length: " + cards.length);
    console.log("cards: ");
    console.log(cards);
    
    // Routes.
    // Ignore favicon.
    app.get('/favicon.ico', (req, res) => res.status(204));
    // Create card.
    app.post('/create/:cardName,:cardType,:cardDetails', (req, res) => {
        
        let newCard = new Card();

        let cardName = req.params["cardName"];
        let cardType = req.params["cardType"];
        let cardDetails = req.params["cardDetails"];
        
        newCard.name = cardName;
        newCard.cardType = cardType;
        newCard.details = cardDetails;

        if (cards[cardName] != null) {
            console.log("A card with the same name ('" + cardName + "') already exists.");
            res.send("error:duplicate_card");
        } else {
            if (cardType == "pokemon") {
                console.log("Requesting Pokémon '" + cardName + "' data through API...");
                axios
            .get(`https://pokeapi.co/api/v2/pokemon/${cardName}`) 
            .then(pokemon_response => {
                newCard.details = pokemon_response.data;
                cards[pokemon_response.data.name] = newCard;
                res.send("success");
            }).catch(function(error) {
                console.log(error);
                res.send("error");
            });
            } else {
                cards[cardName] = newCard;
                res.send("success");
            }
        }
    });

    // Get card.
    app.get('/get/:cardName', (req, res) => {
        
        let cardName = req.params["cardName"];
        
        let card = cards[cardName];
        
        if (card != null) {
            console.log("Sending '" + cardName +"' card data to client...");
            res.send(card);
        } else {
            console.log("A card with that name ('" + cardName + "') does not exist.");
            res.send("error:card_not_found");
        }
        
    });

    // Get all cards.
    app.get('/getAll', (req, res) => {
        console.log("Sending all cards to client...");
        res.send(cards);
    });

    // Update card.
    app.put("/update/:cardName,:cardDetails", (req, res) => {
        
        let cardName = req.params["cardName"];
        let cardDetails = req.params["cardDetails"];
        
        if (cards[cardName] != null) {
            cards[cardName]["details"] = cardDetails;
            res.send("success");
        } else {
            res.send("error:card_not_found");
        }
        
    });

    // Delete card.
    app.delete('/delete/:cardName', (req, res) => {
        
        let cardName = req.params["cardName"];
        
        console.log("Deleting card '" + cardName + "'...");
        delete cards[cardName];
        
        res.send("success");
    });

    // Delete all cards.
    app.delete('/deleteAll', (req, res) => {
        console.log("Deleting all cards...");
        cards = {};
        res.send("success");
    });

    app.listen(port)

}); // end of on successful connection to MongoDB