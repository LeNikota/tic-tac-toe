function playerFactory(name, side, id) {
  const playerName = name;
  const playerSide = side;
  const playerId = id;
  const getName = () => playerName;
  const getSide = () => playerSide;
  const getId = () => playerId;
  return { getName, getSide, getId };
}

const gameBoardModule = (() => {
  const createBoard = () => ['', '', '', '', '', '', '', '', ''];

  const createPlayers = () => {
    const playerIdOne = document.querySelector('#player-one');
    const playerIdTwo = document.querySelector('#player-two');
    const one = playerFactory('Player 1', 'x', playerIdOne);
    const two = playerFactory('Player 2', 'o', playerIdTwo);
    let turn = one;

    const changePlayersTurn = () => {
      turn = (turn === one) ? two : one;
    };
    const getCurrentPlayerMark = () => {
      const mark = turn.getSide();
      changePlayersTurn();
      return mark;
    };

    return { one, two, getCurrentPlayerMark };
  };

  const findCell = (element) => {
    const cellsArr = Array.from(document.querySelectorAll('.cell'));
    return cellsArr.indexOf(element);
  };

  const fillCell = (element) => {
    const index = findCell(element);
    boardArr[index] = player.getCurrentPlayerMark();
    displayModule.render(boardArr, element);
  };

  const player = createPlayers();
  const boardArr = createBoard();
  return { fillCell, boardArr };
})();

const displayModule = (() => {
  const cells = document.querySelectorAll('.cell');
  const createBoard = () => {
    cells.forEach((e) => {
      e.addEventListener('click', handleCellClick, { once: true });
    });
  };

  const handleCellClick = (e) => {
    const index = e.target;
    gameBoardModule.fillCell(index);
  };

  const render = (boardArr) => {
    cells.forEach((e, i) => {
      e.textContent = boardArr[i];
    });
  };

  createBoard();
  return { render };
})();
