const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = 8080
let cards = {};

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cors())
app.get('/favicon.ico', (req, res) => res.status(204));

// Create card.
app.post('/create/:cardName,:cardType,:cardDetails', (req, res) => {

    let cardName = req.params["cardName"];
    let cardType = req.params["cardType"];
    let cardDetails = req.params["cardDetails"];
    
    console.log(`card name: ${cardName}, card type: ${cardType}, card details: ${cardDetails}`);

    if (cards[cardName] != null) {
        // console.log(pokemon_response.data); // Aquí está la data del pokemon
        console.log("A card with the same name ('" + cardName + "') already exists.");
        res.send("error:duplicate_card");
    } else {
        if (cardType == "pokemon") {
            console.log("Requesting Pokémon '" + cardName + "' data through API...");
            axios
            .get(`https://pokeapi.co/api/v2/pokemon/${cardName}`) 
            .then(pokemon_response => {
                    cards[pokemon_response.data.name] = pokemon_response.data;
                    // console.log(pokemon_response.data); // Aquí está la data del pokemon
                    // res.send(pokemon_response.data)
                    res.send("success");
                }).catch(function(error) {
                    console.log(error);
                    res.send("error");
              });
        } else {
            cards[cardName] = {type: cardType, details: cardDetails};
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

// Delete card.
app.delete('/delete/:cardName', (req, res) => {
    
    let cardName = req.params["cardName"];

    console.log("Deleting card '" + cardName + "'...");
    delete cards[cardName];
});

// Delete all cards.
app.delete('/deleteAll', (req, res) => {
    console.log("Deleting all cards...");
    cards = {};
});

app.listen(port)