/**
 * Check whether we need to block our opponent
 */
const blockOpponent = data => {

    // Opponent is represented as 1, so opponent's winning line would have a score of 2
    const matches = data.lines.filter(x => x.scores === 2);
    if (matches.length === 0) {

        return data;
    }

    // Find which square we play to block
    const move = matches[0].squares.filter(x => x.value === "")[0].n;

    return Object.assign(data, { result: move });
};
