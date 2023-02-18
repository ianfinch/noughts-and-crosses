/**
 * Engine to drive noughts and crosses
 *
 * Representation of the board is just an array
 */

/**
 * Check for a winner
 */
const checkForWin = board => {

    const lines = [board[0] === board[1] && board[1] === board[2] ? board[0] : "",
                   board[3] === board[4] && board[4] === board[5] ? board[3] : "",
                   board[6] === board[7] && board[7] === board[8] ? board[6] : "",
                   board[0] === board[3] && board[3] === board[6] ? board[0] : "",
                   board[1] === board[4] && board[4] === board[7] ? board[1] : "",
                   board[2] === board[5] && board[5] === board[8] ? board[2] : "",
                   board[0] === board[4] && board[4] === board[8] ? board[0] : "",
                   board[2] === board[4] && board[4] === board[6] ? board[2] : ""];

    const winningLines = lines.filter(x => x);

    if (winningLines.length === 0) {
        return null;
    }

    return winningLines[0];
};

/**
 * Redraw the board
 */
const redraw = board => {

    board.forEach((cell, i) => {

        const elem = document.getElementById("cell" + (i + 1));
        if (elem.textContent !== board[i]) {

            elem.textContent = board[i];
            if (board[i]) {
                elem.classList.add(board[i]);
            }
        }
    });
};

/**
 * Let the opponent make a random move
 */
const opponentMoveRandom = board => {

    // How many possible moves are there?
    const movesAvailable = board.filter(x => x === "").length;
    if (movesAvailable) {

        // Pick one
        const randomMove = Math.floor(movesAvailable * Math.random());

        // Adjust the move to account for occupied squares
        const adjusted = board.reduce((result, cell, i) => {

            if (result.remaining === -1) {

                return result;
            }

            if (cell === "") {

                return Object.assign(result, { remaining: result.remaining - 1 });
            }

            return Object.assign(result, { offset: result.offset + 1 });

        }, { remaining: randomMove, offset: randomMove });

        // Update the board
        board[adjusted.offset] = "O";

        // Redraw the board
        redraw(board);
    }
};

/**
 * Reset the board
 */
const resetBoard = board => {

    // Use a for loop to clear the board, since this needs to be destructive
    for (i = 0 ; i < board.length; i = i + 1) {
        board[i] = "";
    }

    // Redraw
    redraw(board);

    // Clear the style classes from the previous game
    [...document.getElementsByClassName("X")].forEach(elem => elem.classList.remove("X"));
    [...document.getElementsByClassName("O")].forEach(elem => elem.classList.remove("O"));
};

/**
 * The event handler for clicking on a cell
 *
 * Generate a closure to be able to access the board
 */
const cellClickHandler = board => {

    return e => {

        // Get the index for the clicked cell
        const cellIndex = e.target.id.replace(/^cell/, "") - 1;
        if (board[cellIndex] === "") {

            // Update the cell
            board[cellIndex] = "X";

            // Redraw the board
            redraw(board);

            // Was that a winning move?
            const win = checkForWin(board);
            if (win) {

                const message = "Win for " + (win === "X" ? "crosses" : "noughts");
                alertModal("Game Over", message, "New Game", () => { resetBoard(board); });

            // Was it a draw?
            } else if (board.filter(x => x === "").length === 0) {

                alertModal("Game Over", "The game was a draw", "New Game", () => { resetBoard(board); });

            // If we haven't won, let the opponent move
            } else {

                setTimeout(() => {

                    opponentMoveRandom(board)
                    const win = checkForWin(board);
                    if (win) {

                        setTimeout(() => {

                            const message = "Win for " + (win === "X" ? "crosses" : "noughts");
                            alertModal("Game Over", message, "New Game", () => { resetBoard(board); });
                        }, 200);
                    }
                }, 300);
            }
        }
    }
};

/**
 * Initialise the board
 */
const initBoard = () => {

    // Create a board (just an array)
    const board = ["", "", "", "", "", "", "", "", ""];

    // Add the event handler to all the cells
    [...document.getElementById("noughts-and-crosses").getElementsByTagName("div")].reduce((handler, elem) => {

        elem.addEventListener("click", handler);
        return handler;

    }, cellClickHandler(board));
}

/**
 * Run initialisation after the page has loaded
 */
document.addEventListener("DOMContentLoaded", () => {
    initModal();
    initBoard();
});
