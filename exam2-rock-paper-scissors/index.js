let gameID = -1;
let isHost = false;
let gameState = null;
// This flag is false while the host is alone in the lobby or
// the guest hasn't joined any game. When it detects a change of
// 
let opponentJoined = false;
let ended = false;
// A match ended and the player clicked 'play again'.
// The player is now waiting for the opponent to choose
// 'play again' or to leave.
let waitingToRestart = false;

const ADDRESS = "192.168.1.71";
const PORT = "8080";

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
    .post(`http://${ADDRESS}:${PORT}/create/${nickname}`) 
    .then(resp => {

        if (resp.status == 201) {
            gameState = resp.data;
            gameID = gameState.gameID;
            isHost = true;
            console.log("Game ID: " + gameID);
            updateUI();
            $('.toast').toast('show');
            //alert(`Game created succesfully with ID ${gameID}!`);

            setTimeout(function() {
                get_game_state()
            }, 1000);

        } else {
            console.log(resp);
        }
        
        return;

    }).catch(function(error) {
        console.log(error);
        alert("An error ocurred.");
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
    } else if (gameIDToJoin.length != 4) {
        alert("Please enter a valid game ID.");
        return;
    }
    
    axios
    .get(`http://${ADDRESS}:${PORT}/join/${gameIDToJoin},${nickname}`)
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
    const request = `http://${ADDRESS}:${PORT}/choice/${gameID},${isHost},${choice}`;
    
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
    .get(`http://${ADDRESS}:${PORT}/getState/${gameID}`)
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
        console.log(error);
        swal({
            title: "Lost connection! :(",
            icon: "error",
            buttons: {
                "ok": {
                    text: "OK",
                    value: "ok",
                    className: "btn btn-primary"
                }
            }
        }).then((value) => {
            switch(value) {
                case "ok":
                    location.reload();
                    break;
                default:
                    break;
            }
        });
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
    .post(`http://${ADDRESS}:${PORT}/playerStatus/${gameID},${isHost},${status}`)
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
            location.reload();

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
        document.querySelector("#game-container").classList.add("d-none");
        document.querySelector("#forms-area").classList.remove("d-none");
        return;
    }
    
    $("#forms-area").fadeOut();
    document.querySelector("#forms-area").classList.add("d-none");
    $("#game-container").fadeIn();
    document.querySelector("#game-container").classList.remove("d-none");

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
    
    // If waiting to restart...
    if (waitingToRestart) {
        // The game restarted, so close the alert.
        if (gameState.hostChoice == null && gameState.guestChoice == null) {
            swal.close();
            waitingToRestart = false;
        } else {
            if (!swal.getState().isOpen) {
                swal({
                    title: `Waiting for ${isHost ? gameState.nicknameGuest : gameState.nicknameHost}...`,
                    icon: "./img/waiting.gif",
                    buttons: {
                        leave: {
                            text: "Leave",
                            value: "leave",
                            className: "btn btn-danger"
                        }
                    }
                }).then((value) => {
                    switch(value) {
                        case "leave":
                            update_player_status("exit");
                            break;
                        default:
                            break;
                    }
                });
            }
        }
    }

    // If both players chose already, show the result.
    if (hostChoice != "question" && guestChoice != "question") {
        
        if (!ended) {
            ended = true;
        } else {
            return;
        }
        document.querySelector("#opponent-choice").setAttribute("src", `./img/${isHost ? guestChoice : hostChoice}.png`);

        let playerResult = "";

        // Determine result (if not a tie).
        if (hostChoice == guestChoice) {
            playerResult = "It's a tie!";
        } else if (isHost) {
            playerResult = `You ${outcomes[hostChoice][guestChoice] ? "win" : "lose"}!`;
        } else {
            playerResult = `You ${outcomes[guestChoice][hostChoice] ? "win" : "lose"}!`;
        }
        console.log(playerResult);

        // Sweet Alert with the result.
        swal({
            title: playerResult,
            icon: playerResult == "It's a tie!" ? "./img/equal.png" : (playerResult == "You win!" ? "./img/crown.png" : "./img/letter-l.png"),
            content: "<img src='./img/ready.png'>",
            buttons: {
                leave: {
                    text: "Leave",
                    value: null,
                    className: "btn btn-danger"
                },
                playAgain: {
                    text: "Play again",
                    value: "playAgain",
                    className: "btn btn-primary"
                }
            }
        }).then((value) => {
            switch(value) {
                case "playAgain":
                    update_player_status("ready");
                    waitingToRestart = true;
                    break;
                case null:
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

    document.querySelectorAll(".leave-btn").forEach(element => {
        element.addEventListener('click', (event) => {
            update_player_status("exit");
        });
    });
    
    document.querySelectorAll(".choice-btn").forEach(element => {
        element.addEventListener('click', (event) => { choice_buttons_handler(event) });
    });

    // This fixes a problem that makes (invisible) toasts be on top of everything.
    $(".toast").on("show.bs.toast", function() {
        $(this).removeClass("d-none");
    });
    $(".toast").on("hide.bs.toast", function() {
        $(this).addClass("d-none");
    });

    document.getElementById("create-nickname").focus();
    document.getElementById("create-nickname").select();

});