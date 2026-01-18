const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.querySelector('.header').offsetHeight;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    color: 'blue',
    speed: 10,
    dx: 0
};

const enemies = [];
const enemySpeed = 5;
const enemySpawnRate = 20; // Lower is faster
let frameCount = 0;
let startTime = Date.now();
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
            gameOver();
        }
    });
}

function drawTimer() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Time: ${elapsedTime}`, 10, 30);
}

function gameOver() {
    alert(`Game Over!\nYour time: ${elapsedTime} seconds`);
    document.location.reload();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    movePlayer();

    frameCount++;
    if (frameCount % enemySpawnRate === 0) {
        createEnemy();
    }
    drawEnemies();
    updateEnemies();

    checkCollisions();
    drawTimer();

    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        player.dx = -player.speed;
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
