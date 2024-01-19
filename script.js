// constants
const snakeArr = [];
const direction = { x: 0, y: 0 };
const foodPosition = { row: 5, col: 5 };

//variables
let speed = 500;
let score = 0;
let hiscore;
let timerId;

// DOM references
const gameBoardRef = document.querySelector('#board');
const scoreRef = document.querySelector('#score');
const hiscoreRef = document.querySelector('#hiscore');

// audios
const gameMusicAudio = new Audio('assets/music.mp3');
const foodEatAudio = new Audio('assets/food.mp3');
const snakeMoveAudio = new Audio('assets/move.mp3');
const gameOverAudio = new Audio('assets/gameover.mp3');

// functions
const resetGame = () => {
    gameBoardRef.innerHTML = '';

    snakeArr.length = 0;

    direction.x = 0;
    direction.y = 0;

    score = 0;

    speed = 500;

    window.addEventListener('keydown', changeSnakeDirection);

    main();
}

const gameOver = () => {
    clearInterval(timerId);

    gameMusicAudio.pause();

    gameMusicAudio.currentTime = 0;

    gameOverAudio.play();

    window.removeEventListener('keydown', changeSnakeDirection);

    setTimeout(() => {
        resetGame();
    }, 1500);
}

const checkCollison = () => {
    let gameover = false;

    if (snakeArr[0].row === 1 || snakeArr[0].row === 25 || snakeArr[0].col === 1 || snakeArr[0].col === 25) {
        gameover = true;
    }

    for (let i = 1; i < snakeArr.length; i++) {
        if (snakeArr[i].row === snakeArr[0].row && snakeArr[i].col === snakeArr[0].col) {
            gameover = true;
            break;
        }
    }

    if (gameover) {
        gameOver();
    }
}

const increaseSnakeSpeed = () => {
    if (speed > 50) {
        clearInterval(timerId);

        speed -= 30;

        gameLoop();
    }
}

const incrementSnakeBody = () => {
    const snakeBody = document.createElement('div');
    snakeBody.classList.add('snake-body');

    snakeArr.push({ row: snakeArr[snakeArr.length - 1].row - direction.y, col: snakeArr[snakeArr.length - 1].col - direction.x });

    snakeBody.style.gridRow = snakeArr[snakeArr.length - 1].row;
    snakeBody.style.gridColumn = snakeArr[snakeArr.length - 1].col;

    gameBoardRef.appendChild(snakeBody);
}

const incrementScore = () => {
    score++;
    scoreRef.innerText = score;
    if (score > hiscore) {
        localStorage.setItem('hiscore', score);
        hiscore = score;
        hiscoreRef.innerText = hiscore;
    }
}

const onEatFood = () => {
    if (snakeArr[0].row !== foodPosition.row || snakeArr[0].col !== foodPosition.col) {
        return;
    }
    foodEatAudio.play();
    incrementScore();
    incrementSnakeBody();
    changeFoodPosition();
    increaseSnakeSpeed();
}

const moveSnake = () => {
    const snakeHead = document.querySelector('#snake-head');
    const snakeBody = document.querySelectorAll('.snake-body');

    for (let i = snakeArr.length - 1; i > 0; i--) {
        snakeArr[i].row = snakeArr[i - 1].row;
        snakeArr[i].col = snakeArr[i - 1].col;
        snakeBody[i - 1].style.gridRow = snakeArr[i].row;
        snakeBody[i - 1].style.gridColumn = snakeArr[i].col;
    }

    snakeArr[0].row = snakeArr[0].row + direction.y;
    snakeArr[0].col = snakeArr[0].col + direction.x;

    snakeHead.style.gridRow = snakeArr[0].row;
    snakeHead.style.gridColumn = snakeArr[0].col;
}

const changeFoodPosition = () => {
    const food = document.querySelector('#food');
    foodPosition.row = Math.floor(Math.random() * 22) + 2;
    foodPosition.col = Math.floor(Math.random() * 22) + 2;

    for (let i = 0; i < snakeArr.length; i++) {
        if (foodPosition.row === snakeArr[i].row && foodPosition.col === snakeArr[i].col) {
            changeFoodPosition();
            return;
        }
    }

    food.style.gridRow = foodPosition.row;
    food.style.gridColumn = foodPosition.col;
}

const gameLoop = () => {
    timerId = setInterval(() => {
        moveSnake();
        onEatFood();
        checkCollison();
    }, speed);
}

const showHiscore = () => {
    const saved_hiscore = Number(localStorage.getItem('hiscore'));
    hiscore = saved_hiscore === null ? 0 : saved_hiscore;
    hiscoreRef.innerText = hiscore;
}

const generateFood = () => {
    const food = document.createElement('i');
    food.classList = 'fa-solid fa-apple-whole';
    food.setAttribute('id', 'food');
    gameBoardRef.appendChild(food);
    changeFoodPosition();
}

const createSnake = () => {
    const snakeHead = document.createElement('div');
    const snakeEye1 = document.createElement('div');
    const snakeEye2 = document.createElement('div');

    snakeHead.setAttribute('id', 'snake-head');
    snakeEye1.classList.add('snake-eye');
    snakeEye2.classList.add('snake-eye');

    snakeArr.push({ row: 20, col: 20 });

    snakeHead.style.gridRow = snakeArr[0].row;
    snakeHead.style.gridColumn = snakeArr[0].col;

    snakeHead.appendChild(snakeEye1);
    snakeHead.appendChild(snakeEye2);

    gameBoardRef.appendChild(snakeHead);
}

const changeSnakeDirection = (e) => {
    if (gameMusicAudio.paused) {
        gameMusicAudio.play();
    }
    switch (e.key) {
        case 'ArrowUp':
            direction.x = 0;
            direction.y = -1;
            document.querySelector('#snake-head').style.flexDirection = 'row';
            break;
        case 'ArrowDown':
            direction.x = 0;
            direction.y = 1;
            document.querySelector('#snake-head').style.flexDirection = 'row';
            break;
        case 'ArrowRight':
            direction.x = 1;
            direction.y = 0;
            document.querySelector('#snake-head').style.flexDirection = 'column';
            break;
        case 'ArrowLeft':
            direction.x = -1;
            direction.y = 0;
            document.querySelector('#snake-head').style.flexDirection = 'column';
    }
    snakeMoveAudio.play();
}

const main = () => {
    createSnake();
    generateFood();
    showHiscore();
    gameLoop();
}

// event handler
window.addEventListener('keydown', changeSnakeDirection);

// main function
main();