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

            if (resp.data.includes("error")) {
                if (resp.data == "error") {
                    alert("The card could not be created. Make sure the Pokémon's name is correctly spelled.");
                } else {
                    alert(`The card could not be created. (${resp.data})`);
                }
                return;
            } else if (resp.data.includes("success")) {
                alert("Card created succesfully!");
                return;
            }
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining the data.");
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
                alert(`The card could not be obtained. (${resp.data})`);
                return;
            }

            document.querySelector('#pokemon-list').appendChild(make_card_div(resp.data));
            let new_item = document.querySelector('#pokemon-list').lastElementChild;
            new_item.querySelector('.remove-item').addEventListener('click', (event) => remove_item(new_item));
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error obtaining the data.");
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
            alert("There was an error obtaining the data.");
        });
};

// Handler for the 'update card' action.
let update_card_handler = (_) => {

    let nameField = document.getElementById("card-name-update");
    let cardName = nameField.value.trim().toLowerCase();
    
    let cardDetailsField = document.getElementById("card-details-update");
    let cardDetails = cardDetailsField.value.trim();
    if (cardDetails == "") {
        cardDetails = "-";
    }

    nameField.value = "";
    cardDetailsField.value = "";
    nameField.focus();
    nameField.select();

    // If the field is empty, don't add it.
    if (cardName === "") {
        return;
    }

    axios
        .put(`http://localhost:8080/update/${cardName},${cardDetails}`) 
        .then(resp => {

            if (resp.data.includes("error")) {
                alert(`The card could not be updated. Make sure the name is correctly spelled. (${resp.data})`);
                return;
            } else if (resp.data.includes("success")) {
                alert("Card updated succesfully!");
                return;
            }
            
        }).catch(function(error) {
            console.log(error);
            alert("There was an error updating the data.");
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

    axios
        .delete(`http://localhost:8080/delete/${cardName}`)
        .then(resp => {
            if (resp.data.includes("success")) {
                alert("Card deleted successfully!");
            } else {
                alert("Card could not be deleted.");
            }
        })
        .catch(function(error) {
            console.log(error);
    });
};

// Handler for the 'delete all cards' action.
let delete_all_cards_handler = (_) => {
    axios
        .delete(`http://localhost:8080/deleteAll`)
        .then(resp => {
            if (resp.data.includes("success")) {
                alert("All cards deleted successfully!");
            } else {
                alert("Cards could not be deleted.");
            }
        })
        .catch(function(error) {
            console.log(error);
    });
};

// Handler for the 'remove' button of each card.
let remove_item = (element_to_remove) => {
    element_to_remove.remove();
}

// Handler for the 'remove all cards' button.
let remove_all_cards = () => {
    document.getElementById("pokemon-list").innerHTML = "";
}

// Generate the HTML for a card.
// 'data' is a document from the database.
function make_card_div(data) {

    let template = document.createElement('div');
    template.className = "pokemon-card";

    switch (data.cardType) {
        case "pokemon":
            template.innerHTML =   `
                                    <div style='display: flex; justify-content: center;'>
                                        <h4 style='padding: 0 0.5em 0 0;'>ID: ${data.pokemonID}</h4>
                                        <h3 style='padding: 0 0 0.5em;'>${data.name[0].toUpperCase() + data.name.slice(1)}</h3>
                                    </div>
        
                                    <div class='flex-break'></div>
                                    <img src='https://pokeres.bastionbot.org/images/pokemon/${data.pokemonID}.png' style='width: 50%; padding: 1em 0 2em 0;'>
                                    <div class='flex-break'></div>
        
                                    <table>
                                        <tr>
                                            <td>Types</td>
                                            <td>${data.pokemonTypes}</td>
                                        </tr>
                                        <tr>
                                            <td>Weight</td>
                                            <td>${(data.weight).toFixed(2)} kg</td>
                                        </tr>
                                        <tr>
                                            <td>Height</td>
                                            <td>${data.height} cm</td>
                                        </tr>
                                        <tr>
                                            <td>Base experience</td>
                                            <td>${data.baseExperience}</td>
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
                                    <h5>Type: ${data.cardType[0].toUpperCase() + data.cardType.substring(1)}</h5>
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
    document.querySelector('#update-card').addEventListener('click', (event) => { update_card_handler() });
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
    
    document.querySelector("#card-name-update").addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            document.querySelector("#update-card").click();
        }
    });

    document.querySelector("#remove-all-cards").addEventListener('click', (event) => {
        remove_all_cards();
    });
    
    document.getElementById("card-name-create").focus();
    document.getElementById("card-name-create").select();

});