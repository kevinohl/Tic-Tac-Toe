/* Gameboard implemented using the Module Pattern */
const GameController = (() => {
  const boardGrid = document.querySelector("#board-grid");
  //   const boardContent = [
  //     ["", "", ""],
  //     ["", "", ""],
  //     ["", "", ""],
  //   ];
  const boardContent = [
    ["X", "O", "X"],
    ["", "X", ""],
    ["", "", "O"],
  ];

  function updateField(colIndex, rowIndex, marker) {
    boardContent[colIndex][rowIndex] = marker;
  }

  // This way of checking for a winner is fine because we perform the check after every game action.
  // Without calling it after every action, we'd need to also return the marker of the winner.
  function checkWinner() {
    const boardFlat = boardContent.flat();
    return (
        // rows
        (boardFlat[0] && [...boardFlat].slice(0,3).every(x => x === boardFlat[0])) ||
        (boardFlat[3] && [...boardFlat].slice(3,3).every(x => x === boardFlat[3])) ||
        (boardFlat[6] && [...boardFlat].slice(6,3).every(x => x === boardFlat[6])) ||
        // diagonally
        (boardFlat.filter((x, index) => [0, 4, 8].includes(index)).every(x => x === boardFlat[0])) ||
        (boardFlat.filter((x, index) => [2, 4, 6].includes(index)).every(x => x === boardFlat[2])) ||
        // columns
        (boardFlat.filter((x, index) => [0, 3, 6].includes(index)).every(x => x === boardFlat[0])) ||
        (boardFlat.filter((x, index) => [1, 4, 7].includes(index)).every(x => x === boardFlat[1])) ||
        (boardFlat.filter((x, index) => [2, 5, 8].includes(index)).every(x => x === boardFlat[2]))
        );
  }

  function updateDisplay() {
    const boardFlat = boardContent.flat();
    boardGrid.innerHTML = "";
    boardFlat.forEach((field) => {
      const fieldNode = document.createElement("div");
      fieldNode.classList.add("board-field");
      fieldNode.innerHTML = field;
      boardGrid.appendChild(fieldNode);
    });
    // toggle turnTurn in both player objects
    //
  }

  return { boardContent, updateField, updateDisplay, checkWinner };
})();


/* Factory Functions for players */
const Player = (name, marker) => {
  this.cpu = false;
  this.turnPlayer = true;

  function toggleTurn() {
    this.turnPlayer = !this.turnPlayer;
    if (this.turnPlayer) console.log(`It is now ${this.name}'s turn.`)
  }
  function toggleAI() {
    this.cpu = !this.cpu;
    if (this.cpu) console.log(`${this.name} is now controlled by the CPU.`)
  }

  function makePlay(field) {
    // if it is the current player's turn
    //
    // GameController.updateField(<coordinates of field>)
    // GameController.updateDisplay()
  }
  return { name, marker, toggleAI, toggleTurn };
};

const player1 = Player("Burak", "X");
const player2 = Player("Burakine", "O");
player2.toggleAI();
