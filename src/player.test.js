const createPlayer = require('./player.js');
const { createGameBoard, receiveAttack } = require('./board.js');

beforeEach(() => {
  gameBoard = createGameBoard();
});

test('getName should return the correct player name', () => {
  const playerName = 'Kel';
  const player = createPlayer(playerName);

  expect(player).toBe(playerName);
});

test('generateAttack should generate valid attack coordinates', () => {
  // Create a player with a specific name
  const player = createPlayer('Kel');

  // Generate an attack coordinate using the player's method
  const attackCoordinate = player.generateAttack();

  // Check if the attackCoordinate is a valid coordinate
  const isValidCoordinate = /^[A-J]$/.test(attackCoordinate[0]) && /^[1-9]|10$/.test(attackCoordinate[1]);

  // Simulate the attack on the game board
  receiveAttack(attackCoordinate, gameBoard);

  // Verify that the coordinate is valid and the attack has been simulated
  expect(isValidCoordinate).toBe(true);
});
