
//Factory function to create the players
const Player = (name, letter) => {
    const getName = () => name;
    const getLetter = () => letter;

    return { getName, getLetter };
};

//Create two players
const player1 = Player("Player1", "X");
const player2 = Player("Player2", "O");

//Module for gameboard
const gameBoard = ((doc) => {
    let board = ["", "", "", "", "", "", "", "", ""];
    let player1Turn = true;
    const gameGrid = doc.querySelectorAll(".game-cell");

    const getPlayer1Turn = () => player1Turn;

    //Add event to game cells
    const _gameGridAddEvent = () => {
        gameGrid.forEach(element => {
            element.addEventListener("click", fillBoard);
        });
    }
    //Fill the board array with every turn
    const fillBoard = function () {
        let index = this.dataset.index;
        if (board[index] !== "") {
            return;
        }
        const that = this;
        displayController.writeLetter(that);
        if (player1Turn) {
            board.splice(index, 1, player1.getLetter());
        } else {
            board.splice(index, 1, player2.getLetter());
        }
        _checkWin();
        player1Turn = !player1Turn;

    }

    //Check if a player win
    const _checkWin = () => {
        let anyWinner = false;
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let i = 0; i < 7; i++) {
            const winCondition = winningConditions[i];
            let a = board[winCondition[0]];
            let b = board[winCondition[1]];
            let c = board[winCondition[2]];

            if (a === "" || b === "" || c === "") {
                continue;
            }
            if (a === b && b === c) {
                displayController.declareWinner();
                anyWinner = true;
                break;
            }
        }
        if (anyWinner === false && board[0] !== "" && board[1] !== "" && board[2] !== "" &&
            board[3] !== "" && board[4] !== "" && board[5] !== "" &&
            board[6] !== "" && board[7] !== "" && board[8] !== "") {
            displayController.declareDraw();
        }
    }

    //Start the game
    const startGame = () => {
        _gameGridAddEvent();
    }

    //Disable grid clicks
    const disableGrid = () => {
        gameGrid.forEach(element => {
            element.removeEventListener("click", fillBoard);
        });
    }

    //Reset board
    const resetGame = () => {
        board.splice(0, board.length, "", "", "", "", "", "", "", "", "");
        player1Turn = true;
    }

    //Delete the text of the game board
    const deleteGridText = () => {
        gameGrid.forEach(element => {
            element.textContent = "";
        });
    }

    return { getPlayer1Turn, startGame, resetGame, deleteGridText, disableGrid };
})(document);

//Module to control the game
const displayController = ((doc) => {

    //Write X or O depending on player turn
    const writeLetter = function (that) {
        const paragraph = doc.querySelector(".player-turn");
        const player1Turn = gameBoard.getPlayer1Turn();
        if (player1Turn) {
            that.textContent = player1.getLetter();
            paragraph.textContent = "Player 'O' turn";
        } else {
            that.textContent = player2.getLetter();
            paragraph.textContent = "Player 'X' turn";
        }
    }
    //Write in DOM the winner
    const declareWinner = () => {
        const paragraph = doc.querySelector(".player-turn");
        if (gameBoard.getPlayer1Turn()) {
            paragraph.textContent = "Player 'X' win!";
        } else {
            paragraph.textContent = "Player 'O' win!";
        }
        _createRestartButton();
        _disableGrid();
    }

    const declareDraw = () => {
        const paragraph = doc.querySelector(".player-turn");
        paragraph.textContent = "It's a draw!";
        _createRestartButton();
        _disableGrid();
    }
    //Create a button to restart the game
    const _createRestartButton = () => {
        const restartButton = doc.createElement("button");
        restartButton.classList.add("btn-restart");
        restartButton.textContent = "Restart";
        restartButton.addEventListener("click", _restartGame);
        doc.querySelector(".header").appendChild(restartButton);
    }

    const _disableGrid = () => {
        gameBoard.disableGrid();
    }

    const _restartGame = () => {
        const paragraph = doc.querySelector(".player-turn");
        paragraph.textContent = "Player 'X' turn";
        gameBoard.resetGame();
        gameBoard.deleteGridText();
        gameBoard.startGame();
        doc.querySelector(".btn-restart").remove();
    }

    return { declareWinner, writeLetter, declareDraw };
})(document);

//Start the game
gameBoard.startGame();