
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
        ID: -1
    }
};

let board;
let picture;
let tile;
let remaining;
let revealed;
let intervalID = null;
let seconds = -1;
let gameOver = false;

const statusLabel = document.getElementById('status');
statusLabel.addEventListener('click', newGame);
statusLabel.innerHTML = 'Select or create your player and level to start a new game';




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
    const val = player.value;
    const selectedIdx = player.selectedIndex;

    let playerName = player.options[selectedIdx].text;
    if (val === "-1") {
        playerName = document.getElementById("new-player").value;
    }
    gameParameters.player = {
        name: playerName,
        ID: val
    };
    return level;
}

function newGame() {

    // resets
    gameOver = false;

    if (intervalID) {
        resetTimer();
    }

    removeChildren("grid");

    setGameFace("waiting");

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
    const topTimeDisplay = document.querySelector('#topTimeDisplay span');
    topTimeDisplay.innerHTML = seconds;
}

function resetTimer() {
    clearInterval(intervalID);
    intervalID = null;
    seconds = -1;
    updateTimer();
}

function click(event) {
    if (gameOver) {
        return;
    }
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
    const topMineCount = document.querySelector('#topMineCount span');
    topMineCount.innerHTML = remaining;

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
            setGameFace("lose");
            statusLabel.innerHTML = 'GAME OVER<br><br>Click here to restart';
        } else {
            if (picture[row][column] === 'hidden') reveal(row, column);
        }
    }

    if (revealed === gameParameters.level.rows * gameParameters.level.columns - gameParameters.level.mines) {
        setGameFace("win")
        statusLabel.innerHTML = 'YOU WIN!<br><br>Click here to restart';
        clearInterval(intervalID);
        sendResults(seconds, gameParameters.player);
        gameOver = true;
    }
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



function sendResults(timeScore, player) {
    // check that a player has been selected, otherwise don't send results
    if (player.ID) {
        fetch('/api/scores/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ timeCompleted: timeScore, playerID: Number.parseInt(player.ID) })
        })
            .then(response => response.json())
            .then(data => {
                updateScores();
            })
            .catch(error => console.error('Error:', error));

    }
}

function updateScores() {
    fetch('/fragments/top-scores')
        .then(response => response.text())
        .then((data) => {
            document.getElementById('scores-table-holder').innerHTML = data;
        })
        .catch(error => console.error('Error:', error));
}


function setGameFace(expression) {

    let className = "";


    switch (expression) {
        case "lose":
            className = "fas fa-dizzy";
            break;
        case "win":
            className = "fas fa-grin-beam";
            break;
        default:
            className = "fas fa-smile";
    }
    document.getElementById("face").setAttribute('class', className);
}