const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.querySelector('.header').offsetHeight;

let gameState = 'notStarted'; // can be notStarted, playing, gameOver
let stop = false;

// Image loading
const characterImg = new Image();
characterImg.src = 'images/character.png';
const carrotImg = new Image();
carrotImg.src = 'images/carrot.png';
const cloudLImg = new Image();
cloudLImg.src = 'images/cloud_l.png';
const cloudSImg = new Image();
cloudSImg.src = 'images/cloud_s.png';

let imagesLoaded = 0;
const totalImages = 4;

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        update(); // Start the game loop after all images are loaded
    }
}

characterImg.onload = imageLoaded;
carrotImg.onload = imageLoaded;
cloudLImg.onload = imageLoaded;
cloudSImg.onload = imageLoaded;


const player = {
    x: canvas.width / 2 - 20, // Adjusted width
    y: canvas.height - 60, // Adjusted height
    width: 40,
    height: 60,
    speed: 10,
    dx: 0
};

let enemies = [];
const INITIAL_ENEMY_SPEED = 5;
const MAX_ENEMY_SPEED = INITIAL_ENEMY_SPEED * 5;
const SPEED_INCREASE_INTERVAL = 5; // seconds
const SPEED_INCREASE_PERCENTAGE = 0.10; // 10%
let enemySpeed = INITIAL_ENEMY_SPEED;
const enemySpawnRate = 20; // Lower is faster

let clouds = [];
const cloudSpeed = 1;
const cloudSpawnRate = 100;

let frameCount = 0;
let startTime;
let elapsedTime = 0;
let lastSpeedIncreaseTime = 0;

function drawPlayer() {
    ctx.drawImage(characterImg, player.x, player.y, player.width, player.height);
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
    const y = -50; // Adjusted height for carrot
    const width = 30;
    const height = 50; // Carrot-like shape
    enemies.push({ x, y, width, height });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.drawImage(carrotImg, enemy.x, enemy.y, enemy.width, enemy.height);
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

function createCloud() {
    const x = canvas.width;
    const y = Math.random() * (canvas.height / 2);
    const isLarge = Math.random() > 0.5;
    const img = isLarge ? cloudLImg : cloudSImg;
    const width = isLarge ? 120 : 80;
    const height = isLarge ? 70 : 50;
    clouds.push({ x, y, width, height, img });
}

function drawClouds() {
    clouds.forEach(cloud => {
        ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
    });
}

function updateClouds() {
    clouds.forEach((cloud, index) => {
        cloud.x -= cloudSpeed;
        if (cloud.x + cloud.width < 0) {
            clouds.splice(index, 1);
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

function updateGameSpeed() {
    if (elapsedTime > lastSpeedIncreaseTime + SPEED_INCREASE_INTERVAL) {
        lastSpeedIncreaseTime = elapsedTime;
        if (enemySpeed < MAX_ENEMY_SPEED) {
            enemySpeed *= (1 + SPEED_INCREASE_PERCENTAGE);
            if (enemySpeed > MAX_ENEMY_SPEED) {
                enemySpeed = MAX_ENEMY_SPEED;
            }
        }
    }
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
    player.x = canvas.width / 2 - 20; // Adjusted width
    player.y = canvas.height - 60; // Adjusted height
    player.dx = 0;
    enemies = [];
    clouds = [];
    frameCount = 0;
    elapsedTime = 0;
    enemySpeed = INITIAL_ENEMY_SPEED;
    lastSpeedIncreaseTime = 0;
}

function update() {
    if (stop) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#87CEEB'; // Sky blue
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawClouds();


    if (gameState === 'notStarted') {
        drawStartScreen();
    } else if (gameState === 'playing') {
        updateClouds();
        if (frameCount % cloudSpawnRate === 0) {
            createCloud();
        }

        updateGameSpeed();

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
        stop = true;
        alert(`Game Over!\nYour time: ${elapsedTime} seconds`);
        document.location.reload();
        return;
    }

    drawTimer();
    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.code === 'Space' && gameState === 'notStarted') {
        gameState = 'playing';
        startTime = Date.now();
        resetGame(); // Reset game elements before starting
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
