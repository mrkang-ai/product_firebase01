const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.querySelector('.header').offsetHeight;

let gameState = 'notStarted'; // can be notStarted, playing, gameOver

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    color: 'blue',
    speed: 10,
    dx: 0
};

let enemies = [];
const enemySpeed = 5;
const enemySpawnRate = 20; // Lower is faster
let frameCount = 0;
let startTime;
let elapsedTime = 0;

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
    player.x += player.dx;

    // Wall detection
    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function createEnemy() {
    const x = Math.random() * (canvas.width - 30);
    const y = -30;
    const width = 30;
    const height = 30;
    const color = 'red';
    enemies.push({ x, y, width, height, color });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function updateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemySpeed;
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function isCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function checkCollisions() {
    enemies.forEach(enemy => {
        if (isCollision(player, enemy)) {
            gameState = 'gameOver';
        }
    });
}

function drawTimer() {
    if (gameState === 'playing') {
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    }
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Time: ${elapsedTime}`, 10, 30);
}

function drawStartScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2);
}

function resetGame() {
    player.x = canvas.width / 2 - 25;
    player.y = canvas.height - 50;
    player.dx = 0;
    enemies = [];
    frameCount = 0;
    elapsedTime = 0;
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'notStarted') {
        drawStartScreen();
    } else if (gameState === 'playing') {
        drawPlayer();
        movePlayer();

        frameCount++;
        if (frameCount % enemySpawnRate === 0) {
            createEnemy();
        }
        drawEnemies();
        updateEnemies();

        checkCollisions();
    } else if (gameState === 'gameOver') {
        alert(`Game Over!\nYour time: ${elapsedTime} seconds`);
        resetGame();
        document.location.reload();
    }

    drawTimer();
    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.code === 'Space' && gameState === 'notStarted') {
        gameState = 'playing';
        startTime = Date.now();
    }
    if (gameState === 'playing') {
        if (e.key === 'ArrowRight' || e.key === 'Right') {
            player.dx = player.speed;
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
            player.dx = -player.speed;
        }
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' ||
        e.key === 'Right' ||
        e.key === 'ArrowLeft' ||
        e.key === 'Left'
    ) {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

update();
