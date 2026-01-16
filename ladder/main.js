document.addEventListener('DOMContentLoaded', () => {
    const playerCountInput = document.getElementById('player-count');
    const startGameBtn = document.getElementById('start-game');
    const playersDiv = document.getElementById('players');
    const resultsDiv = document.getElementById('results');
    const setupDiv = document.getElementById('setup');
    const gameContainer = document.getElementById('game-container');
    const canvas = document.getElementById('ladder-canvas');
    const ctx = canvas.getContext('2d');
    const resultDisplay = document.getElementById('result-display');
    const resetGameBtn = document.getElementById('reset-game');
    const toggleRungsBtn = document.getElementById('toggle-rungs');
    const startButtonsDiv = document.getElementById('start-buttons');

    let players = [];
    let results = [];
    let ladder;
    let areRungsVisible = false;
    let playerStarted = [];
    let playedCount = 0;

    function updatePlayerInputs() {
        const count = parseInt(playerCountInput.value, 10);
        playersDiv.innerHTML = '<h2>참가자</h2>';
        resultsDiv.innerHTML = '<h2>결과</h2>';
        players = [];
        results = [];

        for (let i = 1; i <= count; i++) {
            const playerName = `참가자 ${i}`;
            const resultName = `결과 ${i}`;
            players.push(playerName);
            results.push(resultName);

            const newPlayerInput = document.createElement('input');
            newPlayerInput.type = 'text';
            newPlayerInput.placeholder = playerName;
            newPlayerInput.value = playerName;
            playersDiv.appendChild(newPlayerInput);

            const newResultInput = document.createElement('input');
            newResultInput.type = 'text';
            newResultInput.placeholder = resultName;
            newResultInput.value = resultName;
            resultsDiv.appendChild(newResultInput);
        }
    }

    playerCountInput.addEventListener('input', updatePlayerInputs);

    startGameBtn.addEventListener('click', () => {
        const playerInputs = playersDiv.querySelectorAll('input');
        const resultInputs = resultsDiv.querySelectorAll('input');
        players = Array.from(playerInputs).map(input => input.value);
        results = Array.from(resultInputs).map(input => input.value);

        setupDiv.style.display = 'none';
        gameContainer.style.display = 'flex';

        const numPlayers = players.length;
        playerStarted = Array(numPlayers).fill(false);
        playedCount = 0;

        const ladderWidth = numPlayers * 100;
        const ladderHeight = 500;
        canvas.width = ladderWidth;
        canvas.height = ladderHeight;

        areRungsVisible = false;
        toggleRungsBtn.textContent = '사다리 보이기';
        resultDisplay.innerHTML = '';

        generateLadder(numPlayers, ladderHeight);
        createStartButtons();
        drawLadder();
    });

    resetGameBtn.addEventListener('click', () => {
        setupDiv.style.display = 'block';
        gameContainer.style.display = 'none';
    });

    toggleRungsBtn.addEventListener('click', () => {
        areRungsVisible = !areRungsVisible;
        toggleRungsBtn.textContent = areRungsVisible ? '사다리 감추기' : '사다리 보이기';
        drawLadder();
    });

    function createStartButtons() {
        startButtonsDiv.innerHTML = '';
        players.forEach((player, i) => {
            const button = document.createElement('button');
            button.textContent = '시작';
            button.dataset.playerIndex = i;
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.playerIndex, 10);
                if (!playerStarted[index]) {
                    animatePath(index);
                }
            });
            startButtonsDiv.appendChild(button);
        });
    }

    function generateLadder(numPlayers, height) {
        ladder = Array(numPlayers).fill(0).map(() => Array(height).fill(0));
        const rungCount = Math.floor(numPlayers * 2.5);

        for (let i = 0; i < rungCount; i++) {
            const x = Math.floor(Math.random() * (numPlayers - 1));
            const y = Math.floor(Math.random() * (height - 80)) + 40;

            let isOccupied = false;
            for(let checkY = Math.max(0, y - 15); checkY < Math.min(height, y + 15); checkY++) {
                if(ladder[x][checkY] !== 0 || (ladder[x+1] && ladder[x+1][checkY] !== 0)) {
                    isOccupied = true;
                    break;
                }
            }
            
            if (!isOccupied) {
                ladder[x][y] = 1;
                ladder[x + 1][y] = -1;
            }
        }
    }

    function drawLadder() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';

        players.forEach((player, i) => ctx.fillText(player, i * 100 + 50, 20));
        results.forEach((result, i) => ctx.fillText(result, i * 100 + 50, canvas.height - 10));

        for (let i = 0; i < players.length; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 100 + 50, 30);
            ctx.lineTo(i * 100 + 50, canvas.height - 30);
            ctx.stroke();
        }

        if (areRungsVisible) {
            for (let i = 0; i < ladder.length - 1; i++) {
                for (let j = 0; j < ladder[i].length; j++) {
                    if (ladder[i][j] === 1) {
                        ctx.beginPath();
                        ctx.moveTo(i * 100 + 50, j);
                        ctx.lineTo((i + 1) * 100 + 50, j);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    function animatePath(playerIndex) {
        playerStarted[playerIndex] = true;
        playedCount++;

        const startButtons = startButtonsDiv.querySelectorAll('button');
        startButtons.forEach(btn => btn.disabled = true);
        resetGameBtn.disabled = true;

        let currentX = playerIndex;
        let y = 30;
        let path = [{x: currentX * 100 + 50, y: y}];

        const anim = () => {
            drawLadder();
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.beginPath();
            path.forEach((p, i) => {
                if (i === 0) ctx.moveTo(p.x, p.y);
                else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();

            if (y < canvas.height - 30) {
                let moved = false;
                if (ladder[currentX] && ladder[currentX][y] === 1) {
                    path.push({x: (currentX + 1) * 100 + 50, y: y});
                    currentX++;
                    moved = true;
                } else if (ladder[currentX] && ladder[currentX][y] === -1) {
                    path.push({x: (currentX - 1) * 100 + 50, y: y});
                    currentX--;
                    moved = true;
                }

                y++;
                if (!moved) {
                    path[path.length - 1].y = y;
                } else {
                    path.push({x: currentX * 100 + 50, y: y});
                }
                requestAnimationFrame(anim);
            } else {
                const resultP = document.createElement('p');
                resultP.textContent = `${players[playerIndex]} -> ${results[currentX]}`;
                resultDisplay.appendChild(resultP);

                if (playedCount < players.length) {
                    startButtons.forEach((btn, i) => {
                        if (!playerStarted[i]) {
                            btn.disabled = false;
                        }
                    });
                }
                
                resetGameBtn.disabled = false;
                
                // Redraw final state
                areRungsVisible = true;
                toggleRungsBtn.textContent = '사다리 감추기';
                drawLadder();
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 3;
                ctx.beginPath();
                path.forEach((p, i) => {
                    if (i === 0) ctx.moveTo(p.x, p.y);
                    else ctx.lineTo(p.x, p.y);
                });
                ctx.stroke();
            }
        };
        anim();
    }

    updatePlayerInputs();
});