const SIZE = 8;

const boardDom = document.querySelector("#board");
const redcounter = document.getElementById("redCounter");
const bluecounter = document.getElementById("blueCounter");
const winnerdom = document.getElementById("winner");
const clearButton = document.getElementById("clear");
const resetButton = document.getElementById("Reset");

let state = {
    redScore: 0,
    blueScore: 0,
    turn: true, // true = Red, false = Blue
    board: createBoard()
};

let isplayable = true;

// Create an empty row
function createArray() {
    return Array(SIZE).fill(null);
}

// Create the board
function createBoard() {
    return Array.from({ length: SIZE }, () => createArray());
}

// Display the board and scores
function render() {
    boardDom.innerHTML = "";

    for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
            const cell = document.createElement("div");

            cell.dataset.col = j;
            cell.className = "cell";

            if (state.board[i][j] === true) {
                cell.style.backgroundColor = "red";
            } else if (state.board[i][j] === false) {
                cell.style.backgroundColor = "blue";
            } else {
                cell.style.backgroundColor = "white";
            }

            cell.addEventListener("click", () => {
                play(Number(cell.dataset.col));
            });

            boardDom.appendChild(cell);
        }
    }

    redcounter.textContent = state.redScore;
    bluecounter.textContent = state.blueScore;
}

// Play a move in the selected column
function play(col) {
    if (!isplayable) return;

    if (col < 0 || col >= SIZE) return;

    // Find the lowest empty cell in this column
    for (let row = SIZE - 1; row >= 0; row--) {
        if (state.board[row][col] === null) {
            const player = state.turn;

            // Place the piece
            state.board[row][col] = player;

            // Check whether this move wins the game
            if (winnerExist()) {
                render();
                autoclear(player);
                return;
            }

            // Check for a draw
            if (state.board.every(row => row.every(cell => cell !== null))) {
                winnerdom.textContent = "It's a draw!";
                winnerdom.style.backgroundColor = "black";
                isplayable = false;
                render();
                return;
            }

            // Switch to the next player
            state.turn = !state.turn;

            render();
            return;
        }
    }

    // The column is full, so do nothing
}

// Check horizontal, vertical, and diagonal wins
function winnerExist() {
    const directions = [
        [0, 1],  // Horizontal
        [1, 0],  // Vertical
        [1, 1],  // Diagonal down-right
        [1, -1]  // Diagonal down-left
    ];

    for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
            const player = state.board[row][col];

            if (player === null) continue;

            for (const [dr, dc] of directions) {
                let count = 1;

                for (let k = 1; k < 4; k++) {
                    const r = row + dr * k;
                    const c = col + dc * k;

                    // Make sure the position is inside the board
                    if (
                        r < 0 || r >= SIZE ||
                        c < 0 || c >= SIZE
                    ) {
                        break;
                    }

                    if (state.board[r][c] !== player) {
                        break;
                    }

                    count++;
                }

                if (count >= 4) {
                    return true;
                }
            }
        }
    }

    return false;
}

// Handle the winner and update the score
function autoclear(player) {
    if (!isplayable) return;

    if (player === true) {
        state.redScore++;

        winnerdom.textContent = "The winner is: Red";
        winnerdom.style.backgroundColor = "red";
    } else {
        state.blueScore++;

        winnerdom.textContent = "The winner is: Blue";
        winnerdom.style.backgroundColor = "blue";
    }

    isplayable = false;
    render();
}

// Clear the board but keep the scores
function clear() {
    state.board = createBoard();
    state.turn = true;

    isplayable = true;

    winnerdom.textContent = "The winner is:";
    winnerdom.style.backgroundColor = "black";

    render();
}

// Reset scores and start a new game
function Reset() {
    state.redScore = 0;
    state.blueScore = 0;

    clear();
}

// Button events
clearButton.addEventListener("click", clear);
resetButton.addEventListener("click", Reset);

// Start the game
render();