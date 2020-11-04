let gameID = -1;
let isHost = false;
let gameState = null;
let ended = false;

const outcomes = {
    'rock': {
        'paper': false,
        'scissors': true
    },
    'paper': {
        'rock': true,
        'scissors': false
    },
    'scissors': {
        'rock': false,
        'paper': true
    }
};

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
            gameState = resp.data;
            gameID = gameState.gameID;
            isHost = true;
            console.log("Game ID: " + gameID);
            updateUI();
            //alert(`Game created succesfully with ID ${gameID}!`);

            setTimeout(function() {
                get_game_state()
            }, 1000);

        } else {
            console.log(resp);
        }
        
        return;

    }).catch(function(error) {
        /*
        if (error.response.status == 500) {
            console.log(error);
            alert(`The game could not be created.`);
        } else {*/
            console.log(error);
            alert("An error ocurred.");
        // }
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
            updateUI();
            // alert(`Joined ${resp.data.nicknameHost}'s game!`);

            setTimeout(function() {
                get_game_state()
            }, 1000);

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

// When the player clicks one of the options.
let choice_buttons_handler = (e) => {
    
    if (gameID == -1) {
        console.log("You are not currently in a game.");
        updateUI();
        return;
    }
    
    const choice = e.target.value;
    const request = `http://localhost:8080/choice/${gameID},${isHost},${choice}`;
    
    axios
    .post(request)
    .then(resp => {
        if (resp.status == 200) {
            gameState = resp.data;
            updateUI();
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
}

// Get the current game state.
let get_game_state = () => {
    
    if (gameID == -1) {
        console.log("You are not currently in a game.");
        updateUI();
        return;
    }
    
    axios
    .get(`http://localhost:8080/getState/${gameID}`)
    .then(resp => {
        if (resp.status == 200) {
            gameState = resp.data;
            console.log("Received game state...");

            if (gameState.hostChoice == null || gameState.guestChoice == null) {
                ended = false;
            }

            updateUI();
   
            setTimeout(function() {
                get_game_state()
            }, 1000);
            return true;

        } else {
            console.log("An error ocurred: ");
            console.log(resp);
            return false;
        }
    }).catch(function(error) {
        alert("Lost connection! :(");
        console.log(error);
        gameID = -1;
        gameState = null;
        updateUI();
        return false;
    });
    
};

let update_player_status = (status) => {

    if (gameID == -1) {
        console.log("You are not currently in a game.");
        return;
    }

    if (status != "ready" && status != "exit") {
        console.log(`Invalid status ('${status}').`);
        return;
    }
    
    axios
    .post(`http://localhost:8080/playerStatus/${gameID},${isHost},${status}`)
    .then(resp => {
        if (resp.status == 200) {

            if (status == "ready") {
                gameState = resp.data;
                console.log("You're ready for next round! Received game state...");
            } else if (status == "exit") {
                gameID = -1;
                gameState = null;
            }
            updateUI();

        } else {
            console.log("An error ocurred: ");
            console.log(resp);
            return false;
        }
    }).catch(function(error) {
        alert("Lost connection! :(");
        console.log(error);
        gameID = -1;
        gameState = null;
        updateUI();
        return false;
    });

};

// Update the UI elements with the data of the current game state.
let updateUI = () => {

    // Make sure the player is connected to a game...
    if (gameID == -1) {
        document.querySelector("#your-choice").setAttribute("src", "./img/question.png");
        document.querySelector("#opponent-choice").setAttribute("src", "./img/question.png");
        document.querySelector("#game-id").innerHTML = "-";
        document.querySelector("#nav-game-id").innerHTML = "&nbsp;-&nbsp;";
        document.querySelector("#host-name").innerHTML = "-";
        document.querySelector("#guest-name").innerHTML = "-";
        return;
    }
    
    const hostChoice = (gameState.hostChoice == null) ? "question" : gameState.hostChoice;
    const guestChoice = (gameState.guestChoice == null) ? "question" : gameState.guestChoice;
    
    if (isHost) {
        
        // Hide buttons.
        if (hostChoice != "question") {
        }
        
        // Show choice.
        document.querySelector("#your-choice").setAttribute("src", `./img/${hostChoice}.png`)
        if (!ended) {
            document.querySelector("#opponent-choice").setAttribute("src", (guestChoice == "question") ? "./img/question.png" : "./img/ready.png");
        }
    } else {
        
        // Hide buttons.
        if (guestChoice != "question") {
        }
        
        // Show choice.
        document.querySelector("#your-choice").setAttribute("src", `./img/${guestChoice}.png`)
        if (!ended) {
            document.querySelector("#opponent-choice").setAttribute("src", (hostChoice == "question") ? "./img/question.png" : "./img/ready.png");
        }
    }
    
    document.querySelector("#game-id").innerHTML = gameState.gameID;
    document.querySelector("#nav-game-id").innerHTML = gameState.gameID;
    document.querySelector("#host-name").innerHTML = gameState.nicknameHost;
    document.querySelector("#guest-name").innerHTML = gameState.nicknameGuest;
    
    // If both players chose already, show the result.
    if (hostChoice != "question" && guestChoice != "question") {
        
        if (!ended) {
            ended = true;
        } else {
            return;
        }
        document.querySelector("#opponent-choice").setAttribute("src", `./img/${isHost ? guestChoice : hostChoice}.png`);

        let playerResult = "";

        // Determine result (if not draw).
        if (hostChoice == guestChoice) {
            playerResult = "It's a draw!";
        } else if (isHost) {
            playerResult = `You ${outcomes[hostChoice][guestChoice] ? "win" : "lose"}!`;
        } else {
            playerResult = `You ${outcomes[guestChoice][hostChoice] ? "win" : "lose"}!`;
        }
        console.log(playerResult);

        swal({
            title: playerResult,
            icon: playerResult == "It's a draw!" ? "info" : (playerResult == "You win!" ? "success" : "error"),
            buttons: {
                playAgain: {
                    text: "Play again",
                    value: "playAgain"
                },
                back: {
                    text: "Exit",
                    value: "exit"
                }
            }
        }).then((value) => {
            switch(value) {
                case "playAgain":
                    update_player_status("ready");
                    break;
                case "exit":
                    update_player_status("exit");
                    location.reload();
                    break;
                default:
                    update_player_status("ready");
            }
        });
    }

}

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
    
    document.querySelectorAll(".choice-btn").forEach(element => {
        element.addEventListener('click', (event) => { choice_buttons_handler(event) });
    });

    document.getElementById("create-nickname").focus();
    document.getElementById("create-nickname").select();

});