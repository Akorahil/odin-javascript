const cells = document.querySelectorAll("[data-cell]");
const resetButton = document.getElementById("reset-button");
const gameMessage = document.getElementById("gameMessage");

const P1Control = document.getElementById("P1Control");
const P2Control = document.getElementById("P2Control");

const gameBoard = (() => {
  /* game board logic */
  let gameState = ["", "", "", "", "", "", "", "", ""];
  let validMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const winningState = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [6, 4, 2],
    [8, 4, 0],
    [1, 4, 7],
    [0, 3, 6],
    [2, 5, 8],
  ];

  const checkWinningState = (currentState, currentValidMoves) => {
    for (let i = 0; i < winningState.length; i++) {
      const checkState = winningState[i];
      if (
        currentState[checkState[0]] === currentState[checkState[1]] &&
        currentState[checkState[0]] === currentState[checkState[2]] &&
        currentState[checkState[0]] !== ""
      ) {
        return 1;
      }
    }
    if (currentValidMoves.length === 0) {
      return 0;
    }
    return -1;
  };

  const resetBoard = () => {
    gameState = ["", "", "", "", "", "", "", "", ""];
    validMoves = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    cells.forEach((cell) => {
      cell.innerText = "";
    });
  };

  const getValidMoves = () => validMoves;

  const getCurrentState = () => gameState;

  const updateGameState = (cell, index, currentSign) => {
    gameState[index] = currentSign;
    cell.innerText = currentSign;
    validMoves = validMoves.filter((e) => e !== index);
    return gameState;
  };

  return {
    updateGameState,
    checkWinningState,
    resetBoard,
    getValidMoves,
    getCurrentState,
  };
})();

// Player Factory function
const player = (sign, controller) => {
  const minmax = (validMoves, gameState, currentSign) => {
    const moves = [];
    // alert(validMoves.length);

    for (let i = 0; i < validMoves.length; i++) {
      const move = validMoves[i];
      const possibleGameState = gameState.slice();
      possibleGameState[move] = currentSign;
      const currentValidMoves = validMoves.filter((e) => e !== move);

      // Check for branch end state
      const endState = gameBoard.checkWinningState(
        possibleGameState,
        currentValidMoves
      );

      // Will return the move index
      if (endState === 1 && currentSign === this.sign) {
        return { index: move, score: 10 };
      }
      if (endState === 1) {
        return { index: move, score: -10 };
      }
      if (endState === 0) {
        return { index: move, score: 0 };
      }
      let playSign = currentSign;
      if (currentSign === "X") {
        playSign = "O";
      } else if (currentSign === "O") {
        playSign = "X";
      }
      moves.push(minmax(currentValidMoves, possibleGameState, playSign));
    }

    // evaluate best move
    let bestMove;
    if (currentSign === this.sign) {
      // maximize
      let bestScore = -1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      // minimize
      let bestScore = 1000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  };

  return { sign, controller, minmax };
};

/* Game control module */

const gameController = (() => {
  /* module should be placed here */
  const playerOne = player("X", "HUMAN");
  const playerTwo = player("O", "HUMAN");
  let currentPlayer = true; // playerOne = true, playerTwo= false
  let active = true;

  // Handle a player input, or AI cell choice
  const handleClick = (cell, index) => {
    let currentState = [];
    let score;
    if (active) {
      const currentSign = currentPlayer ? playerOne.sign : playerTwo.sign;
      const validMoves = gameBoard.getValidMoves();

      const valid = validMoves.includes(index);
      if (valid) {
        currentState = gameBoard.updateGameState(cell, index, currentSign);
        currentPlayer = !currentPlayer;
        gameMessage.innerText = currentPlayer
          ? "Player 1 turn."
          : "Player 2 turn.";

        score = gameBoard.checkWinningState(
          currentState,
          gameBoard.getValidMoves()
        );
      }
      if (score === 1) {
        const winner = currentPlayer ? "Player Two" : "Player One";
        gameMessage.innerText = `${winner} Wins!`;
        active = false;
      } else if (score === 0) {
        gameMessage.innerText = "It's a draw.";
        active = false;
      }
    }
  };

  const AITurnController = () => {
    const moves = gameBoard.getValidMoves();

    const currentState = gameBoard.getCurrentState();
    const playerMove = currentPlayer
      ? playerOne.minmax(moves, currentState, playerOne.sign)
      : playerTwo.minmax(moves, currentState, playerTwo.sign);
    const square = cells[playerMove.index];
    handleClick(square, playerMove.index);
  };

  /* Add a listener to each cell */
  cells.forEach((cell, index) => {
    cell.addEventListener("click", (event) => {
      const square = event.target;
      if (
        (playerOne.controller !== "AI" && currentPlayer) ||
        (playerTwo.controller !== "AI" && !currentPlayer)
      ) {
        handleClick(square, index);
        if (
          (playerOne.controller === "AI" && currentPlayer) ||
          (playerTwo.controller === "AI" && !currentPlayer)
        ) {
          AITurnController();
        }
      }
    });
  });

  // Create a loop for 2 AI players
  const AIgameLoop = () => {
    setTimeout(() => {
      AITurnController();
      if (active) {
        AIgameLoop();
      }
    }, 1000);
  };

  const startGame = () => {
    if (playerOne.controller === "AI" && playerTwo.controller === "AI") {
      AIgameLoop();
    } else if (playerOne.controller === "AI") {
      AITurnController();
    }
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    currentPlayer = true;
    active = true;
    gameMessage.innerText = "Player 1 turn.";
    startGame();
  };

  P1Control.addEventListener("click", () => {
    const P1Text = P1Control.innerText;
    if (P1Text === "HUMAN") {
      playerOne.controller = "AI";
      P1Control.innerText = "AI";
    } else {
      playerOne.controller = "HUMAN";
      P1Control.innerText = "HUMAN";
    }
    resetGame();
  });

  P2Control.addEventListener("click", () => {
    const P2Text = P2Control.innerText;
    if (P2Text === "HUMAN") {
      playerTwo.controller = "AI";
      P2Control.innerText = "AI";
    } else {
      playerTwo.controller = "HUMAN";
      P2Control.innerText = "HUMAN";
    }
    resetGame();
  });

  resetButton.addEventListener("click", () => {
    resetGame();
  });

  startGame();
})();
