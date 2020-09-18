let total_weight = 0.00;

function update_total() {
    document.querySelector('#total').innerHTML = total_weight.toFixed(2) + " kg";
}

let add_pokemon_handler = (_) =>{

    let pokemonNameField = document.getElementById("pokemon-name");
    let pokemonName = pokemonNameField.value.trim().toLowerCase();

    pokemonNameField.value = "";
    pokemonNameField.focus();
    pokemonNameField.select();

    // If the field is empty, don't add it.
    if (pokemonName === "") {
        return;
    }

    axios
        .get(`http://localhost:8080/${pokemonName}`) 
        .then(resp => {

            // console.log(resp.data);

            if (resp === "error") {
                alert("There was an error obtaining that Pokémon's data.");
                return;
            }

            let name = resp.data.name;
            let weight = resp.data.weight / 10;
            let sprite = resp.data.sprites.front_default;
            // resp.data.sprites.versions["generation-v"]["black-white"].animated.front_default;

            document.querySelector('#pokemon-list').appendChild(get_element_li(name, weight, sprite));

            let new_item = document.querySelector('#pokemon-list').lastElementChild;
            new_item.querySelector('.remove-item').addEventListener('click', (event) => remove_item(new_item));

            total_weight += resp.data.weight / 10;
            update_total();
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining that Pokémon's data.");
        });
}

let remove_item = (element_to_delete) => {

    let str = element_to_delete.innerHTML;
    let index = str.indexOf("weight: ");
    let weight = parseFloat(str.substring(index + 7));

    if (!isNaN(weight)) {
        total_weight -= weight;
        update_total();
    }

    element_to_delete.remove();
}

function get_element_li (name, weight, img) {
    
    let template = document.createElement('li');
    template.className = "added-item";

    template.innerHTML = "<div class='list-item'><div class='item-details'>name: <strong>" + name + "</strong> weight: " + weight.toFixed(2) + " kg <img src='" + img + "'></div>  <button class=\"remove-item\">remove</button></div>";

    return template;
}

let thenable_handle_for_the_result_of_the_pokemon_request = (result) => {
// handle here the pokemon from the request
}

let catchable_handle_for_the_error_of_the_pokemon_request = (err) => {
// handle here the pokemon error from the request
}

// DOMContentLoaded wait until all dom is loaded, check the docs in below link
// https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", (_) => {

    update_total();
    
    // The add button behavior.
    document.querySelector('#add-pokemon').addEventListener('click', (event) => { add_pokemon_handler() });

    // Make the enter key press the add button.
    document.querySelector("#pokemon-name").addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            document.querySelector("#add-pokemon").click();
        }
    });

    document.getElementById("pokemon-name").focus();
    document.getElementById("pokemon-name").select();

});