const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = document.body.clientWidth;

const header = document.querySelector('header');
const h1 = document.querySelector('h1');
const gameInfo = document.querySelector('.game-info-container');
const headerHeight = header ? header.offsetHeight : 0;
const h1Height = h1 ? h1.offsetHeight : 0;
const gameInfoHeight = gameInfo ? gameInfo.offsetHeight : 0;
const extraSpace = 40; // For margins and padding
canvas.height = window.innerHeight - headerHeight - h1Height - gameInfoHeight - extraSpace;

let gameState = 'notStarted'; // can be notStarted, playing, gameOver
let stop = false;

// Image loading
const characterImg = new Image();
characterImg.src = 'images/character.png';
const carrotImg = new Image();
carrotImg.src = 'images/carrot.png';
const bananaImg = new Image();
bananaImg.src = 'images/banana.png';
const breadImg = new Image();
breadImg.src = 'images/bread.png';
const cakeImg = new Image();
cakeImg.src = 'images/cake.png';
const meatImg = new Image();
meatImg.src = 'images/meat.png';
const cloudLImg = new Image();
cloudLImg.src = 'images/cloud_l.png';
const cloudSImg = new Image();
cloudSImg.src = 'images/cloud_s.png';

let imagesLoaded = 0;
const totalImages = 8;

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        update(); // Start the game loop after all images are loaded
    }
}

characterImg.onload = imageLoaded;
carrotImg.onload = imageLoaded;
bananaImg.onload = imageLoaded;
breadImg.onload = imageLoaded;
cakeImg.onload = imageLoaded;
meatImg.onload = imageLoaded;
cloudLImg.onload = imageLoaded;
cloudSImg.onload = imageLoaded;


const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 60,
    speed: 10,
    dx: 0
};

let items = [];
const INITIAL_ITEM_SPEED = 3;
const MAX_ITEM_SPEED = INITIAL_ITEM_SPEED * 3;
const SPEED_INCREASE_INTERVAL = 10; // seconds
const SPEED_INCREASE_PERCENTAGE = 0.10; // 10%
let itemSpeed = INITIAL_ITEM_SPEED;
const itemSpawnRate = 30; // Lower is faster

let clouds = [];
const cloudSpeed = 1;
const cloudSpawnRate = 100;

let frameCount = 0;
let score = 0;
let startTime;
let elapsedTime = 0;
let lastSpeedIncreaseTime = 0;

const foodTypes = [
    { type: 'banana', img: bananaImg, width: 30, height: 30, points: 1 },
    { type: 'bread', img: breadImg, width: 40, height: 40, points: 2 },
    { type: 'meat', img: meatImg, width: 50, height: 50, points: 5 },
    { type: 'cake', img: cakeImg, width: 60, height: 60, points: 10 }
];
const carrotType = { type: 'carrot', img: carrotImg, width: 30, height: 50, points: 'gameover' };

function drawPlayer() {
    ctx.drawImage(characterImg, player.x, player.y, player.width, player.height);
}

function movePlayer() {
    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function createItem() {
    const x = Math.random() * (canvas.width - 60);
    const y = -60;
    let item;

    // 20% chance of being a carrot
    if (Math.random() < 0.2) {
        item = { ...carrotType };
    } else {
        item = { ...foodTypes[Math.floor(Math.random() * foodTypes.length)] };
    }
    item.x = x;
    item.y = y;
    items.push(item);
}

function drawItems() {
    items.forEach(item => {
        ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
    });
}

function updateItems() {
    items.forEach((item, index) => {
        item.y += itemSpeed;
        if (item.y > canvas.height) {
            items.splice(index, 1);
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
    items.forEach((item, index) => {
        if (isCollision(player, item)) {
            if (item.points === 'gameover') {
                gameState = 'gameOver';
            } else {
                score += item.points;
                items.splice(index, 1);
            }
        }
    });
}

function updateGameSpeed() {
    if (elapsedTime > lastSpeedIncreaseTime + SPEED_INCREASE_INTERVAL) {
        lastSpeedIncreaseTime = elapsedTime;
        if (itemSpeed < MAX_ITEM_SPEED) {
            itemSpeed *= (1 + SPEED_INCREASE_PERCENTAGE);
            if (itemSpeed > MAX_ITEM_SPEED) {
                itemSpeed = MAX_ITEM_SPEED;
            }
        }
    }
}

function drawScore() {
    ctx.font = '24px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText(`Score: ${score}`, 10, 30);
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
    player.x = canvas.width / 2 - 20;
    player.y = canvas.height - 60;
    player.dx = 0;
    items = [];
    clouds = [];
    frameCount = 0;
    score = 0;
    elapsedTime = 0;
    itemSpeed = INITIAL_ITEM_SPEED;
    lastSpeedIncreaseTime = 0;
}

function saveRanking(name, score) {
    let rankings = JSON.parse(localStorage.getItem('carrotDodgerRanking')) || [];
    rankings.push({ name, score });
    rankings.sort((a, b) => b.score - a.score);
    rankings = rankings.slice(0, 10); // Top 10
    localStorage.setItem('carrotDodgerRanking', JSON.stringify(rankings));
}

function displayRanking() {
    const rankingList = document.getElementById('ranking-list');
    rankingList.innerHTML = '';
    let rankings = JSON.parse(localStorage.getItem('carrotDodgerRanking')) || [];
    rankings.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.name}: ${entry.score}`;
        rankingList.appendChild(li);
    });
}


function update() {
    if (stop) {
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#87CEEB';
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
        if (frameCount % itemSpawnRate === 0) {
            createItem();
        }
        drawItems();
        updateItems();

        checkCollisions();
    } else if (gameState === 'gameOver') {
        stop = true;
        const name = prompt(`Game Over!\nYour score: ${score}\nEnter your name for the ranking:`);
        if (name) {
            saveRanking(name, score);
        }
        displayRanking();
        document.location.reload();
        return;
    }

    drawScore();
    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.code === 'Space' && gameState === 'notStarted') {
        gameState = 'playing';
        startTime = Date.now();
        resetGame();
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

document.addEventListener('DOMContentLoaded', displayRanking);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
