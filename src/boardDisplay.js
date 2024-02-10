function drawBoard(container, size, player, game) {
  const boardSize = size;

  addRowSquareDiv(container, boardSize, player, game);
}

function addRowSquareDiv(container, boardSize, playerId, game) {
  const letters = 'ABCDEFGHIJ';
  let clickedCoordinates = []; // Array to store clicked coordinates

  for (let i = 0; i < boardSize; i++) {
    const rowLetter = letters[i];

    const row = document.createElement('div');
    row.classList.add(`row-${rowLetter}`);
    row.style.cssText = 'display: flex;';

    for (let j = 1; j <= boardSize; j++) {
      const col = document.createElement('div');
      col.classList.add(`col-${rowLetter}-${j}`);
      col.classList.add('hover'); // Add hover class for initial hover effect
      col.setAttribute('data-player-id', playerId); // Associate the column with the player

      col.style.cssText = 'width: 40px; height: 40px; border: 4px solid #8b8589;';

      col.addEventListener('click', (event) => {
        const clickedRowLetter = rowLetter;
        const clickedColNumber = String(j);

        // Remove hover class and add clicked class to the clicked column
        col.classList.remove('hover');
        col.classList.add('clicked');

        clickedCoordinates = [];
        clickedCoordinates.push(clickedRowLetter);
        clickedCoordinates.push(clickedColNumber);
        const currentPlayer = col.getAttribute('data-player-id');
        if (currentPlayer === 'player2') {
          const player1Board = game.getPlayerOneBoard();
          player1Board.setPlayerAttack('attack', clickedCoordinates);
        } else if (currentPlayer === 'player1') {
          const player2Board = game.getPlayerTwoBoard();
          player2Board.setPlayerAttack('attack', clickedCoordinates);
        }
      });

      row.appendChild(col);
    }

    container.appendChild(row);
  }
}

module.exports = drawBoard;
