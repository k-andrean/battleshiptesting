const createGame = require('./game.js');
const drawBoard = require('./boardDisplay.js');
const { receiveAttack } = require('./board.js');

const playButton = document.querySelector('.start');
const createButton = document.querySelector('.create-board');
const player1container = document.querySelector('.player1-container');
const player2container = document.querySelector('.player2-container');
const boardSize = 10;

let game;

createButton.addEventListener('click', () => {
  const player1Name = getPlayerName('Enter player 1 Name');
  const player2Name = getPlayerName('Enter player 2 Name');

  game = createGame(player1Name, player2Name);

  console.log(game);

  drawBoard(player1container, boardSize, 'player1', game); // Draw board for player 1
  drawBoard(player2container, boardSize, 'player2', game); // Draw board for player 2
});

playButton.addEventListener('click', () => {
  initializeGame();
});

function waitForPlayerInput(currentPlayer) {
  return new Promise((resolve) => {
    const currentPlayerBoard = currentPlayer === game.getPlayerOne() ? game.getPlayerOneBoard() : game.getPlayerTwoBoard();

    const checkForAttack = async () => {
      const playerAttack = currentPlayerBoard.getPlayerAttack();
      console.log(playerAttack);

      if (!playerAttack || Object.keys(playerAttack).length === 0) {
        console.log(`Player ${currentPlayer.getName()}, please click on a grid/tile/coordinate.`);
        await new Promise((innerResolve) => setTimeout(innerResolve, 6000));
        await checkForAttack(); // Check again after the timeout
      } else {
        const coordinate = playerAttack.attack; // Get the coordinate value
        console.log(coordinate);
        resolve(coordinate);
      }
    };

    checkForAttack();
  });
}

async function initializeGame() {
  const player1 = game.getPlayerOne();
  const player2 = game.getPlayerTwo();
  const player1Board = game.getPlayerOneBoard();
  console.log(player1Board.getShipLocation());
  const player2Board = game.getPlayerTwoBoard();

  let winner = null;
  let currentPlayer = player1;

  const getCurrentPlayerBoard = () => (currentPlayer === player1 ? player1Board : player2Board);

  const playTurn = async () => {
    const currentPlayerBoard = getCurrentPlayerBoard();
    const playerAttackCoordinate = await waitForPlayerInput(currentPlayer);
    console.log(playerAttackCoordinate);

    // Player made a selection, proceed with the game
    console.log(`${currentPlayer.getName()} attacks: ${playerAttackCoordinate}`);

    const opponentBoard = currentPlayer === player1 ? player2Board : player1Board;
    receiveAttack(playerAttackCoordinate, opponentBoard);

    // Check for a winner or switch turns
    if (opponentBoard.allShipsSunk()) {
      winner = currentPlayer === player1 ? player2 : player1;
      logWinner(winner);
    } else {
      currentPlayerBoard.resetPlayerAttack();
      console.log(currentPlayerBoard.getPlayerAttack());
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      playTurn(); // Continue to the next turn
    }
  };

  playTurn(); // Start the first turn
}
function getPlayerName(promptMessage) {
  let playerName = prompt(promptMessage);

  // Validate the player name
  while (!isValidName(playerName)) {
    alert('Invalid name. Please enter a valid string.');
    playerName = prompt(promptMessage);
  }

  return playerName;
}

function isValidName(name) {
  // Add your custom validation logic here
  // For example, ensuring the name is a non-empty string and does not contain symbols or numbers
  return typeof name === 'string' && name.trim() !== '' && /^[a-zA-Z\s]+$/.test(name);
}

const logWinner = (winner) => {
  const winnerText = document.querySelector('.winner-text');
  const totalText = document.querySelector('.total-text');
  const winCount = gameSetup.getWinCount();

  winnerText.textContent = `Winner: ${winner.getName()}`;
  totalText.textContent = `Total Wins - Player1: ${winCount.player1}, Player2: ${winCount.player2}`;

  gameSetup.incrementWinCount(winner);
  gameSetup.resetBoard();
};
