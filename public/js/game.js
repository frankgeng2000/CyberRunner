
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas.getContext('2d');
  const scoreEl = document.getElementById('score');
  const highScoreEl = document.getElementById('high-score');
  const startScreen = document.getElementById('start-screen');
  const gameOverScreen = document.getElementById('game-over-screen');
  const winScreen = document.getElementById('win-screen');
  const pauseButton = document.getElementById('pause-button');

  const DINO_WIDTH = 20;
  const DINO_HEIGHT = 50;
  const DINO_DUCK_HEIGHT = 25;
  const OBSTACLE_WIDTH = 20;
  const OBSTACLE_HEIGHT = 50;

  let isGameOver = false;
  let isPaused = false;

  let dino = {
    x: 50,
    y: canvas.height - DINO_HEIGHT,
    width: DINO_WIDTH,
    height: DINO_HEIGHT,
    velocityY: 0,
    isJumping: false,
    isDucking: false,
    jumpCount: 0,
    canDoubleJump: false,
    velocityX: 0,
    speed: 5
  };

  let obstacles = [];
  let frame = 0;
  let score = 0;
  let highScore = 0;
  let gameSpeed = 4;
  let spawnInterval = 100;

  function startGame() {
    isGameOver = false;
    isPaused = false;
    score = 0;
    obstacles = [];
    gameSpeed = 4;
    spawnInterval = 100;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    pauseButton.textContent = 'Pause';
    gameLoop();
  }

  function gameOver() {
    isGameOver = true;
    if (score > highScore) {
      highScore = score;
    }
    highScoreEl.textContent = 'HI: ' + highScore;
    gameOverScreen.style.display = 'flex';
  }

  function win() {
      isGameOver = true;
      winScreen.style.display = 'flex';
  }

  function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    if (!isPaused) {
      gameLoop();
    }
  }

  function init() {
    highScoreEl.textContent = 'HI: ' + highScore;
    startScreen.addEventListener('click', startGame);
    gameOverScreen.addEventListener('click', startGame);
    pauseButton.addEventListener('click', togglePause);
  }

  function jump() {
    if (!dino.isJumping && !dino.isDucking) {
      dino.isJumping = true;
      dino.velocityY = -12;
      dino.jumpCount = 1;
      dino.canDoubleJump = true;
    } else if (dino.canDoubleJump) {
      dino.velocityY = -12;
      dino.canDoubleJump = false;
    }
  }

  function duck(isDucking) {
    dino.isDucking = isDucking;
  }

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      togglePause();
      return;
    }

    if (isGameOver || startScreen.style.display !== 'none' || isPaused) {
      if (isGameOver || startScreen.style.display !== 'none') {
        startGame();
      }
      return;
    }

    if (e.code === 'Space' || e.code === 'ArrowUp') {
      jump();
    } else if (e.code === 'ArrowDown') {
      duck(true);
    } else if (e.code === 'ArrowLeft') {
      dino.velocityX = -dino.speed;
    } else if (e.code === 'ArrowRight') {
      dino.velocityX = dino.speed;
    }
  });

  document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowDown') {
      duck(false);
    } else if (e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
      dino.velocityX = 0;
    }
  });

  function drawCyberCat() {
    ctx.save();
    ctx.translate(dino.x, dino.y);

    if (dino.isDucking) {
      // Draw ducking cat
      ctx.fillStyle = '#00ffff';
      ctx.beginPath();
      ctx.ellipse(dino.width / 2, dino.height - DINO_DUCK_HEIGHT / 2, dino.width / 2, DINO_DUCK_HEIGHT / 2, 0, 0, Math.PI * 2);
      ctx.fill();

    } else {
      // Draw standing cat
      ctx.fillStyle = '#00ffff';
      // Body
      ctx.beginPath();
      ctx.ellipse(dino.width / 2, dino.height / 2, dino.width / 2, dino.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.beginPath();
      ctx.ellipse(dino.width / 2, dino.height * 0.2, dino.width * 0.3, dino.height * 0.2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Ears
      ctx.beginPath();
      ctx.moveTo(dino.width * 0.3, dino.height * 0.1);
      ctx.lineTo(dino.width * 0.4, -10);
      ctx.lineTo(dino.width * 0.5, dino.height * 0.1);
      ctx.moveTo(dino.width * 0.7, dino.height * 0.1);
      ctx.lineTo(dino.width * 0.6, -10);
      ctx.lineTo(dino.width * 0.5, dino.height * 0.1);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
      const obstacle = obstacles[i];
      ctx.lineWidth = 2;

      if (obstacle.isBird) { // Drone
        ctx.strokeStyle = '#ff00ff'; // Magenta
        // Body
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.ellipse(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, obstacle.height / 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cockpit
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.ellipse(obstacle.x + obstacle.width * 0.7, obstacle.y + obstacle.height / 2, obstacle.width * 0.2, obstacle.height * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Propellers
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(obstacle.x + obstacle.width * 0.2, obstacle.y);
        ctx.lineTo(obstacle.x + obstacle.width * 0.2, obstacle.y - 10);
        ctx.moveTo(obstacle.x + obstacle.width * 0.8, obstacle.y);
        ctx.lineTo(obstacle.x + obstacle.width * 0.8, obstacle.y - 10);
        ctx.stroke();

      } else { // Pylon
        ctx.strokeStyle = '#00ffff'; // Cyan
        // Base
        ctx.fillStyle = '#1a1a3a';
        ctx.beginPath();
        ctx.moveTo(obstacle.x, obstacle.y + obstacle.height);
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
        ctx.lineTo(obstacle.x + obstacle.width * 0.8, obstacle.y);
        ctx.lineTo(obstacle.x + obstacle.width * 0.2, obstacle.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Energy Core
        const pulse = Math.sin(Date.now() * 0.005 + i) * 2;
        ctx.fillStyle = '#ff00ff';
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width * 0.2 + pulse, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawGround() {
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    const groundY = canvas.height - 20;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();

    // Grid effect
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      const y = groundY + (i * 2);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function createObstacle() {
    let obstacleType = Math.random();
    let newObstacle = {
      x: canvas.width,
      width: OBSTACLE_WIDTH,
      speed: gameSpeed
    };

    if (obstacleType < 0.6) { // 60% chance of ground obstacle
      let isTall = Math.random() < 0.2;
      newObstacle.y = canvas.height - (isTall ? 90 : OBSTACLE_HEIGHT);
      newObstacle.height = isTall ? 90 : OBSTACLE_HEIGHT;
      newObstacle.isBird = false;
    } else if (obstacleType < 0.9) { // 30% chance of bird
      newObstacle.y = canvas.height - DINO_HEIGHT - 10;
      newObstacle.height = 20;
      newObstacle.isBird = true;
      newObstacle.speed = gameSpeed + Math.random() * 2 - 1;
    } else { // 10% chance of high bird
      newObstacle.y = canvas.height - 150;
      newObstacle.height = 20;
      newObstacle.isBird = true;
      newObstacle.speed = gameSpeed + Math.random() * 2 - 1;
    }
    obstacles.push(newObstacle);
  }

  function update() {
    // Update dino position
    dino.x += dino.velocityX;
    if (dino.isJumping) {
      dino.y += dino.velocityY;
      dino.velocityY += 0.8;
      if (dino.y >= canvas.height - DINO_HEIGHT) {
        dino.y = canvas.height - DINO_HEIGHT;
        dino.isJumping = false;
        dino.jumpCount = 0;
      }
    } else {
      dino.wheelRotation += gameSpeed * 0.1;
    }

    if (dino.x < 0) {
      dino.x = 0;
    }

    if (dino.x + dino.width > canvas.width) {
      dino.x = canvas.width - dino.width;
    }

    // Increase game speed and difficulty
    if (frame > 0 && frame % 500 === 0) {
      gameSpeed += 0.5;
      if (spawnInterval > 60) {
          spawnInterval -= 5;
      }
    }

    // Spawn obstacles
    if (frame % spawnInterval === 0 && (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200)) {
        createObstacle();
      }

    // Move obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      obstacles[i].x -= obstacles[i].speed;
      if (obstacles[i].x + obstacles[i].width < 0) {
        obstacles.splice(i, 1);
        score++;
      }
    }

    // Collision detection
    let dinoHeight = dino.isDucking ? DINO_DUCK_HEIGHT : DINO_HEIGHT;
    let dinoY = dino.isDucking ? canvas.height - DINO_DUCK_HEIGHT : dino.y;

    for (let i = 0; i < obstacles.length; i++) {
      if (
        dino.x < obstacles[i].x + obstacles[i].width &&
        dino.x + dino.width > obstacles[i].x &&
        dinoY < obstacles[i].y + obstacles[i].height &&
        dinoY + dinoHeight > obstacles[i].y
      ) {
        gameOver();
      }
    }

    frame++;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawCyberCat();
    drawObstacles();
    scoreEl.textContent = 'SCORE: ' + score;
  }

  function gameLoop() {
    if (isGameOver || isPaused) {
      if (isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '30px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
      }
      return;
    }
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }

  init();
});
