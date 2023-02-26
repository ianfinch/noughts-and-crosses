/**
 * Create an analysis of the current position of the board, for use by move-making functions
 */

/**
 * Decompose the board into possible lines
 */
const _decomposeToLines = board => {

    const lines = [{ squares: [ { n: 0 }, { n : 1 }, { n : 2 } ] },
                   { squares: [ { n: 3 }, { n : 4 }, { n : 5 } ] },
                   { squares: [ { n: 6 }, { n : 7 }, { n : 8 } ] },
                   { squares: [ { n: 0 }, { n : 3 }, { n : 6 } ] },
                   { squares: [ { n: 1 }, { n : 4 }, { n : 7 } ] },
                   { squares: [ { n: 2 }, { n : 5 }, { n : 8 } ] },
                   { squares: [ { n: 0 }, { n : 4 }, { n : 8 } ] },
                   { squares: [ { n: 2 }, { n : 4 }, { n : 6 } ] }];

    return lines.map(line => {

        return { squares: line.squares.map(cell => Object.assign(cell, { value: board[cell.n] })) };
    });
};

/**
 * Convert a nought or a cross to a numeric value
 */
const _glyphToValue = glyph => {

    if (glyph === "X") {
        return 1;
    }

    if (glyph === "O") {
        return -1;
    }

    return 0;
};

/**
 * Add scoring for each line
 */
const _addScoring = line => {

    return Object.assign(line, {

        scores: line.squares.reduce((total, x) => total + glyphToValue(x.value), 0),
        occupied: line.squares.reduce((total, x) => total + (x.value !== ""), 0)
    });
};

/**
 * Run the analysis
 */
const analyse = board => {

    return {
        result: null,
        lines: _decomposeToLines(board).map(_addScoring)
    };
};
