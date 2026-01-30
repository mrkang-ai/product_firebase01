document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const timeEl = document.getElementById('time');
    const scoreEl = document.getElementById('score');
    const rankingListEl = document.getElementById('ranking-list');

    let gameState = 'notStarted'; // notStarted, playing, gameOver
    let stop = false;
    let animationFrameId;

    function resizeCanvas() {
        // Set a large, fixed size for the canvas
        canvas.width = 1000; // Example large width
        canvas.height = 800; // Example large height

        // Ensure player position is updated if canvas size changes during game
        player.x = canvas.width / 2 - player.width / 2;
        player.y = canvas.height - player.height - 10;
    }

    const images = {
        character: 'images/character.png',
        carrot: 'images/carrot.png',
        banana: 'images/banana.png',
        bread: 'images/bread.png',
        cake: 'images/cake.png',
        meat: 'images/meat.png',
        cloud_l: 'images/cloud_l.png',
        cloud_s: 'images/cloud_s.png'
    };

    let loadedImages = {};
    let imagesToLoad = Object.keys(images).length;
    let imagesLoadedCount = 0;

    function imageLoaded() {
        imagesLoadedCount++;
        if (imagesLoadedCount === imagesToLoad) {
            initGame();
        }
    }

    for (const key in images) {
        loadedImages[key] = new Image();
        loadedImages[key].src = images[key];
        loadedImages[key].onload = imageLoaded;
    }

    const player = {
        width: 40,
        height: 60,
        speed: 10,
        dx: 0,
        x: 0,
        y: 0
    };

    let items = [];
    const INITIAL_ITEM_SPEED = 2.5;
    const MAX_ITEM_SPEED = INITIAL_ITEM_SPEED * 5; // Max speed is 5x initial
    const SPEED_INCREASE_INTERVAL = 5; // seconds
    const SPEED_INCREASE_PERCENTAGE = 0.20; // 20%
    let itemSpeed = INITIAL_ITEM_SPEED;
    let itemSpawnRate = 35;

    let clouds = [];
    const cloudSpeed = 0.5;
    const cloudSpawnRate = 120;

    let frameCount = 0;
    let score = 0;
    let startTime;
    let elapsedTime = 0;
    let lastSpeedIncreaseTime = 0;

    const foodTypes = [
        { type: 'banana', img: loadedImages.banana, width: 30, height: 30, points: 1, weight: 40 },
        { type: 'bread', img: loadedImages.bread, width: 40, height: 30, points: 2, weight: 30 },
        { type: 'meat', img: loadedImages.meat, width: 50, height: 40, points: 5, weight: 15 },
        { type: 'cake', img: loadedImages.cake, width: 45, height: 45, points: 10, weight: 5 }
    ];
    const carrotType = { type: 'carrot', img: loadedImages.carrot, width: 30, height: 50, points: 'gameover' };
    
    const totalFoodWeight = foodTypes.reduce((sum, food) => sum + food.weight, 0);


    function resetGame() {
        player.x = canvas.width / 2 - player.width / 2;
        player.y = canvas.height - player.height - 10;
        player.dx = 0;
        items = [];
        clouds = [];
        frameCount = 0;
        score = 0;
        elapsedTime = 0;
        itemSpeed = INITIAL_ITEM_SPEED;
        lastSpeedIncreaseTime = 0;
        stop = false;
        startTime = Date.now();
        updateUI();
    }
    
    function startGame() {
        if (gameState !== 'playing') {
            gameState = 'playing';
            resetGame();
            if(animationFrameId) cancelAnimationFrame(animationFrameId);
            update();
        }
    }

    function gameOver() {
        gameState = 'gameOver';
        stop = true;
        cancelAnimationFrame(animationFrameId);
        
        setTimeout(() => {
            const rankings = getRankings();
            const isHighScore = rankings.length < 10 || score > rankings[rankings.length - 1].score;
            
            if (isHighScore) {
                const name = prompt(`최고 기록 달성! ${score}점\n랭킹에 등록할 이름을 입력하세요:`);
                if (name) {
                    saveRanking(name, score);
                    displayRanking();
                }
            }
            drawGameOverScreen();
        }, 100);
    }

    function drawPlayer() {
        ctx.drawImage(loadedImages.character, player.x, player.y, player.width, player.height);
    }

    function drawItems() {
        items.forEach(item => {
            if (item.type === 'carrot') {
                ctx.save();
                ctx.shadowColor = 'green';
                ctx.shadowBlur = 10;
                ctx.strokeStyle = 'lightgreen';
                ctx.lineWidth = 4;
                ctx.strokeRect(item.x, item.y, item.width, item.height);
                ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
                ctx.restore();
            } else {
                ctx.drawImage(item.img, item.x, item.y, item.width, item.height);
            }
        });
    }
    
    function drawClouds() {
        clouds.forEach(cloud => {
            ctx.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height);
        });
    }

    function drawStartScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Press Space to Start', canvas.width / 2, canvas.height / 2);
    }
    
    function drawGameOverScreen() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 2 + 10);
        ctx.font = '20px Arial';
        ctx.fillText('Press Space to Play Again', canvas.width / 2, canvas.height / 2 + 60);
    }

    function updateUI() {
        scoreEl.textContent = score;
        timeEl.textContent = elapsedTime;
    }
    
    function movePlayer() {
        player.x += player.dx;
        if (player.x < 0) player.x = 0;
        if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    }

    function getWeightedRandomFood() {
        let random = Math.random() * totalFoodWeight;
        for(const food of foodTypes) {
            if (random < food.weight) {
                return food;
            }
            random -= food.weight;
        }
    }

    function createItem() {
        const x = Math.random() * (canvas.width - 60) + 10;
        // Carrot appears roughly 33% of the time, food 66%
        // And carrot is 2x more likely than all food items.
        const isCarrot = Math.random() < 0.5;

        let itemProto;
        if (isCarrot) {
            itemProto = carrotType;
        } else {
            itemProto = getWeightedRandomFood();
        }
        
        items.push({ ...itemProto, x, y: -itemProto.height });
    }

    function updateItems() {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            item.y += itemSpeed;
            if (item.y > canvas.height) {
                items.splice(i, 1);
            }
        }
    }
    
    function createCloud() {
        const isLarge = Math.random() > 0.5;
        const img = isLarge ? loadedImages.cloud_l : loadedImages.cloud_s;
        const width = isLarge ? 120 : 80;
        const height = isLarge ? 60 : 40;
        clouds.push({ x: canvas.width, y: Math.random() * (canvas.height / 2.5), width, height, img });
    }

    function updateClouds() {
        for (let i = clouds.length - 1; i >= 0; i--) {
            const cloud = clouds[i];
            cloud.x -= cloudSpeed;
            if (cloud.x + cloud.width < 0) {
                clouds.splice(i, 1);
            }
        }
    }

    function checkCollisions() {
        for (let i = items.length - 1; i >= 0; i--) {
            const item = items[i];
            if (player.x < item.x + item.width &&
                player.x + player.width > item.x &&
                player.y < item.y + item.height &&
                player.y + player.height > item.y) {
                
                if (item.points === 'gameover') {
                    gameOver();
                    return;
                } else {
                    score += item.points;
                    items.splice(i, 1);
                    updateUI();
                }
            }
        }
    }
    
    function updateGameSpeed() {
        if (Math.floor(elapsedTime) > lastSpeedIncreaseTime + SPEED_INCREASE_INTERVAL) {
            lastSpeedIncreaseTime = Math.floor(elapsedTime);
            if (itemSpeed < MAX_ITEM_SPEED) {
                itemSpeed *= (1 + SPEED_INCREASE_PERCENTAGE);
                 if (itemSpeed > MAX_ITEM_SPEED) {
                    itemSpeed = MAX_ITEM_SPEED;
                }
            }
        }
    }

    function getRankings() {
        return JSON.parse(localStorage.getItem('carrotDodgerRanking')) || [];
    }

    function saveRanking(name, score) {
        let rankings = getRankings();
        rankings.push({ name, score: Math.round(score) });
        rankings.sort((a, b) => b.score - a.score);
        rankings = rankings.slice(0, 10);
        localStorage.setItem('carrotDodgerRanking', JSON.stringify(rankings));
    }

    function displayRanking() {
        rankingListEl.innerHTML = '';
        const rankings = getRankings();
        if(rankings.length === 0) {
            rankingListEl.innerHTML = '<li>No scores yet!</li>'
        } else {
            rankings.forEach((r, i) => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${i + 1}.</strong> ${r.name} - ${r.score}`;
                rankingListEl.appendChild(li);
            });
        }
    }

    function update() {
        if (stop) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        updateUI();

        if (frameCount % cloudSpawnRate === 0) createCloud();
        updateClouds();
        drawClouds();
        
        updateGameSpeed();
        movePlayer();
        
        if (frameCount % itemSpawnRate === 0) createItem();
        updateItems();
        
        drawPlayer();
        drawItems();
        
        checkCollisions();

        frameCount++;
        animationFrameId = requestAnimationFrame(update);
    }
    
    function keyDown(e) {
        if (e.code === 'Space') {
            e.preventDefault();
            if (gameState === 'notStarted' || gameState === 'gameOver') {
                startGame();
            }
        }
        if (gameState === 'playing') {
            if (e.key === 'ArrowRight' || e.key === 'Right') player.dx = player.speed;
            else if (e.key === 'ArrowLeft' || e.key === 'Left') player.dx = -player.speed;
        }
    }

    function keyUp(e) {
        if (e.key === 'ArrowRight' || e.key === 'Right' || e.key === 'ArrowLeft' || e.key === 'Left') {
            player.dx = 0;
        }
    }
    
    function initGame() {
        resizeCanvas();
        displayRanking();
        drawStartScreen();
        
        setTimeout(() => {
            resizeCanvas();
            player.x = canvas.width / 2 - player.width / 2;
            player.y = canvas.height - player.height - 10;
            drawStartScreen();
        }, 500); 
    }

    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);
});
