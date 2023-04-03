/* Gameboard implemented using the Module Pattern */
const BoardController = (() => {
  const boardGrid = document.querySelector("#board-grid");
  let boardContent = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  function resetBoard() {
    boardContent = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
  }

  function currentBoard() {
    return boardContent;
  }

  function updateDisplay() {
    const boardFlat = boardContent.flat();
    boardGrid.innerHTML = "";
    boardFlat.forEach((field, index) => {
      const fieldNode = document.createElement("div");
      fieldNode.classList.add("board-field");
      fieldNode.setAttribute("field-number", index);
      fieldNode.addEventListener("click", () => {
        GameFlowController.makePlay(index);
      });
      fieldNode.innerHTML = field;
      boardGrid.appendChild(fieldNode);
    });
  }

  function updateField(colIndex, rowIndex, marker) {
    if (!boardContent[colIndex][rowIndex]) {
      boardContent[colIndex][rowIndex] = marker;
      updateDisplay();
      return true;
    }
    return false;
  }

  return { currentBoard, updateField, updateDisplay, resetBoard };
})();

/* Factory Functions for players */
const Player = (name, marker) => {
  let cpu = false;
  let active = false;

  function isActive() {
    return active;
  }

  function isComputer() {
    return cpu;
  }

  function toggleActive() {
    active = !active;
    if (active) console.log(`It is now ${name}'s turn.`);
  }

  function toggleAI() {
    cpu = !cpu;
    if (cpu) console.log(`${name} is now controlled by the CPU.`);
  }

  return { name, marker, isComputer, isActive, toggleAI, toggleActive };
};

const GameFlowController = (() => {
  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");
  // This way of checking for a winner is fine because we perform the check after every game action.
  // Without calling it after every action, we'd need to also return the marker of the winner.
  function checkWinner() {
    const boardFlat = [...BoardController.currentBoard()].flat();
    if (
      // rows
      (boardFlat[0] &&
        [...boardFlat].slice(0, 3).every((x) => x === boardFlat[0])) ||
      (boardFlat[3] &&
        [...boardFlat].slice(3, 3).every((x) => x === boardFlat[3])) ||
      (boardFlat[6] &&
        [...boardFlat].slice(6, 3).every((x) => x === boardFlat[6])) ||
      // diagonally
      (boardFlat[0] &&
        boardFlat
          .filter((x, index) => [0, 4, 8].includes(index))
          .every((x) => x === boardFlat[0])) ||
      (boardFlat[2] &&
        boardFlat
          .filter((x, index) => [2, 4, 6].includes(index))
          .every((x) => x === boardFlat[2])) ||
      // columns
      (boardFlat[0] &&
        boardFlat
          .filter((x, index) => [0, 3, 6].includes(index))
          .every((x) => x === boardFlat[0])) ||
      (boardFlat[1] &&
        boardFlat
          .filter((x, index) => [1, 4, 7].includes(index))
          .every((x) => x === boardFlat[1])) ||
      (boardFlat[2] &&
        boardFlat
          .filter((x, index) => [2, 5, 8].includes(index))
          .every((x) => x === boardFlat[2]))
    )
      return true;
    return false;
  }

  function checkTie() {
    const boardFlat = [...BoardController.currentBoard()].flat();
    return boardFlat.filter((x) => x === "").length === 0;
  }

  function checkGameOver() {
    if (checkWinner()) {
      const winner = player1.isActive() ? player1 : player2;
      console.log("Joewarida! Biden Burasto!!!");
      return `Game over. ${winner.name} has won the game.`;
    }
    if (checkTie()) {
      return `Game over. Tie.`;
    }
    return false;
  }

  function toggleTurn() {
    player1.toggleActive();
    player2.toggleActive();
  }

  function makePlay(index) {
    // get field coordinates
    const x = index < 6 ? (index < 3 ? 0 : 1) : 2;
    const y = index % 3;
    if (player1.isActive()) {
      if (BoardController.updateField(x, y, player1.marker)) {
        BoardController.updateDisplay();
        if (!checkGameOver()) toggleTurn();
      }
    }
    if (player2.isActive()) {
      const legalFields = [...document.querySelectorAll(".board-field")].filter(
        (field) => field.textContent === ""
      );
      const randomChoice = Math.floor(Math.random() * (legalFields.length - 1));
      const choiceIndex =
        legalFields[randomChoice].attributes["field-number"].value;
      const X = choiceIndex < 6 ? (choiceIndex < 3 ? 0 : 1) : 2;
      const Y = choiceIndex % 3;
      BoardController.updateField(X, Y, player2.marker);
      BoardController.updateDisplay();
      checkGameOver();
      toggleTurn();
    }
  }

  function initGame() {
    player1.toggleActive();
    BoardController.resetBoard();
    BoardController.updateDisplay();
  }

  return { initGame, makePlay, checkWinner, player1, player2 };
})();

GameFlowController.initGame();
