// Handler for the 'create card' action.
let create_card_handler = (_) => {

    let nameField = document.getElementById("card-name-create");
    let cardName = nameField.value.trim().toLowerCase();

    let cardTypeSelect = document.getElementById("card-type");
    let cardType = cardTypeSelect.value;
    
    let cardDetailsField = document.getElementById("card-details-create");
    let cardDetails = cardDetailsField.value.trim();
    if (cardDetails == "") {
        cardDetails = "-";
    }

    nameField.value = "";
    cardTypeSelect.value = "pokemon";
    cardDetailsField.value = "";
    nameField.focus();
    nameField.select();

    // If the field is empty, don't add it.
    if (cardName === "") {
        return;
    }

    axios
        .post(`http://localhost:8080/create/${cardName},${cardType},${cardDetails}`) 
        .then(resp => {

            console.log(resp.data);

            if (resp.data.includes("error")) {
                alert(resp.data);
                return;
            } else if (resp.data.includes("success")) {
                alert(resp.data);
                return;
            }

            /*
            console.log(resp);

            let name = resp.data.name;
            let weight = resp.data.weight / 10;
            let sprite = resp.data.sprites.front_default;

            document.querySelector('#pokemon-list').appendChild(get_card_div(resp.data));
            let new_item = document.querySelector('#pokemon-list').lastElementChild;
            new_item.querySelector('.remove-item').addEventListener('click', (event) => remove_item(new_item));
            */
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining that Pokémon's data.");
        });
}

// Handler for the 'get card' action.
let get_card_handler = (_) => {

    let nameField = document.getElementById("card-name-get");
    let cardName = nameField.value.trim().toLowerCase();

    nameField.value = "";
    nameField.focus();
    nameField.select();

    // If the field is empty, don't get it.
    if (cardName === "") {
        return;
    }

    axios
        .get(`http://localhost:8080/get/${cardName}`)
        .then(resp => {

            if (typeof(resp.data) === 'string' && resp.data.includes("error")) {
                alert(resp.data);
                return;
            }

            document.querySelector('#pokemon-list').appendChild(make_card_div(resp.data));
            let new_item = document.querySelector('#pokemon-list').lastElementChild;
            new_item.querySelector('.remove-item').addEventListener('click', (event) => remove_item(new_item));
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining that Pokémon's data.");
        });
};

// Handler for the 'get all cards' action.
let get_all_cards_handler = (_) => {
    axios
        .get(`http://localhost:8080/getAll`)
        .then(resp => {

            if (typeof(resp.data) === 'string' && resp.data.includes("error")) {
                alert(resp.data);
                return;
            }
            
            for (const card in resp.data) {
                document.querySelector('#pokemon-list').appendChild(make_card_div(resp.data[card]));
                let new_item = document.querySelector('#pokemon-list').lastElementChild;
                new_item.querySelector('.remove-item').addEventListener('click', (event) => remove_item(new_item));
            }
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining that Pokémon's data.");
        });
};

// Handler for the 'delete card' action.
let delete_card_handler = (_) => {

    let nameField = document.getElementById("card-name-delete");
    let cardName = nameField.value.trim().toLowerCase();

    nameField.value = "";
    nameField.focus();
    nameField.select();

    // If the field is empty, don't send a request.
    if (cardName === "") {
        return;
    }

    axios.delete(`http://localhost:8080/delete/${cardName}`);
};

// Handler for the 'delete all cards' action.
let delete_all_cards_handler = (_) => {
    axios.delete(`http://localhost:8080/deleteAll`);
};

// Handler for the 'delete' button of each card.
let remove_item = (element_to_delete) => {
    element_to_delete.remove();
}

// Generate the HTML for a card.
function make_card_div(data) {

    let template = document.createElement('div');
    template.className = "pokemon-card";

    switch (data.type) {
        case "pokemon":
            let types = [];
            data.details.types.forEach(element => types.push(element.type.name[0].toUpperCase() + element.type.name.slice(1)));
        
            template.innerHTML =   `
                                    <div style='display: flex; justify-content: center;'>
                                        <h4 style='padding: 0 0.5em 0 0;'>ID: ${data.details.id}</h4>
                                        <h3 style='padding: 0 0 0.5em;'>${data.details.name[0].toUpperCase() + data.details.name.slice(1)}</h3>
                                    </div>
        
                                    <div class='flex-break'></div>
                                    <img src='https://pokeres.bastionbot.org/images/pokemon/${data.details.id}.png' style='width: 50%; padding: 1em 0 2em 0;'>
                                    <div class='flex-break'></div>
        
                                    <table>
                                        <tr>
                                            <td>Types</td>
                                            <td>${types}</td>
                                        </tr>
                                        <tr>
                                            <td>Weight</td>
                                            <td>${(data.details.weight / 10).toFixed(2)} kg</td>
                                        </tr>
                                        <tr>
                                            <td>Height</td>
                                            <td>${data.details.height * 10} cm</td>
                                        </tr>
                                        <tr>
                                            <td>Base experience</td>
                                            <td>${data.details.base_experience}</td>
                                        </tr>
                                    </table>
                                    <div class='flex-break'></div>
                                    <button class=\"remove-item\">remove</button>
                                   `;
            break;
        default:
            template.innerHTML = `
                                <div style='display: flex; justify-content: center; flex-wrap: wrap;'>
                                    <h3 style='padding: 0 0 0.5em;'>${data.name[0].toUpperCase() + data.name.substring(1)}</h3>
                                    <div class='flex-break'></div>
                                    <h5>Type: ${data.type[0].toUpperCase() + data.type.substring(1)}</h5>
                                </div>
                                <div class='flex-break'></div>
                                <p>${data.details}</p>
                                <div class='flex-break'></div>
                                <button class=\"remove-item\">remove</button>
                                `;
            break;
    }

    return template;

}

// DOMContentLoaded wait until all dom is loaded, check the docs in below link
// https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", (_) => {
    
    // The buttons' behavior.
    document.querySelector('#create-card').addEventListener('click', (event) => { create_card_handler() });
    document.querySelector('#get-card').addEventListener('click', (event) => { get_card_handler() });
    document.querySelector('#getall-cards').addEventListener('click', (event) => { get_all_cards_handler() });
    document.querySelector('#delete-card').addEventListener('click', (event) => { delete_card_handler() });
    document.querySelector('#deleteall-cards').addEventListener('click', (event) => { delete_all_cards_handler() });

    // Make the enter key press the buttons when typing in the fields.
    document.querySelector("#card-name-create").addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            document.querySelector("#create-card").click();
        }
    });

    document.querySelector("#card-name-get").addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            document.querySelector("#get-card").click();
        }
    });
    
    document.querySelector("#card-name-delete").addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            document.querySelector("#delete-card").click();
        }
    });

    document.getElementById("card-name-create").focus();
    document.getElementById("card-name-create").select();

});