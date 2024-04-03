
const beginner = {
    rows: 10,
    columns: 10,
    mines: 10,
    className: "beginner"
};
const intermediate = {
    rows: 16,
    columns: 16,
    mines: 40,
    className: "intermediate"
};
const expert = {
    rows: 30,
    columns: 30,
    mines: 99,
    className: "expert"
};

const gameParameters = {
    level: {
        rows: 0,
        columns: 0,
        mines: 0,
        className: "",
    },
    player: {
        name: "",
        ID: 0
    }
};

let board;
let picture;
let tile;
let remaining;
let revealed;
let intervalID = null;
let seconds = 0;

const statusLabel = document.getElementById('status');
statusLabel.addEventListener('click', newGame);





function check(row, column) {
    if (column >= 0 && row >= 0 && column < gameParameters.level.columns && row < gameParameters.level.rows)
        return board[row][column];
}

function removeChildren(elementID) {
    const element = document.getElementById(elementID);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

function getGameParameters() {
    const formLevels = document.getElementById("parameters").level;
    if (formLevels[0].checked) {
        level = beginner;
    }
    if (formLevels[1].checked) {
        level = intermediate;
    }
    if (formLevels[2].checked) {
        level = expert;
    }
    gameParameters.level = level;

    const player = document.getElementById("player");
    gameParameters.player = {
        ID: Number.parseInt(player.value),
        name: player.options[player.selectedIndex].text
    };
    console.log(gameParameters);
    return level;
}

function newGame() {

    if (intervalID) {
        resetTimer();
    }

    removeChildren("grid");

    const { rows, columns, mines, className } = getGameParameters();

    board = new Array(rows);
    picture = new Array(rows);
    tile = new Array(rows);
    for (let i = 0; i < board.length; i++) {
        board[i] = new Array(columns);
        picture[i] = new Array(columns);
        tile[i] = new Array(columns)
    }


    remaining = mines;
    revealed = 0;
    statusLabel.innerHTML = 'Click on the tiles to reveal them';

    const grid = document.getElementById('grid');
    grid.className = className;

    // build grid
    for (let row = 0; row < rows; row++)
        for (let column = 0; column < columns; column++) {
            const index = row * columns + column;
            const el = document.createElement('img');
            el.src = '/i/images/hidden.png';
            el.addEventListener('mousedown', click);
            el.id = index;
            grid.appendChild(el);

            tile[row][column] = el;
            picture[row][column] = 'hidden';
            board[row][column] = '';
        }

    // place mines
    let placed = 0;
    while (placed < mines) {
        const col = Math.floor(Math.random() * columns);
        const r = Math.floor(Math.random() * rows);

        if (board[r][col] !== 'mine') {
            board[r][col] = 'mine';
            placed++;
        }
    }

    for (let column = 0; column < columns; column++)
        for (let row = 0; row < rows; row++) {
            if (check(row, column) !== 'mine') {
                board[row][column] =
                    ((check(row + 1, column) === 'mine') | 0) +
                    ((check(row + 1, column - 1) === 'mine') | 0) +
                    ((check(row + 1, column + 1) === 'mine') | 0) +
                    ((check(row - 1, column) === 'mine') | 0) +
                    ((check(row - 1, column - 1) === 'mine') | 0) +
                    ((check(row - 1, column + 1) === 'mine') | 0) +
                    ((check(row, column - 1) === 'mine') | 0) +
                    ((check(row, column + 1) === 'mine') | 0);
            }
        }
}

function updateTimer() {
    const time = document.getElementById('timer');
    time.innerHTML = ++seconds;
}

function resetTimer() {
    clearInterval(intervalID);
    intervalID = null;
    seconds = 0;
    updateTimer();
}

function click(event) {
    if (!intervalID) {
        intervalID = setInterval(updateTimer, 1000);
    }
    const source = event.target;
    const id = source.id;
    const row = Math.floor(id / gameParameters.level.columns);
    const column = id % gameParameters.level.columns;

    if (event.which === 3) {
        switch (picture[row][column]) {
            case 'hidden':
                tile[row][column].src = '/i/images/flag.png';
                remaining--;
                picture[row][column] = 'flag';
                break;
            case 'flag':
                tile[row][column].src = '/i/images/question.png';
                remaining++;
                picture[row][column] = 'question';
                break;
            case 'question':
                tile[row][column].src = '/i/images/hidden.png';
                picture[row][column] = 'hidden';
                break;
        }
        event.preventDefault();
    }
    statusLabel.innerHTML = `Mines remaining: ${remaining}`;

    if (event.which === 1 && picture[row][column] !== 'flag') {
        if (board[row][column] === 'mine') {
            for (let row = 0; row < gameParameters.level.rows; row++)
                for (let column = 0; column < gameParameters.level.columns; column++) {
                    if (board[row][column] === 'mine') {
                        tile[row][column].src = '/i/images/mine.png';
                    }
                    if (board[row][column] !== 'mine' && picture[row][column] === 'flag') {
                        tile[row][column].src = '/i/images/misplaced.png';
                    }
                }
            clearInterval(intervalID);
            statusLabel.innerHTML = 'GAME OVER<br><br>Click here to restart';
        } else {
            if (picture[row][column] === 'hidden') reveal(row, column);
        }
    }

    if (revealed === gameParameters.level.rows * gameParameters.level.columns - gameParameters.level.mines) {
        statusLabel.innerHTML = 'YOU WIN!<br><br>Click here to restart';
        clearInterval(intervalID);
        sendResults(seconds, gameParameters.player);
    }
}

function sendResults(timeScore, player) {


    fetch(`/api/game-result?timeCompleted=${timeScore}&name=${player.name}&playerID=${player.ID}`)

        // fetch('/api/game-results', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ timeScore, id })
        // })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateScores();
        })
        .catch(error => console.error('Error:', error));

}

