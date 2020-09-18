
document.addEventListener("DOMContentLoaded", function(_){  //El "_" señala que es un argumento que no vamos a utilizar
let event_handler = (_) =>{
    let pokemonName = document.getElementById("pokemon-name").value;
    axios
      .get(`http://localhost:8080/${pokemonName}`) 
      .then(resp => {
        console.log(resp.data); //Aquí está la data del pokemon
      }).catch(function(error) {
          console.log(error)
      });
}


let boton = document.getElementById("add-pokemon");
boton.addEventListener("click", event_handler);

  
}); 

