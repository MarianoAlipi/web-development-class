// Handler for the 'create game' action.
let create_game_handler = (_) => {

    const nicknameField = document.getElementById("create-nickname");
    const nickname = nicknameField.value.trim();

    nicknameField.value = "";
    nicknameField.focus();
    nicknameField.select();

    // If the field is empty, cancel.
    if (nickname === "") {
        alert("Please enter a nickname.");
        return;
    }

    axios
        .post(`http://localhost:8080/create/${nickname}`) 
        .then(resp => {

            if (resp.status == 201) {
                console.log("Game ID: " + resp.data);
                alert(`Game created succesfully with ID ${resp.data}!`);
            } else {
                if (resp.status == 500) {
                    alert(`The game could not be created. (${resp.data})`);
                } else {
                    console.log(resp);
                    alert("An error ocurred.");
                }

            }
            
            return;

        }).catch(function(error) {
            console.log(error);
            alert("There was an error creating the game.");
        });
}

// Handler for the 'join game' action.
let join_game_handler = (_) => {

    const nicknameField = document.getElementById("join-nickname");
    const gameIDField = document.getElementById("join-id");
    const nickname = nicknameField.value.trim();
    const gameID = gameIDField.value.trim();

    nicknameField.value = "";
    nicknameField.focus();
    nicknameField.select();
    
    // If the fields are empty, cancel.
    if (nickname === "") {
        alert("Please enter a nickname.");
        return;
    }

    if (gameID === "") {
        alert("Please enter the ID of the game you want to join.");
        return;
    }
    
    axios
    .get(`http://localhost:8080/join/${gameID},${nickname}`)
    .then(resp => {

        if (resp.status == 200) {
            alert(`Joined ${resp.data.nicknameHost}'s game!`);
        } else {
            if (resp.status == 404) {
                alert("The game does not exist.");
            } else {
                console.log(resp);
                alert("An error ocurred.");
            }
        }

        /*
            behavior
        */
        
    }).catch(function(error) {
        console.log(error);
        alert("There was an error obtaining the data.");
    });
};

// DOMContentLoaded wait until all dom is loaded, check the docs in below link
// https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", (_) => {
    
    // The buttons' behavior.
    document.querySelector('#create-btn').addEventListener('click', (event) => { create_game_handler() });
    document.querySelector('#join-btn').addEventListener('click', (event) => { join_game_handler() });
    
    // Make the enter key press the buttons when typing in the fields.
    document.querySelector("#create-nickname").addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            document.querySelector("#create-btn").click();
        }
    });
    
    document.querySelector("#join-id").addEventListener("keypress", (event) => {
        if (event.keyCode === 13) {
            document.querySelector("#join-btn").click();
        }
    });
    
    document.getElementById("create-nickname").focus();
    document.getElementById("create-nickname").select();

});