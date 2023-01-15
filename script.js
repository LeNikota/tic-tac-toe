const gameBoardModule = (() => {
  const init = () => {
    createBoard();
    createPlayers();
  };

  const resetBoard = () => {
    const boardArr = [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ];
  };

  const createBoard = () => {
    const CELLS = document.querySelectorAll('.cell');
    CELLS.forEach((e) => {
      e.addEventListener('click', handleCellClick, { once: true });
    });
  };

  const createPlayers = () => {
    const playerIdOne = document.querySelector('#player-one');
    const playerIdTwo = document.querySelector('#player-two');
    const playerOne = playerFactory('Player 1', 'x', playerIdOne);
    const playerTwo = playerFactory('Player 2', 'o', playerIdTwo);
    return { playerOne, playerTwo };
  };

  const handleCellClick = (e) => {

  };

  init();

  return {};
})();

function playerFactory(name, side, id) {
  const playerName = name;
  const playerSide = side;
  const playerId = id;
  return { playerName, playerSide, playerId };
}