function reveal(row, column) {
    tile[row][column].src = `/i/images/${board[row][column]}.png`;
    if (board[row][column] !== 'mine' && picture[row][column] === 'hidden') {
        revealed++;
    }
    picture[row][column] = board[row][column];

    if (board[row][column] === 0) {
        if (column > 0 && picture[row][column - 1] === 'hidden') reveal(row, column - 1);
        if (column < (gameParameters.level.columns - 1) && picture[row][+column + 1] === 'hidden') reveal(row, +column + 1);
        if (row < (gameParameters.level.rows - 1) && picture[+row + 1][column] === 'hidden') reveal(+row + 1, column);
        if (row > 0 && picture[row - 1][column] === 'hidden') reveal(row - 1, column);
        if (column > 0 && row > 0 && picture[row - 1][column - 1] === 'hidden') reveal(row - 1, column - 1);
        if (column > 0 && row < (gameParameters.level.rows - 1) && picture[+row + 1][column - 1] === 'hidden') reveal(+row + 1, column - 1);
        if (column < (gameParameters.level.columns - 1) && row < (gameParameters.level.rows - 1) && picture[+row + 1][+column + 1] === 'hidden') reveal(+row + 1, +column + 1);
        if (column < (gameParameters.level.columns - 1) && row > 0 && picture[row - 1][+column + 1] === 'hidden') reveal(row - 1, +column + 1);
    }
}


newGame();

updateScores();

function updateScores() {
    console.log("updateScores()");
    fetch("/api/scores")
        .then(response => response.json())
        .then(data => {
            removeChildren("scoreList");
            const scoreList = document.getElementById('scoreList');
            for (const score of data) {
                const scoreItem = document.createElement('li');
                scoreItem.textContent = `${score.user}: ${score.timeCompleted}`;
                scoreList.appendChild(scoreItem);
            };
        })
        .catch(error => console.error('Error:', error));
}