function createShip(name, length) {
  if (!length) {
    return null; // or throw new Error('Invalid ship length. Must be a positive integer.');
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
    getHitCount() {
      return this.hit;
    },
  };
}
module.exports = createShip;
