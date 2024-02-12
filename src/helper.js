const shipLengths = {
  destroyer: 2,
  cruiser: 3,
  submarine: 3,
  battleship: 4,
  carrier: 5,
};
const boardSize = 10;

const timeoutDuration = 6000;

// Container for ship buttons on the game interface
const shipButtonsContainer = document.querySelectorAll('.shipbutton-container');

// Function to display ship buttons on the game interface
function showShipButtons() {
  shipButtonsContainer.forEach((button) => {
    button.classList.remove('hidden');
  });
}

// Function to add event listener to ship buttons, triggering ship placement
function addShipButtonEventListener(game, button) {
  button.addEventListener('click', () => {
    const shipname = button.classList[0];
    const currentPlayer = button.value;

    // Prompt the user to enter the alignment for the ship (vertical or horizontal)
    const alignmentInput = prompt(`Please enter 'vertical' or 'horizontal' for ${shipname}:`);
    if (!isValidAlignment(alignmentInput)) {
      console.error('Invalid alignment input. Please enter either "vertical" or "horizontal".');
      return;
    }

    // Get the length of the ship based on its name
    const shipLength = shipLengths[shipname];

    // Prompt the user to input ship coordinates and initiate ship placement
    promptShipPlacement(game, shipname, shipLength, currentPlayer, alignmentInput);
  });
}

// Function to prompt the player for ship placement coordinates
function promptShipPlacement(game, shipName, shipLength, currentPlayer, alignmentInput) {
  console.log(`${currentPlayer}'s turn to place ${shipName}`);

  const shipCoordinates = [];
  const currentPlayerBoard = getPlayerBoard(game, currentPlayer);

  // Get valid rows and columns for the specified ship length and alignment
  const { validRows, validCols } = getValidRowsAndCols(alignmentInput, shipLength);

  // Prompt the user for ship coordinates until the required number is obtained
  while (shipCoordinates.length < shipLength) {
    const coordinateInput = prompt(`Please input coordinate for ${shipName} (ex: A1):`).toUpperCase();
    const coordinatesArray = coordinateInput.split('');

    const startRow = coordinatesArray[0];
    const startCol = coordinatesArray[1];

    // Check if the entered coordinates are valid
    if (isValidCoordinate(startRow, startCol, alignmentInput, validRows, validCols)) {
      for (let i = 0; i < shipLength; i++) {
        const row = alignmentInput === 'vertical' ? String.fromCharCode(startRow.charCodeAt(0) + i) : startRow;
        const col = alignmentInput === 'horizontal' ? String.fromCharCode(startCol.charCodeAt(0) + i) : startCol;
        shipCoordinates.push([row, col]);
      }
    } else {
      console.error('Invalid coordinates. Please enter valid coordinates.');
    }
  }

  // Log the obtained ship coordinates and initiate ship placement on the game board
  console.log(shipCoordinates);
  placeShip(currentPlayerBoard, shipName, shipLength, shipCoordinates);
}

// Function to check if the entered coordinates are valid for the given ship placement
function isValidCoordinate(row, col, alignmentInput, validRows, validCols) {
  return (
    (alignmentInput === 'vertical' && validRows.includes(row) && validCols.includes(col))
      || (alignmentInput === 'horizontal' && validRows.includes(row) && validCols.includes(col))
  );
}

// Function to check if the alignment input is valid (vertical or horizontal)
function isValidAlignment(alignment) {
  return alignment === 'vertical' || alignment === 'horizontal';
}

// Function to get valid rows and columns based on the ship alignment and length
function getValidRowsAndCols(alignmentInput, shipLength) {
  let validRows;
  let validCols;

  if (alignmentInput === 'vertical') {
    validRows = 'ABCDEFGHIJ'.slice(0, 10 - (shipLength - 1));
    validCols = Array.from({ length: 10 }, (_, i) => (i + 1).toString());
  } else if (alignmentInput === 'horizontal') {
    validRows = 'ABCDEFGHIJ';
    validCols = Array.from({ length: 10 - (shipLength - 1) }, (_, i) => (i + 1).toString());
  }

  return { validRows, validCols };
}

// Function to get the game board of the current player
function getPlayerBoard(game, currentPlayer) {
  return currentPlayer === 'player1' ? game.getPlayerOneBoard() : game.getPlayerTwoBoard();
}

