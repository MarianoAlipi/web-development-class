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
app.get('/:pokemonName', (req, res) => {
  let pokemon_name = req.params["pokemonName"]
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${pokemon_name}`) 
    .then(pokemon_response => {
      pokemons[pokemon_name] = pokemon_response.data
      console.log(pokemon_response.data); // Aquí está la data del pokemon
      res.send(pokemon_response.data)
    }).catch(function(error) {
      console.log(error);
      res.send("error");
    });

})

app.listen(port)