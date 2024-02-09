function createPlayer(playerName) {
  const name = playerName;

  return {
    getName: () => name,
    name,
  };
}

module.exports = createPlayer;
