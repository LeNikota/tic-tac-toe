function playerFactory(name, side) {
  const playerName = name;
  const playerSide = side;
  const getName = () => playerName;
  const getSide = () => playerSide;
  return { getName, getSide };
}

/* ------------       The game board module         ---------------- */

const gameBoardModule = (() => {
  const createBoard = () => ['', '', '', '', '', '', '', '', ''];
  const getBoard = () => [...boardArr];
  const changeOpponentPlayer = (e) => {
    opponentPlayer = e.target.value;
  };
  let player;
  let boardArr;
  let opponentPlayer = 'human';
  let AIturn = false;

  const createPlayers = (nameOne, nameTwo) => {
    const one = playerFactory(nameOne, 'x');
    const two = playerFactory(nameTwo, 'o');
    let activePlayer = one;

    const changePlayersTurn = () => {
      activePlayer = (activePlayer === one) ? two : one;
      if (AIturn) {
        AIturn = false;
        return;
      }
      switch (opponentPlayer) {
        case 'human':
          displayModule.switchPlayersColor('switch');
          break;
        case 'random':
          AIturn = true;
          displayModule.simulateClick(AIModule.getRandomDecision());
          break;
        case 'casual':
          AIturn = true;
          displayModule.simulateClick(AIModule.getBestMove());
          break;
      }
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

  const findCellByIndex = (index) => {
    const cellsArr = Array.from(document.querySelectorAll('.cell'));
    return cellsArr[index];
  };

  const findCellByElement = (element) => {
    const cellsArr = Array.from(document.querySelectorAll('.cell'));
    return cellsArr.indexOf(element);
  };

  const fillCell = (element) => {
    const index = findCellByElement(element);
    boardArr[index] = player.getCurrentPlayerMark();
    if (checkPlayerWinning() || checkDisplayFull()) {
      roundOver();
    } else {
      player.changePlayersTurn();
    }
  };

  const checkPlayerWinning = (providedBoard, playerMark) => {
    let board = boardArr;
    let mark = player.getCurrentPlayerMark();
    if (providedBoard != null && playerMark != null) {
      board = providedBoard;
      mark = playerMark;
    }

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
    for (let i = 0; i < winningConditions.length; i += 1) {
      const pair = winningConditions[i];
      if (
        (board[pair[0]] === mark
          && board[pair[1]] === mark
          && board[pair[2]] === mark)
      ) {
        return true;
      }
    }
    return false;
  };

  const checkDisplayFull = (board) => {
    if (board != null) {
      return !board.includes('');
    }
    return !boardArr.includes('');
  };

  const roundOver = () => {
    if (checkPlayerWinning()) {
      windowModule.toggleWinner(player.getHowsTurn());
    } else {
      windowModule.toggleWinner('tie');
    }
  };

  const init = (nameOne, nameTwo) => {
    player = createPlayers(nameOne, nameTwo);
    boardArr = createBoard();
    displayModule.switchPlayersColor('start');
  };

  return {
    fillCell,
    findCellByIndex,
    getBoard,
    checkPlayerWinning,
    checkDisplayFull,
    init,
    changeOpponentPlayer,
  };
})();

/* ------------       The game display module         ---------------- */

const displayModule = (() => {
  const cells = document.querySelectorAll('.cell');
  const playerDOMElements = document.querySelectorAll('.player');

  const init = () => {
    cells.forEach((e) => {
      e.removeEventListener('click', handleCellClick);
      e.addEventListener('click', handleCellClick, { once: true });
    });
    render(gameBoardModule.getBoard());
  };

  const handleCellClick = (e) => {
    const index = e.target;
    gameBoardModule.fillCell(index);
    render(gameBoardModule.getBoard());
  };

  const switchPlayersColor = (action) => {
    switch (action) {
      case 'start': {
        playerDOMElements[0].classList.add('active');
        playerDOMElements[1].classList.remove('active');
        break;
      }
      case 'switch': {
        playerDOMElements[0].classList.toggle('active');
        playerDOMElements[1].classList.toggle('active');
        break;
      }
    }
  };

  const render = (boardArr) => {
    cells.forEach((e, i) => {
      e.textContent = boardArr[i];
    });
  };

  const simulateClick = (index) => {
    const element = gameBoardModule.findCellByIndex(index);
    element.click();
  };

  return { init, switchPlayersColor, simulateClick };
})();

/* ------------       The window module         ---------------- */

const windowModule = (() => {
  const playerFieldOne = document.querySelector('#player-field-one');
  const playerFieldTwo = document.querySelector('#player-field-two');
  const playerInputOne = document.querySelector('#player-input-one');
  const playerInputTwo = document.querySelector('#player-input-two');
  const winnerWindow = document.querySelector('.winner');
  const winnerPhrase = document.querySelector('.winner-player-name .phrase');
  const winnerState = document.querySelector('.winner-player-name .state');
  const winnerMenuBtn = document.querySelector('.winner .menu-btn');
  const winnerNextRound = document.querySelector('.winner .next-round');
  const menu = document.querySelector('.menu');
  const menuStartBtn = document.querySelector('.menu .start-btn');
  const secondPlayer = document.querySelectorAll('.second-player');
  let nameOne;
  let nameTwo;

  const toggleWinner = (state = 'console') => {
    if (!(winnerWindow.classList.contains('hidden'))) {
      gameBoardModule.init(nameOne, nameTwo);
      displayModule.init();
    }
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
    nameOne = playerInputOne.value;
    nameTwo = playerInputTwo.value;
    if (!(winnerWindow.classList.contains('hidden'))) {
      toggleWinner();
    }
    if (!nameOne && !nameTwo) {
      nameOne = 'Player 1';
      nameTwo = 'Player 2';
    }
    playerFieldOne.textContent = nameOne;
    playerFieldTwo.textContent = nameTwo;
    menu.classList.toggle('hidden');
    gameBoardModule.init(nameOne, nameTwo);
    displayModule.init();
  };

  menuStartBtn.addEventListener('click', toggleMenu);
  winnerMenuBtn.addEventListener('click', toggleMenu);
  winnerNextRound.addEventListener('click', toggleWinner);
  secondPlayer.forEach((e) => {
    e.addEventListener('click', gameBoardModule.changeOpponentPlayer);
  });

  return { toggleWinner, toggleMenu };
})();

/* ------------       The AI module         ---------------- */

const AIModule = (() => {
  const howsWinning = (board) => {
    const marks = ['x', 'o'];
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

    for (let i = 0; i < marks.length; i += 1) {
      const mark = marks[i];
      for (let j = 0; j < winningConditions.length; j += 1) {
        const pair = winningConditions[j];
        if (
          (board[pair[0]] === mark
            && board[pair[1]] === mark
            && board[pair[2]] === mark)
        ) {
          return mark;
        }
      }
    }
    if (!board.includes('')) return 'tie';
    return null;
  };

  const getRandomNumber = (max) => Math.floor(Math.random() * max);

  const getRandomDecision = () => {
    const availableCells = findAvailableCells();
    const randomPosition = availableCells[getRandomNumber(availableCells.length)];
    return randomPosition;
  };

  const findAvailableCells = (providedBoard) => {
    let board = gameBoardModule.getBoard();
    if (providedBoard != null) {
      board = providedBoard;
    }
    const availableCells = board.reduce((accumulator, element, index) => {
      if (element === '') {
        accumulator.push(index);
      }
      return accumulator;
    }, []);
    return availableCells;
  };

  const minimax = (providedBoard, isMaximizing) => {
    const board = [...providedBoard];
    const scores = {
      x: 1,
      o: -1,
      tie: 0,
    };
    const result = howsWinning(board);
    if (result) {
      return scores[result];
    }

    const availableCells = findAvailableCells(board);
    if (isMaximizing) {
      let bestScore = -Infinity;
      availableCells.forEach((index) => {
        board[index] = 'x';
        const score = minimax(board, false);
        bestScore = Math.max(score, bestScore);
      });
      return bestScore;
    }
    let bestScore = Infinity;
    availableCells.forEach((index) => {
      board[index] = 'o';
      const score = minimax(board, true);
      bestScore = Math.min(score, bestScore);
    });
    return bestScore;
  };

  const getBestMove = () => {
    let bestScore = -Infinity;
    let bestMove;
    const availableCells = findAvailableCells();
    availableCells.forEach((index) => {
      const board = gameBoardModule.getBoard();
      board[index] = 'x';
      const score = minimax(board, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = index;
      }
    });
    return bestMove;
  };

  return { getBestMove, getRandomDecision };
})();
