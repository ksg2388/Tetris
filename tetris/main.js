import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.querySelector('.game-board');
  let squares = Array.from(document.querySelectorAll('.game-board div'));
  const displayNextBlocks = document.querySelectorAll('.block-next div');
  const displayHoldBlocks = document.querySelectorAll('.block-hold div');
  const startButton = document.querySelector('.start-btn');
  const scoreDisplay = document.querySelector('.score');
  const width = 10;
  let nextRandom = 0;
  let time = 300;
  let score = 0;
  let timerId;
  let holdCount = 1;

  const colors = [
    'blue',
    'red',
    'green',
    'yellow',
    'purple',
    'aqua',
    'mandarin',
  ];

  // Blocks
  const lBlock = [
    [1, width + 1, width * 2 + 1, width * 2 + 2],
    [width, width + 1, width + 2, width * 2],
    [0, 1, width + 1, width * 2 + 1],
    [width, width + 1, width + 2, 2],
  ];

  const jBlock = [
    [1, width + 1, width * 2 + 1, width * 2],
    [0, width, width + 1, width + 2],
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
  ];

  const zBlock = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];

  const sBlock = [
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [1, width, width + 1, width * 2],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
  ];

  const tBlock = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oBlock = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iBlock = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const blocks = [lBlock, jBlock, zBlock, sBlock, tBlock, oBlock, iBlock];

  const displayWidth = 4;
  let displayIndex = 0;
  let holdIndex = -1;

  const upNextBlock = [
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2 + 2], // lBlock
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 2], // jBlock
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], // zBlock
    [1, displayWidth, displayWidth + 1, displayWidth * 2], // sBlock
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // tBlock
    [0, 1, displayWidth, displayWidth + 1], // oBlock
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iBlock
  ];

  let currentPosition = 4;
  let currentRotate = 0;
  let random = Math.floor(Math.random() * blocks.length);

  let current = blocks[random][currentRotate];

  // 첫번째 블록을 그린다.
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('block');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('block');
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  // makeNextBlock();
  // draw();
  // // 블록 내리기
  // timerId = setInterval(moveDown, time);

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // 키보드 이벤트
  function control(e) {
    if (e.keyCode === 37) {
      // 왼쪽
      moveLeft();
    } else if (e.keyCode === 38) {
      // 위쪽(회전)
      rotate();
    } else if (e.keyCode === 39) {
      // 오른쪽
      moveRight();
    } else if (e.keyCode === 40) {
      // 아래쪽
      handleDown();
    } else if (e.keyCode === 72) {
      console.log('hold!!');
      holdBlock();
    }
  }
  document.addEventListener('keyup', control);

  // freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains('taken')
      )
    ) {
      console.log(current);
      current.forEach((index) =>
        // console.log(index);
        squares[currentPosition + index].classList.add('taken')
      );
      // 새로운 블록 생성
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * blocks.length);
      current = blocks[random][currentRotate];
      currentPosition = 4;
      draw();
      makeNextBlock();
      addScore();
      gameOver();
    }
  }

  function holdBlock() {
    // 이미 홀드되어있는 블록이 있는 경우
    if (holdIndex >= 0) {
      random = holdIndex;

      displayHoldBlocks.forEach((square) => {
        square.classList.remove('block');
        square.style.backgroundColor = '';
      });

      undraw();

      nextRandom = Math.floor(Math.random() * blocks.length);
      current = blocks[random][currentRotate];
      currentPosition = 4;
      draw();
      makeNextBlock();
      holdIndex = -1;

      return;
    }

    holdIndex = random;

    displayHoldBlocks.forEach((square) => {
      square.classList.remove('block');
      square.style.backgroundColor = '';
    });

    upNextBlock[random].forEach((index) => {
      displayHoldBlocks[displayIndex + index].classList.add('block');
      displayHoldBlocks[displayIndex + index].style.backgroundColor =
        colors[random];
    });

    undraw();

    // 새로운 블록 생성
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * blocks.length);
    current = blocks[random][currentRotate];
    currentPosition = 4;
    draw();
    makeNextBlock();
  }

  // 이동함수
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;

    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  function handleDown() {
    undraw();

    if (
      !current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      currentPosition += 10;
    }
    draw();
    console.log(currentPosition);
  }

  function rotate() {
    undraw();
    const origin = [...current];

    currentRotate++;
    if (currentRotate === current.length) {
      currentRotate = 0;
    }

    current = blocks[random][currentRotate];

    // todo: 회전할때 다른 블록이 존재하는 경우 회전 못하도록 막기
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      ) ||
      current.some((index) =>
        squares[currentPosition + index].classList.contains('block')
      )
    ) {
      console.log('... No');
      currentRotate--;
      current = origin;
      console.log('[origin]', origin);
    } else {
      // todo: 돌아간 블록이 범위 밖을 넘어가는 경우 위치 재조정
      const isAtRightEdge = current.some(
        (index) => (currentPosition + index) % width === width - 1
      );
      const isAtLeftEdge = current.some(
        (index) => (currentPosition + index) % width === 0
      );

      if (isAtRightEdge) {
        if (
          random === 1 ||
          random === 2 ||
          random === 3 ||
          random === 4 ||
          random === 0
        ) {
          currentPosition--;
        } else if (
          random === 6 &&
          (currentRotate === 1 || currentRotate === 3)
        ) {
          currentPosition -= 2;
        }
      }
      current = blocks[random][currentRotate];
    }

    draw();
  }

  // 다음 나올 블록 미리보기
  function makeNextBlock() {
    displayNextBlocks.forEach((square) => {
      square.classList.remove('block');
      square.style.backgroundColor = '';
    });

    upNextBlock[nextRandom].forEach((index) => {
      displayNextBlocks[displayIndex + index].classList.add('block');
      displayNextBlocks[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  // 버튼 관련 코드
  startButton.addEventListener('click', () => {
    console.log('start!!');
    if (timerId) {
      return;
    } else {
      score = 0;
      draw();
      timerId = setInterval(moveDown, time);
      nextRandom = Math.floor(Math.random() * blocks.length);
      makeNextBlock();
      addScore();
    }
  });

  // 점수 계산 관련
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains('taken'))) {
        score += 10;
        row.forEach((index) => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('block');
          squares[index].style.backgroundColor = '';
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => gameBoard.appendChild(cell));
      }
      scoreDisplay.innerHTML = score;
    }
  }

  // 게임 종료
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains('taken')
      )
    ) {
      clearInterval(timerId);
    }
  }
});
