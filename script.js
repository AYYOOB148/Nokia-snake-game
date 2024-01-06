// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Define game variables
const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

// Touch variables
let touchStartX, touchStartY, touchEndX, touchEndY;

// Touch event listeners
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);

// Key press event listener
function handleKeyPress(event) {
  if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
    startGame();
  } else {
    handleDirectionChange(event);
  }
}

// Touch event handlers
function handleTouchStart(event) {
  if (event.touches.length === 1) {
    touchStartX = event.touches[0].pageX;
    touchStartY = event.touches[0].pageY;
  }
}

function handleTouchMove(event) {
  event.preventDefault();
}

function handleTouchEnd(event) {
  if (event.changedTouches.length === 1) {
    touchEndX = event.changedTouches[0].pageX;
    touchEndY = event.changedTouches[0].pageY;
    handleSwipe();
  }
}

// Swipe handling
function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0) {
      // Swipe right
      direction = 'right';
    } else {
      // Swipe left
      direction = 'left';
    }
  } else {
    // Vertical swipe
    if (deltaY > 0) {
      // Swipe down
      direction = 'down';
    } else {
      // Swipe up
      direction = 'up';
    }
  }
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

// Set the position of snake or food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

// Generate food
function generateFood() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

// Draw game map, snake, food
function draw() {
  board.innerHTML = '';
  drawSnake();
  drawFood();
  updateScore();
}

// Draw snake
function drawSnake() {
  snake.forEach((segment) => {
    const snakeElement = createGameElement('div', 'snake');
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
}

// Draw food function
function drawFood() {
  if (gameStarted) {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

// Moving the snake
function move() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up':
      head.y--;
      break;
    case 'down':
      head.y++;
      break;
    case 'left':
      head.x--;
      break;
    case 'right':
      head.x++;
      break;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    handleFoodCollision();
  } else {
    snake.pop();
  }

  checkCollision();
}

// Handle collision with food
function handleFoodCollision() {
  food = generateFood();
  increaseSpeed();
}

// Start game function
function startGame() {
  gameStarted = true;
  instructionText.style.display = 'none';
  logo.style.display = 'none';
  gameInterval = setInterval(() => {
    move();
    draw();
  }, gameSpeedDelay);
}

// Handle direction change
function handleDirectionChange(event) {
  switch (event.key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      direction = 'up';
      break;
    case 'ArrowDown':
    case 's':
    case 'S':
      direction = 'down';
      break;
    case 'ArrowLeft':
    case 'a':
    case 'A':
      direction = 'left';
      break;
    case 'ArrowRight':
    case 'd':
    case 'D':
      direction = 'right';
      break;
  }
}

document.addEventListener('keydown', handleKeyPress);

// Increase game speed
function increaseSpeed() {
  if (gameSpeedDelay > 150) {
    gameSpeedDelay -= 5;
  } else if (gameSpeedDelay > 100) {
    gameSpeedDelay -= 3;
  } else if (gameSpeedDelay > 50) {
    gameSpeedDelay -= 2;
  } else if (gameSpeedDelay > 25) {
    gameSpeedDelay -= 1;
  }
}

// Check collision with walls and self
function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// Reset the game state
function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

// Update the displayed score
function updateScore() {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, '0');
}

// Stop the game loop
function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = 'block';
  logo.style.display = 'block';
}

// Update the high score if needed
function updateHighScore() {
  const currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}

