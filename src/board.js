const createShip = require('./ship.js');

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
    carrier: createShip('carrier'),
    cruiser: createShip('cruiser'),
    destroyer: createShip('destroyer'),
    submarine: createShip('submarine'),
    battleship: createShip('battleship'),
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

function placeShip(gameBoard, shipName, shipLength, shipCoordinates) {
  if (shipCoordinates.length !== shipLength) {
    console.log(`Invalid ship coordinates for ${shipName}. Please provide ${shipLength} coordinates.`);
    return;
  }

  const board = gameBoard.getBoard();
  const shipLocation = gameBoard.getShipLocation();
  updateBoardCoordinate(board, shipLocation, shipName, shipCoordinates);
}

function updateBoardCoordinate(board, shipLocation, shipName, shipCoordinates) {
  for (const [row, col] of shipCoordinates) {
    board[row][col] = shipName.charAt(0).toLowerCase(); // Using the first letter of the ship name as a code
  }

  shipLocation[shipName] = shipCoordinates;
}

function clearShipCoordinates(board, shipCoordinates) {
  for (const [row, col] of shipCoordinates) {
    board[row][col] = {}; // Clear the ship code in the board
  }
}

function receiveAttack(coordinate, gameBoard) {
  const [attackRow, attackCol] = coordinate;
  // Check if the attack has already been successfully made at these coordinates
  const successfulAttacks = gameBoard.getSuccessfulAttacks();
  console.log(successfulAttacks);
  if (successfulAttacks.some(([row, col]) => row === attackRow && col === attackCol)) {
    console.log('This target has already been successfully attacked.');
    return;
  }
  const shipAttackedName = checkShipAttackLocation(coordinate, gameBoard);
  console.log(shipAttackedName);

  if (shipAttackedName) {
    const ships = gameBoard.getShips();
    const shipAttacked = ships[shipAttackedName];

    if (!shipAttacked.isSunk()) {
      shipAttacked.isHit();

      // Add the coordinates to the successful attacks array
      successfulAttacks.push([attackRow, attackCol]);

      if (shipAttacked.isSunk()) {
        console.log(`${shipAttackedName} is sunk!`);
        // Handle any actions when a ship is sunk
      } else {
        console.log(`${shipAttackedName} is hit!`);
        // Handle any actions when a ship is hit but not sunk
      }
    }
  } else {
    console.log('Missed the target!');
    const missedAttacks = gameBoard.getMissedAttacks();
    missedAttacks.push(coordinate);
    // Handle any actions when the attack misses all ships
  }
}

function checkShipAttackLocation(coordinate, gameBoard) {
  const [attackRow, attackCol] = coordinate;

  const shipLocation = gameBoard.getShipLocation();

  for (const shipName in shipLocation) {
    const shipCoordinates = shipLocation[shipName];

    for (const [row, col] of shipCoordinates) {
      console.log(row, col, attackRow, attackCol);
      if (row === attackRow && col === attackCol) {
        return shipName;
      }
    }
  }

  return null;
}

module.exports = {
  createGameBoard,
  placeShip,
  receiveAttack,
};