// Function to prompt the user for their name with validation
function getPlayerName(promptMessage) {
  let playerName = prompt(promptMessage);

  // Validate the player name
  while (!isValidName(playerName)) {
    alert('Invalid name. Please enter a valid string.');
    playerName = prompt(promptMessage);
  }

  return playerName;
}

// Function to validate a player name (custom validation logic can be added)
function isValidName(name) {
  // Add your custom validation logic here
  // For example, ensuring the name is a non-empty string and does not contain symbols or numbers
  return typeof name === 'string' && name.trim() !== '' && /^[a-zA-Z\s]+$/.test(name);
}

// Function to place a ship on the game board
function placeShip(gameBoard, shipName, shipLength, shipCoordinates) {
  if (shipCoordinates.length !== shipLength) {
    console.log(`Invalid ship coordinates for ${shipName}. Please provide ${shipLength} coordinates.`);
    return;
  }

  if (isCoordinateOccupied(gameBoard, shipCoordinates)) {
    console.log('Invalid ship placement. Coordinates are already occupied.');
    return;
  }

  const board = gameBoard.getBoard();
  const shipLocation = gameBoard.getShipLocation();
  updateBoardCoordinate(board, shipLocation, shipName, shipCoordinates);
}

// Function to check if the specified coordinates on the game board are occupied by other ships
function isCoordinateOccupied(gameBoard, shipCoordinates) {
  const shipLocation = gameBoard.getShipLocation();

  for (const shipName in shipLocation) {
    const occupiedCoordinates = shipLocation[shipName];

    for (const [row, col] of shipCoordinates) {
      if (occupiedCoordinates.some(([occupiedRow, occupiedCol]) => occupiedRow === row && occupiedCol === col)) {
        return true; // Coordinate is already occupied by another ship
      }
    }
  }

  return false; // Coordinate is not occupied
}

// Function to update the game board with ship coordinates
function updateBoardCoordinate(board, shipLocation, shipName, shipCoordinates) {
  for (const [row, col] of shipCoordinates) {
    board[row][col] = shipName.charAt(0).toLowerCase(); // Using the first letter of the ship name as a code
  }

  shipLocation[shipName] = shipCoordinates;
}

// Function to handle receiving an attack on the game board
function receiveAttack(coordinate, gameBoard) {
  const hitText = document.querySelector('.hit-text');
  const [attackRow, attackCol] = coordinate;
  const successfulAttacks = gameBoard.getSuccessfulAttacks();

  if (successfulAttacks.some(([row, col]) => row === attackRow && col === attackCol)) {
    hitText.textContent = 'This target has already been successfully attacked.';
    return;
  }

  const shipAttackedName = checkShipAttackLocation(coordinate, gameBoard);

  if (shipAttackedName) {
    const ships = gameBoard.getShips();
    const shipAttacked = ships[shipAttackedName];

    if (!shipAttacked.isSunk()) {
      shipAttacked.isHit();
      successfulAttacks.push([attackRow, attackCol]);

      const remainingHealth = shipAttacked.length - shipAttacked.getHitCount();

      if (shipAttacked.isSunk()) {
        hitText.textContent = `${shipAttackedName} is sunk!`;
        // Handle any actions when a ship is sunk
      } else {
        hitText.textContent = `${shipAttackedName} is hit! Remaining health: ${remainingHealth}`;
        // Handle any actions when a ship is hit but not sunk
      }
    }
  } else {
    hitText.textContent = 'Missed the target!';
    const missedAttacks = gameBoard.getMissedAttacks();
    missedAttacks.push(coordinate);
    // Handle any actions when the attack misses all ships
  }
}

// Function to check which ship is attacked at a specific location on the game board
function checkShipAttackLocation(coordinate, gameBoard) {
  const [attackRow, attackCol] = coordinate;

  const shipLocation = gameBoard.getShipLocation();

  for (const shipName in shipLocation) {
    const shipCoordinates = shipLocation[shipName];

    for (const [row, col] of shipCoordinates) {
      if (row === attackRow && col === attackCol) {
        return shipName;
      }
    }
  }

  return null;
}

module.exports = {
  addShipButtonEventListener,
  showShipButtons,
  getPlayerName,
  boardSize,
  timeoutDuration,
  shipLengths,
  receiveAttack,
};
