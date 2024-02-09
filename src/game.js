const createPlayer = require('./player.js');
const { createGameBoard, receiveAttack, placeShip } = require('./board.js');

const createGame = (playerName1, playerName2) => {
  const player1 = createPlayer(playerName1);
  const player2 = createPlayer(playerName2);

  const player1Board = createGameBoard();
  const player2Board = createGameBoard();

  const boardObject = {
    player1: player1Board,
    player2: player2Board,
  };

  for (const playerKey in boardObject) {
    populateGameBoard(boardObject[playerKey]);
  }

  const winCount = { player1: 0, player2: 0 };

  return {
    getPlayerOne: () => player1,
    getPlayerTwo: () => player2,
    getPlayerOneBoard: () => player1Board,
    getPlayerTwoBoard: () => player2Board,
    resetBoard: () => {
      for (const playerKey in boardObject) {
        boardObject[playerKey].reset();
      }
    },
    incrementWinCount: (winner) => {
      if (winner === player1) {
        winCount.player1++;
      } else if (winner === player2) {
        winCount.player2++;
      }
    },
    getWinCount: () => winCount,
  };
};

function populateGameBoard(gameBoard) {
  const ships = gameBoard.getShips();

  let startRow = 'A'.charCodeAt(0);

  for (const shipName in ships) {
    const shipLength = ships[shipName].length;
    const shipCoordinates = generateRandomCoordinate(shipLength, startRow);
    placeShip(gameBoard, shipName, shipLength, shipCoordinates);
    startRow++;
  }
}

function generateRandomCoordinate(length, startRow) {
  const shipCoordinates = [];

  for (let i = 0; i < length; i++) {
    const colKey = (i + 1).toString();
    const rowKey = String.fromCharCode(startRow);
    shipCoordinates.push([rowKey, colKey]);
  }
  return shipCoordinates;
}

module.exports = createGame;
