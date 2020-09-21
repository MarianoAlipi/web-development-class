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

            console.log(resp);

            let name = resp.data.name;
            let weight = resp.data.weight / 10;
            let sprite = resp.data.sprites.front_default;

            document.querySelector('#pokemon-list').appendChild(get_card_div(resp.data));
            let new_item = document.querySelector('#pokemon-list').lastElementChild;
            new_item.querySelector('.remove-item').addEventListener('click', (event) => remove_item(new_item));

            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining that Pokémon's data.");
        });
}

let remove_item = (element_to_delete) => {
    element_to_delete.remove();
}

function get_card_div(data) {

    let template = document.createElement('div');
    template.className = "pokemon-card";

    let types = [];
    data.types.forEach(element => types.push(element.type.name[0].toUpperCase() + element.type.name.slice(1)));

    template.innerHTML =   `
                            <div style='display: flex; justify-content: center;'>
                                <h4 style='padding: 0 0.5em 0 0;'>ID: ${data.id}</h4>
                                <h3 style='padding: 0 0 0.5em;'>${data.name[0].toUpperCase() + data.name.slice(1)}</h3>
                            </div>

                            <div class='flex-break'></div>
                            <img src='https://pokeres.bastionbot.org/images/pokemon/${data.id}.png' style='width: 50%; padding: 1em 0 2em 0;'>
                            <div class='flex-break'></div>

                            <table>
                                <tr>
                                    <td>Types</td>
                                    <td>${types}</td>
                                </tr>
                                <tr>
                                    <td>Weight</td>
                                    <td>${(data.weight / 10).toFixed(2)} kg</td>
                                </tr>
                                <tr>
                                    <td>Height</td>
                                    <td>${data.height * 10} cm</td>
                                </tr>
                                <tr>
                                    <td>Base experience</td>
                                    <td>${data.base_experience}</td>
                                </tr>
                            </table>
                            <div class='flex-break'></div>
                            <button class=\"remove-item\">remove</button>
                           `;

    return template;

}

// DOMContentLoaded wait until all dom is loaded, check the docs in below link
// https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", (_) => {
    
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