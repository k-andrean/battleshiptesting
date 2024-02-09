const { createGameBoard, placeShip, receiveAttack } = require('./board.js');

const mockGenerateRandomCoordinate = jest.fn((length, startRow) => {
  const shipCoordinates = [];

  for (let i = 0; i < length; i++) {
    const colKey = (i + 1).toString();
    shipCoordinates.push([startRow, colKey]);
  }
  return shipCoordinates;
});

const shipCoordinates = mockGenerateRandomCoordinate(5, 'A');

beforeEach(() => {
  gameBoard = createGameBoard(); // Assuming createGameBoard is defined
  const placeShipCoordinate = mockGenerateRandomCoordinate(5, 'A');
  placeShip(gameBoard, 'carrier', 5, placeShipCoordinate);
});

test('creategameBoard should generate the correct board structure', () => {
  const board = createGameBoard().getBoard();

  for (let row = 'A'.charCodeAt(0); row <= 'J'.charCodeAt(0); row++) {
    const rowKey = String.fromCharCode(row);
    expect(board).toHaveProperty(rowKey);

    // Check if columns (1-10) are present in each row
    for (let col = 1; col <= 10; col++) {
      const colKey = col.toString();
      expect(board[rowKey]).toHaveProperty(colKey);

      // Check if each grid cell is an empty object
      expect(board[rowKey][colKey]).toEqual({});
    }
  }
});

test('place ship should update board Coordinate in game board', () => {
  const board = gameBoard.getBoard();
  for (const [row, col] of shipCoordinates) {
    const shipCode = 'carrier'.charAt(0).toLowerCase(); // Dynamic ship code
    expect(board[row][col]).toBe(shipCode);
  }

  expect(gameBoard.getShipLocation().carrier).toEqual(shipCoordinates);
});

test('receiveAttack should update ship hit count', () => {
  const ship = gameBoard.getShips().carrier;
  const initialHitCount = ship.hit;

  receiveAttack(['A', '1'], gameBoard); // Assuming 'A1' is a hit coordinate

  expect(ship.hit).toBe(initialHitCount + 1);
});

test('receiveAttack should update ship sunk status', () => {
  const ship = gameBoard.getShips().carrier;

  for (let i = 0; i < ship.length; i++) {
    receiveAttack(['A', `${i + 1}`], gameBoard); // Simulating hits for the cruiser
  }

  expect(ship.isSunk()).toBe(true);
});

test('receiveAttack should update missed attacks', () => {
  const initialMissedAttacksCount = gameBoard.getMissedAttacks().length;

  // Assuming 'B2' is a miss
  receiveAttack(['B', '2'], gameBoard);

  // Check if missed attacks are updated
  expect(gameBoard.getMissedAttacks().length).toBe(initialMissedAttacksCount + 1);
});

test('receiveAttack should update successful attacks', () => {
  const initialSuccessfulAttacksCount = gameBoard.getSuccessfulAttacks().length;

  // Assuming 'A1' is a hit
  receiveAttack(['A', '1'], gameBoard);

  // Check if successful attacks are updated
  expect(gameBoard.getSuccessfulAttacks().length).toBe(initialSuccessfulAttacksCount + 1);
});

test('setPlayerAttack should set player attack coordinates', () => {
  // Arrange
  const coordinate = ['A', '1'];
  const playerId = 'player1';

  // Act
  gameBoard.setPlayerAttack(coordinate, playerId);

  // Assert
  expect(gameBoard.getPlayerAttack(playerId)).toEqual(coordinate);
});

test('resetPlayerAttack should reset player attack coordinates', () => {
  // Arrange
  const coordinate = ['A', '1'];
  const playerId = 'player1';

  // Set player attack first
  gameBoard.setPlayerAttack(coordinate, playerId);

  // Act
  gameBoard.resetPlayerAttack();

  // Assert
  expect(gameBoard.getPlayerAttack(playerId)).toBeUndefined();
});
