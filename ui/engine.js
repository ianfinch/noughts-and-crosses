/**
 * Engine to drive noughts and crosses
 *
 * Representation of the board is just an array
 */

/**
 * Decompose the board into possible lines
 */
const decomposeToLines = board => {

    const lines = [[ { n: 0 }, { n : 1 }, { n : 2 } ],
                   [ { n: 3 }, { n : 4 }, { n : 5 } ],
                   [ { n: 6 }, { n : 7 }, { n : 8 } ],
                   [ { n: 0 }, { n : 3 }, { n : 6 } ],
                   [ { n: 1 }, { n : 4 }, { n : 7 } ],
                   [ { n: 2 }, { n : 5 }, { n : 8 } ],
                   [ { n: 0 }, { n : 4 }, { n : 8 } ],
                   [ { n: 2 }, { n : 4 }, { n : 6 } ]];

    return lines.map(line => line.map(cell => Object.assign(cell, { value: board[cell.n] })));
};

/**
 * Convert a nought or a cross to a numeric value
 */
const glyphToValue = glyph => {

    if (glyph === "X") {
        return 1;
    }

    if (glyph === "O") {
        return -1;
    }

    return 0;
};

/**
 * Check for a winner
 */
const checkForWin = board => {

    const winner = decomposeToLines(board)
                        .map(line => line.reduce((total, x) => total + glyphToValue(x.value), 0))
                        .filter(x => Math.abs(x) === 3);

    if (winner.length === 0) {

        return null;
    }

    if (winner[0] > 0) {

        return "crosses";
    }

    return "noughts";
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
 * Let the opponent make their move
 */
const opponentMoves = board => {

    // Check that there is a move available
    const movesAvailable = board.filter(x => x === "").length;
    if (movesAvailable) {

        // Find the move to make
        const move = findBestMove(analyse(board));

        // Update the board
        board[move] = "O";

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
            const winner = checkForWin(board);
            if (winner) {

                const message = "Win for " + winner;
                alertModal("Game Over", message, "New Game", () => { resetBoard(board); });

            // Was it a draw?
            } else if (board.filter(x => x === "").length === 0) {

                alertModal("Game Over", "The game was a draw", "New Game", () => { resetBoard(board); });

            // If we haven't won, let the opponent move
            } else {

                setTimeout(() => {

                    opponentMoves(board)
                    const winner = checkForWin(board);
                    if (winner) {

                        setTimeout(() => {

                            const message = "Win for " + winner;
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
