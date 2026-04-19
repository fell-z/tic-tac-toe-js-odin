function GameBoard() {
  const board = [];

  for (let i = 0; i < 3; ++i) {
    board[i] = [];

    for (let j = 0; j < 3; ++j) board[i].push(null);
  }

  const getBoard = () => board;

  let remainingMarkers = 9;

  const getRemainingMarkers = () => remainingMarkers;

  const isEmptyAt = (row, column) => {
    return board[row][column] === null;
  };

  const getMarker = (row, column) => {
    return board[row][column] ?? " ";
  };

  const putMarker = (row, column, marker) => {
    board[row][column] = marker;
    remainingMarkers--;
  };

  const render = () => {
    const border = "+---+---+---+";

    console.log(border);
    for (let i = 0; i < 3; ++i) {
      if (i === 1) console.log(border);

      console.log(`| ${getMarker(i, 0)} | ${getMarker(i, 1)} | ${getMarker(i, 2)} |`);

      if (i === 1) console.log(border);
    }
    console.log(border);
  };

  return {
    getBoard,
    getRemainingMarkers,
    isEmptyAt,
    getMarker,
    putMarker,
    render,
  };
}

function GameController(playerOneName = "Player One", playerTwoName = "Player Two") {
  const board = GameBoard();

  const players = [
    {
      name: playerOneName,
      marker: "X",
    },
    {
      name: playerTwoName,
      marker: "O",
    },
  ];
  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;
  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const isOutOfBounds = (row, column) => row < 0 || row > 2 || column < 0 || column > 2;

  let winningLine = null;
  const getWinningLine = () => winningLine;

  const findWinningLine = (row, column) => {
    const directions = {
      horizontal: [
        [0, -1],
        [0, 1],
      ],
      vertical: [
        [-1, 0],
        [1, 0],
      ],
      // A => has a marker at left upper corner
      // B => has a marker at right upper corner
      diagonalA: [
        [-1, -1],
        [1, 1],
      ],
      diagonalB: [
        [-1, 1],
        [1, -1],
      ],
    };

    for (const [dirName, dirVectors] of Object.entries(directions)) {
      let count = 1;

      for (const vector of dirVectors) {
        let currRow = row + vector[0];
        let currColumn = column + vector[1];

        while (!isOutOfBounds(currRow, currColumn)) {
          if (board.getMarker(currRow, currColumn) === getActivePlayer().marker) {
            count++;
            if (count === 3) {
              return { direction: dirName, row, column };
            }

            currRow += vector[0];
            currColumn += vector[1];
          } else {
            break;
          }
        }
      }
    }

    return null;
  };

  let gameOver = false;
  const isGameOver = () => gameOver;

  const isATie = () => board.getRemainingMarkers() === 0 && winningLine === null;

  const startPlayerTurn = (row, column) => {
    if (isGameOver()) {
      console.log("The game is already over.");
      return;
    }

    if (!isOutOfBounds(row, column) && board.isEmptyAt(row, column)) {
      board.putMarker(row, column, getActivePlayer().marker);
    } else {
      console.log("Invalid position to put marker!");
      return;
    }

    winningLine = findWinningLine(row, column);

    if (winningLine !== null) {
      gameOver = true;
      console.log(`Congratulations, ${getActivePlayer().name}! You won!`);
    } else if (isATie()) {
      gameOver = true;
      console.log("Tie!");
    } else {
      switchActivePlayer();
      console.log(`Your turn, ${getActivePlayer().name}.`);
    }

    board.render();
  };

  return {
    getBoard: board.getBoard,
    getActivePlayer,
    getWinningLine,
    isGameOver,
    isATie,
    startPlayerTurn,
  };
}
