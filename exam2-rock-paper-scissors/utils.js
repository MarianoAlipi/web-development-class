let gameID = -1;
let isHost = false;
let gameState = null;

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
                gameID = resp.data;
                isHost = true;
                console.log("Game ID: " + gameID);
                document.querySelector("#game-id").innerHTML = gameID;
                document.querySelector("#host-name").innerHTML = nickname;
                alert(`Game created succesfully with ID ${gameID}!`);
            } else {
                console.log(resp);
            }
            
            return;

        }).catch(function(error) {
            if (error.response.status == 500) {
                console.log(error);
                alert(`The game could not be created.`);
            } else {
                console.log(error);
                alert("An error ocurred.");
            }
        });
}

// Handler for the 'join game' action.
let join_game_handler = (_) => {

    const nicknameField = document.getElementById("join-nickname");
    const gameIDField = document.getElementById("join-id");
    const nickname = nicknameField.value.trim();
    const gameIDToJoin = gameIDField.value.trim();
    
    // If the fields are empty, cancel.
    if (nickname === "") {
        alert("Please enter a nickname.");
        return;
    }

    if (gameIDToJoin === "") {
        alert("Please enter the ID of the game you want to join.");
        return;
    }
    
    axios
    .get(`http://localhost:8080/join/${gameIDToJoin},${nickname}`)
    .then(resp => {

        if (resp.status == 200) {
            gameState = resp.data;
            gameID = resp.data.gameID;
            isHost = false;
            document.querySelector("#game-id").innerHTML = gameID;
            document.querySelector("#host-name").innerHTML = resp.data.nicknameHost;
            document.querySelector("#guest-name").innerHTML = resp.data.nicknameGuest;
            alert(`Joined ${resp.data.nicknameHost}'s game!`);
        } else {
            alert("An error ocurred.");
        }
        
    }).catch(function(error) {
        if (error.response.status == 403) {
            alert("The game is full!");
        } else if (error.response.status == 404) {
            alert("The game does not exist.");
        } else {
            console.log(error);
            alert("An error ocurred.");
        }
    });
};

let get_game_state = () => {

    if (gameID == -1) {
        console.log("You are not currently in a game.");
        return;
    }

    axios
    .get(`http://localhost:8080/getState/${gameID}`)
    .then(resp => {
        if (resp.status == 200) {
            gameState = resp.data;
        } else {
            console.log("An error ocurred: ");
            console.log(resp);
        }
    }).catch(function(error) {
        if (error.response.status == 404) {
            alert("You are not currently in a game.");
        } else {
            console.log(error);
        }
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