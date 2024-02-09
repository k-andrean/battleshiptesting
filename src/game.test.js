const createGame = require('./game.js');

describe('createGame', () => {
  test('should create players and their boards', () => {
    // Arrange
    const playerName1 = 'Player1';
    const playerName2 = 'Player2';

    // Act
    const game = createGame(playerName1, playerName2);

    // Assert
    expect(game.getPlayerOne()).toBeDefined();
    expect(game.getPlayerTwo()).toBeDefined();
    expect(game.getPlayerOneBoard()).toBeDefined();
    expect(game.getPlayerTwoBoard()).toBeDefined();
  });

  test('should increment win count when a winner is provided', () => {
    // Arrange
    const playerName1 = 'Player1';
    const playerName2 = 'Player2';
    const game = createGame(playerName1, playerName2);
    const winner = game.getPlayerOne();

    // Act
    game.incrementWinCount(winner);

    // Assert
    expect(game.getWinCount().player1).toBe(1);
  });

  test('should reset the boards when resetBoard is called', () => {
    // Arrange
    const playerName1 = 'Player1';
    const playerName2 = 'Player2';
    const game = createGame(playerName1, playerName2);

    // Modify the boards to simulate game progress (optional)
    game.getPlayerOneBoard().setPlayerAttack([['A', 1]], 'player1');
    game.getPlayerTwoBoard().setPlayerAttack([['B', 2]], 'player2');

    // Act: Call resetBoard
    game.resetBoard();

    // Assert
    // Check if the boards are reset to their initial state (empty)
    expect(game.getPlayerOneBoard().getSuccessfulAttacks()).toEqual([]);
    expect(game.getPlayerTwoBoard().getSuccessfulAttacks()).toEqual([]);
    expect(game.getPlayerOneBoard().getMissedAttacks()).toEqual([]);
    expect(game.getPlayerTwoBoard().getMissedAttacks()).toEqual([]);
    // Add more assertions if needed to check the state of other properties
  });
});
