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
    let activePlayer = one;

    const changePlayersTurn = () => {
      activePlayer = (activePlayer === one) ? two : one;
    };
    const getCurrentPlayerMark = () => {
      const mark = activePlayer.getSide();
      return mark;
    };
    const getHowsTurn = () => activePlayer.getName();

    return {
      one,
      two,
      getCurrentPlayerMark,
      changePlayersTurn,
      getHowsTurn,
    };
  };

  const findCell = (element) => {
    const cellsArr = Array.from(document.querySelectorAll('.cell'));
    return cellsArr.indexOf(element);
  };

  const fillCell = (element) => {
    const index = findCell(element);
    boardArr[index] = player.getCurrentPlayerMark();
    if (checkRoundOver()) {
      roundOver();
    } else {
      player.changePlayersTurn();
    }
  };

  const checkRoundOver = () => {
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const boardArr = gameBoardModule.getBoard();
    const mark = player.getCurrentPlayerMark();
    for (let i = 0; i < winningConditions.length; i += 1) {
      const pair = winningConditions[i];
      if (
        (boardArr[pair[0]] === mark
          && boardArr[pair[1]] === mark
          && boardArr[pair[2]] === mark)
        || !boardArr.includes('')
      ) {
        return true;
      }
    }
    return false;
  };

  const roundOver = () => {
    if (boardArr.includes('')) {
      windowModule.toggleWinner(player.getHowsTurn());
    } else {
      windowModule.toggleWinner('tie');
    }
  };

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

const windowModule = (() => {
  const toggleWinner = (state = 'console') => {
    const winnerPhrase = document.querySelector('.winner-player-name .phrase');
    const winnerState = document.querySelector('.winner-player-name .state');
    const winnerWindow = document.querySelector('.winner');
    if (state === 'tie') {
      winnerPhrase.textContent = "It's a ";
      winnerState.textContent = 'tie';
    } else {
      winnerPhrase.textContent = 'The winner is ';
      winnerState.textContent = state;
    }
    winnerWindow.classList.toggle('hidden');
  };

  return { toggleWinner };
})();
