/**
 * Find the best move, by finding the square with the most possible lines going through it
 */
const findBestMove = lines => {

    // Find the highest weight possible
    const weights = _findMaxima(lines);
console.log(weights);
    const maxWeight = weights.reduce((max, x) => x > max ? x : max, 0);

    // Find the first square with that weight
    const firstMatch = weights.reduce((found, x, i) => {

        // If we've already got the match, return that
        if (found !== -1) {

            return found;
        }

        // If this square is maximally weighted, set it as found
        if (x === maxWeight) {

            return i;
        }

        // Keep on looking
        return -1;

    }, -1);

    return firstMatch;
};

/**
 * Analyse the squares to find the possible number of lines going through each one
 */
const _findMaxima = lines => {

    // Represent the 9 squares to iterate over
    const squares = Array(9).fill().map((_, i) => i);

    // We only want to consider empty squares
    const availableSquares = [... new Set(lines.map(line => line.squares)
                                               .flat()
                                               .filter(x => x.value === "")
                                               .map(x => x.n))];

    // See how many possible lines run through each square
    const weights = squares.map(square => {

        // Don't bother analysing squares which are no longer available
        if (!availableSquares.includes(square)) {

            return -1;
        }

        // For this square, look for the lines through it, increasing a running
        // total every time we find one
        return lines.reduce((total, line) => {

            // If the line contains our square, analyse further
            if (line.squares.map(x => x.n).includes(square)) {

                // If the line contains our opponent's glyph, it's no good to us
                // (remember we are playing noughts, which we represent as -1)
                if (line.scores !== -1 * line.occupied) {
                    return total;
                }

                // Line is either empty or only contains our glyph, so count it
                return total + 1;
            }

            // The line doesn't contain this square, so leave the total unchanged
            return total;

        }, 0);
    });

    return weights;
};
