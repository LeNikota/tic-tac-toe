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
  const getBoard = () => boardArr;

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
      return mark;
    };

    return {
      one, two, getCurrentPlayerMark, changePlayersTurn,
    };
  };

  const findCell = (element) => {
    const cellsArr = Array.from(document.querySelectorAll('.cell'));
    return cellsArr.indexOf(element);
  };

  const fillCell = (element) => {
    const index = findCell(element);
    boardArr[index] = player.getCurrentPlayerMark();
    if (checkWinCondition()) console.log('yeah');
    player.changePlayersTurn();
  };

  function checkWinCondition() {
    const boardArr = gameBoardModule.getBoard();
    const mark = player.getCurrentPlayerMark();
    if (
      (boardArr[0] === mark && boardArr[1] === mark && boardArr[2] === mark)
      || (boardArr[3] === mark && boardArr[4] === mark && boardArr[5] === mark)
      || (boardArr[6] === mark && boardArr[7] === mark && boardArr[8] === mark)
      || (boardArr[0] === mark && boardArr[3] === mark && boardArr[6] === mark)
      || (boardArr[1] === mark && boardArr[4] === mark && boardArr[7] === mark)
      || (boardArr[2] === mark && boardArr[5] === mark && boardArr[8] === mark)
      || (boardArr[0] === mark && boardArr[4] === mark && boardArr[8] === mark)
      || (boardArr[2] === mark && boardArr[4] === mark && boardArr[6] === mark)
    ) {
      return true;
    }
    return false;
  }

  const player = createPlayers();
  const boardArr = createBoard();
  return { fillCell, getBoard };
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
    render(gameBoardModule.getBoard());
  };

  const render = (boardArr) => {
    cells.forEach((e, i) => {
      e.textContent = boardArr[i];
    });
  };

  createBoard();
})();
