const createShip = require('./ship.js');

test('isHit should update hit count', () => {
  const ship = createShip('submarine'); // Assuming a ship of length 4
  const initialHitCount = ship.hit;

  ship.isHit();

  expect(ship.hit).toBe(initialHitCount + 1);
});

test('isSunk should return true when ship is sunk', () => {
  const ship = createShip('cruiser'); // Assuming a ship of length 3

  for (let i = 0; i < ship.length; i++) {
    ship.isHit();
  }

  expect(ship.isSunk()).toBe(true);
});
