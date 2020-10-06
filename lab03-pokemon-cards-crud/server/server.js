const express = require('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
const port = 8080
let pokemons = {}

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}))
app.use(cors())
app.get('/favicon.ico', (req, res) => res.status(204));
// Create card.
app.post('/create/:cardName', (req, res) => {

    let cardName = req.params["cardName"];
    
    if (pokemons[cardName] != null) {
        // console.log(pokemon_response.data); // Aquí está la data del pokemon
        console.log("A card with the same name already exists.");
        res.send("error:duplicate_card");
    } else {
        console.log("Requesting Pokémon data through API...");
        axios
        .get(`https://pokeapi.co/api/v2/pokemon/${cardName}`) 
        .then(pokemon_response => {
                pokemons[pokemon_response.data.name] = pokemon_response.data;
                // console.log(pokemon_response.data); // Aquí está la data del pokemon
                // res.send(pokemon_response.data)
                res.send("success");
            }).catch(function(error) {
                console.log(error);
                res.send("error");
          });
    }
});

// Get card.
app.get('/get/:cardName', (req, res) => {

    let cardName = req.params["cardName"];

    let card = pokemons[cardName];

    if (card != null) {
        console.log("Sending card data to client...");
        res.send(card);
    } else {
        console.log("A card with that name does not exist.");
        res.send("error:card_not_found");
    }

});

app.listen(port)