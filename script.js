(function () {
  function GameBoard() {
    const board = [];

    const populate = () => {
      for (let i = 0; i < 3; ++i) {
        board[i] = [];

        for (let j = 0; j < 3; ++j) board[i].push(null);
      }
    };
    populate();

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

    const reset = () => {
      populate();
      remainingMarkers = 9;
    };

    return {
      getBoard,
      getRemainingMarkers,
      isEmptyAt,
      getMarker,
      putMarker,
      reset,
    };
  }

  function GameController(playerOneName, playerTwoName) {
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

    const isAWinningLine = (row, column) => {
      const directions = {
        horizontal: [
          [0, -1],
          [0, 1],
        ],
        vertical: [
          [-1, 0],
          [1, 0],
        ],
        diagonalA: [
          [-1, -1],
          [1, 1],
        ],
        diagonalB: [
          [-1, 1],
          [1, -1],
        ],
      };

      for (const directionVectors of Object.values(directions)) {
        let count = 1;

        for (const vector of directionVectors) {
          let currRow = row + vector[0];
          let currColumn = column + vector[1];

          while (!isOutOfBounds(currRow, currColumn)) {
            if (board.getMarker(currRow, currColumn) === getActivePlayer().marker) {
              count++;
              if (count === 3) {
                return true;
              }

              currRow += vector[0];
              currColumn += vector[1];
            } else {
              break;
            }
          }
        }
      }

      return false;
    };

    let gameOver = false;
    const isGameOver = () => gameOver;

    let gameTied = false;
    const isATie = () => gameTied;

    const startPlayerTurn = (row, column) => {
      if (!isOutOfBounds(row, column) && board.isEmptyAt(row, column)) {
        board.putMarker(row, column, getActivePlayer().marker);
      } else {
        return;
      }

      const playerWon = isAWinningLine(row, column);
      gameTied = board.getRemainingMarkers() === 0 && !playerWon;

      if (playerWon || isATie()) {
        gameOver = true;
      } else {
        switchActivePlayer();
      }
    };

    const reset = (playerOneName, playerTwoName) => {
      board.reset();
      players[0].name = playerOneName;
      players[1].name = playerTwoName;
      activePlayer = players[0];
      gameOver = false;
    };

    return {
      getBoard: board.getBoard,
      getActivePlayer,
      isGameOver,
      isATie,
      startPlayerTurn,
      reset,
    };
  }

  function DisplayController() {
    const game = GameController();

    const boardElement = document.querySelector(".board");
    const outputElement = document.querySelector("output");

    const render = () => {
      boardElement.textContent = "";

      game.getBoard().forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
          const squareButton = document.createElement("button");

          const markerGraphic = document.createElement("img");
          markerGraphic.width = 100;
          
          if (column === "X") {
            markerGraphic.src += "assets/cross.svg";
          } else if (column === "O") {
            markerGraphic.src += "assets/circle.svg";
          }

          if (markerGraphic.src.length !== 0) {
            squareButton.appendChild(markerGraphic);
          }

          squareButton.type = "button";
          squareButton.dataset.row = rowIndex;
          squareButton.dataset.column = columnIndex;

          boardElement.appendChild(squareButton);
        });
      });
    };

    document.getElementById("new-game-btn").addEventListener("click", () => {
      boardElement.classList.remove("disabled");
      game.reset(
        document.querySelector('input[name="playerOneName"]').value,
        document.querySelector('input[name="playerTwoName"]').value,
      );
      render();
      outputElement.textContent = "";
    });

    boardElement.addEventListener("click", (e) => {
      if (game.isGameOver()) {
        return;
      }

      const row = e.target.dataset.row;
      const column = e.target.dataset.column;

      if (!row || !column) return;

      game.startPlayerTurn(parseInt(row), parseInt(column));
      render();

      if (game.isGameOver()) {
        const resultElement = document.createElement("p");

        if (game.isATie()) {
          resultElement.textContent = "Tie!";
        } else {
          resultElement.textContent = `Congratulations, ${game.getActivePlayer().name}, you won!`;
        }

        outputElement.appendChild(resultElement);

        boardElement.classList.add("disabled");
      }
    });

    render();
  }

  DisplayController();
})();
