function createShip(name) {
  const shiplength = {
    destroyer: 2,
    cruiser: 3,
    submarine: 3,
    battleship: 4,
    carrier: 5,
  };

  const length = shiplength[name];

  if (!length) {
    return null; // or throw new Error('Invalid ship name. Must be one of: destroyer, cruiser, submarine, battleship, carrier.');
  }

  return {
    length,
    hit: 0,
    sunk: false,
    name,
    isHit() {
      if (this.hit < this.length) {
        this.hit++;
      }
      return this.hit === this.length;
    },
    isSunk() {
      return this.hit === this.length;
    },
  };
}

module.exports = createShip;