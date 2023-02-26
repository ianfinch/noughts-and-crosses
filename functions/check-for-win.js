/**
 * Check for a winning line
 */
const checkForWinningLine = data => {

    // We're represented as -1, so a potential winning line would have a score of -2
    const matches = data.lines.filter(x => x.scores === -2);
    if (matches.length === 0) {

        return data;
    }

    // Find which square we should play
    const move = matches[0].squares.filter(x => x.value === "")[0].n;

    return Object.assign(data, { result: move });
};
