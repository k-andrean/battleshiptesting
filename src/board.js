const createShip = require('./ship.js');
const { shipLengths } = require('./helper.js');

function createBoard() {
  const board = {};
  const gridSize = 10;
  // Iterate over rows (A-J)
  for (let row = 'A'.charCodeAt(0); row <= 'J'.charCodeAt(0); row++) {
    const rowKey = String.fromCharCode(row);
    board[rowKey] = {};

    // Iterate over columns (1-10)
    for (let col = 1; col <= gridSize; col++) {
      const colKey = col.toString();
      board[rowKey][colKey] = {};
    }
  }

  return board;
}

function createGameBoard() {
  const board = createBoard();

  let shipLocation = {};
  let playerAttack = {};

  const ships = {
    carrier: createShip('carrier', shipLengths.carrier),
    cruiser: createShip('cruiser', shipLengths.cruiser),
    destroyer: createShip('destroyer', shipLengths.destroyer),
    submarine: createShip('submarine', shipLengths.submarine),
    battleship: createShip('battleship', shipLengths.battleship),
  };

  let missedAttacks = [];
  let successfulAttacks = [];

  function allShipsSunk() {
    return Object.values(ships).every((ship) => ship.isSunk());
  }

  return {
    getBoard: () => board,
    getShipLocation: () => shipLocation,
    getShips: () => ships,
    getMissedAttacks: () => missedAttacks,
    getSuccessfulAttacks: () => successfulAttacks,
    allShipsSunk,
    reset: () => {
      // Clear ship coordinates on the board
      for (const shipName in ships) {
        const shipCoordinates = shipLocation[shipName];
        if (shipCoordinates) {
          clearShipCoordinates(board, shipCoordinates);
        }
      }

      shipLocation = {};
      missedAttacks = [];
      successfulAttacks = [];
      playerAttack = {};
    },
    setPlayerAttack: (attack, coordinate) => {
      playerAttack[attack] = coordinate;
    },
    getPlayerAttack: () => playerAttack,
    resetPlayerAttack: () => {
      playerAttack = {};
    },
  };
}

function clearShipCoordinates(board, shipCoordinates) {
  for (const [row, col] of shipCoordinates) {
    board[row][col] = {}; // Clear the ship code in the board
  }
}

module.exports = createGameBoard;
