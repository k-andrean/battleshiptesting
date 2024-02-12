const createGame = require('./game.js');
const drawBoard = require('./boardDisplay.js');
const {
  addShipButtonEventListener,
  showShipButtons,
  getPlayerName,
  boardSize,
  timeoutDuration,
  receiveAttack,
} = require('./helper.js');

const playButton = document.querySelector('.start');
const createButton = document.querySelector('.create-board');
const player1container = document.querySelector('.player1-container');
const player2container = document.querySelector('.player2-container');
const playerTurnText = document.querySelector('.player-turn');
const placeShipButton = document.querySelector('.place-ship');
const cruiserButtons = document.querySelectorAll('.cruiser');
const carrierButtons = document.querySelectorAll('.carrier');
const battleshipButtons = document.querySelectorAll('.battleship');
const submarineButtons = document.querySelectorAll('.submarine');
const destroyerButtons = document.querySelectorAll('.destroyer');

let game;

// Event listener for creating the game board
createButton.addEventListener('click', createGameBoard);

// Event listener for showing ship buttons
placeShipButton.addEventListener('click', showShipButtons);

// Event listeners for ship buttons
function createGameBoard() {
  const player1Name = getPlayerName('Enter player 1 Name');
  const player2Name = getPlayerName('Enter player 2 Name');

  game = createGame(player1Name, player2Name);

  console.log(game);

  drawBoard(player1container, boardSize, 'player1', game);
  drawBoard(player2container, boardSize, 'player2', game);

  // Set up ship button event listeners after the game has been created
  cruiserButtons.forEach((button) => addShipButtonEventListener(game, button));
  carrierButtons.forEach((button) => addShipButtonEventListener(game, button));
  battleshipButtons.forEach((button) => addShipButtonEventListener(game, button));
  submarineButtons.forEach((button) => addShipButtonEventListener(game, button));
  destroyerButtons.forEach((button) => addShipButtonEventListener(game, button));
}

// Event listener for starting the game
playButton.addEventListener('click', initializeGame);

function waitForPlayerInput(currentPlayer) {
  return new Promise((resolve) => {
    const currentPlayerBoard = currentPlayer === game.getPlayerOne() ? game.getPlayerOneBoard() : game.getPlayerTwoBoard();

    const checkForAttack = async () => {
      const playerAttack = currentPlayerBoard.getPlayerAttack();

      if (!playerAttack || Object.keys(playerAttack).length === 0) {
        playerTurnText.textContent = `Player ${currentPlayer.getName()}, please click on a grid/tile/coordinate.`;
        await new Promise((innerResolve) => setTimeout(innerResolve, timeoutDuration));
        await checkForAttack(); // Check again after the timeout
      } else {
        const coordinate = playerAttack.attack;
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

const logWinner = (winner) => {
  const winnerText = document.querySelector('.winner-text');
  const totalText = document.querySelector('.total-text');
  const hitText = document.querySelector('.hit-text');
  const winCount = game.getWinCount();

  winnerText.textContent = `Winner: ${winner.getName()}`;
  totalText.textContent = `Total Wins - Player1: ${winCount.player1}, Player2: ${winCount.player2}`;

  // Reset hit-text content
  hitText.textContent = '';

  // Remove 'clicked' class from all columns
  const allCols = document.querySelectorAll('.col');
  allCols.forEach((col) => col.classList.remove('clicked'));

  game.resetBoard();
};
