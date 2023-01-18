function playerFactory(name, side) {
  const playerName = name;
  const playerSide = side;
  const getName = () => playerName;
  const getSide = () => playerSide;
  return { getName, getSide };
}

const gameBoardModule = (() => {
  const createBoard = () => ['', '', '', '', '', '', '', '', ''];
  const getBoard = () => boardArr;
  let player;
  let boardArr;

  const createPlayers = (nameOne, nameTwo) => {
    const one = playerFactory(nameOne, 'x');
    const two = playerFactory(nameTwo, 'o');
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

  const init = (nameOne, nameTwo) => {
    player = createPlayers(nameOne, nameTwo);
    boardArr = createBoard();
  };

  return { fillCell, getBoard, init };
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
  const playerFieldOne = document.querySelector('#player-field-one');
  const playerFieldTwo = document.querySelector('#player-field-two');
  const playerInputOne = document.querySelector('#player-input-one');
  const playerInputTwo = document.querySelector('#player-input-two');
  const winnerWindow = document.querySelector('.winner');
  const winnerPhrase = document.querySelector('.winner-player-name .phrase');
  const winnerState = document.querySelector('.winner-player-name .state');
  const winnerMenuBtn = document.querySelector('.winner .menu-btn');
  const menu = document.querySelector('.menu');
  const menuStartBtn = document.querySelector('.menu .start-btn');

  const toggleWinner = (state = 'console') => {
    if (state === 'tie') {
      winnerPhrase.textContent = "It's a ";
      winnerState.textContent = 'tie';
    } else {
      winnerPhrase.textContent = 'The winner is ';
      winnerState.textContent = state;
    }
    winnerWindow.classList.toggle('hidden');
  };

  const toggleMenu = () => {
    if (!(winnerWindow.classList.contains('hidden'))) {
      toggleWinner();
    }
    let nameOne = playerInputOne.value;
    let nameTwo = playerInputTwo.value;
    if (!nameOne && !nameTwo) {
      nameOne = 'Player 1';
      nameTwo = 'Player 2';
    }
    playerFieldOne.textContent = nameOne;
    playerFieldTwo.textContent = nameTwo;
    menu.classList.toggle('hidden');
    gameBoardModule.init(nameOne, nameTwo);
  };

  menuStartBtn.addEventListener('click', toggleMenu);
  winnerMenuBtn.addEventListener('click', toggleMenu);

  return { toggleWinner, toggleMenu };
})();
