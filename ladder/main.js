document.addEventListener('DOMContentLoaded', () => {
    const addPlayerBtn = document.getElementById('add-player');
    const startGameBtn = document.getElementById('start-game');
    const playersDiv = document.getElementById('players');
    const resultsDiv = document.getElementById('results');
    const setupDiv = document.getElementById('setup');
    const gameContainer = document.getElementById('game-container');
    const canvas = document.getElementById('ladder-canvas');
    const ctx = canvas.getContext('2d');
    const resultDisplay = document.getElementById('result-display');

    let players = ["참가자 1", "참가자 2"];
    let results = ["결과 1", "결과 2"];
    let ladder;

    addPlayerBtn.addEventListener('click', () => {
        const playerCount = players.length + 1;
        const newPlayerInput = document.createElement('input');
        newPlayerInput.type = 'text';
        newPlayerInput.placeholder = `참가자 ${playerCount}`;
        newPlayerInput.value = `참가자 ${playerCount}`;
        playersDiv.appendChild(newPlayerInput);

        const newResultInput = document.createElement('input');
        newResultInput.type = 'text';
        newResultInput.placeholder = `결과 ${playerCount}`;
        newResultInput.value = `결과 ${playerCount}`;
        resultsDiv.appendChild(newResultInput);

        players.push(`참가자 ${playerCount}`);
        results.push(`결과 ${playerCount}`);
    });

    startGameBtn.addEventListener('click', () => {
        const playerInputs = playersDiv.querySelectorAll('input');
        const resultInputs = resultsDiv.querySelectorAll('input');
        players = Array.from(playerInputs).map(input => input.value);
        results = Array.from(resultInputs).map(input => input.value);

        setupDiv.style.display = 'none';
        gameContainer.style.display = 'block';

        const numPlayers = players.length;
        const ladderWidth = numPlayers * 100;
        const ladderHeight = 500;
        canvas.width = ladderWidth;
        canvas.height = ladderHeight;

        generateLadder(numPlayers, ladderHeight);
        drawLadder();
    });

    function generateLadder(numPlayers, height) {
        ladder = Array(numPlayers).fill(0).map(() => Array(height).fill(0));
        const rungCount = Math.floor(numPlayers * 2);

        for (let i = 0; i < rungCount; i++) {
            const x = Math.floor(Math.random() * (numPlayers - 1));
            const y = Math.floor(Math.random() * (height - 40)) + 20;

            if (ladder[x][y] === 0 && ladder[x + 1][y] === 0) {
                ladder[x][y] = 1; // Rung to the right
                ladder[x + 1][y] = -1; // Rung to the left
            }
        }
    }

    function drawLadder() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;

        // Draw player names
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        players.forEach((player, i) => {
            ctx.fillText(player, i * 100 + 50, 20);
        });

        // Draw vertical lines
        for (let i = 0; i < players.length; i++) {
            ctx.beginPath();
            ctx.moveTo(i * 100 + 50, 30);
            ctx.lineTo(i * 100 + 50, canvas.height - 30);
            ctx.stroke();
        }

        // Draw horizontal rungs
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

        // Draw results
        results.forEach((result, i) => {
            ctx.fillText(result, i * 100 + 50, canvas.height - 10);
        });
    }

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const playerIndex = Math.floor(x / 100);

        if (playerIndex >= 0 && playerIndex < players.length) {
            animatePath(playerIndex);
        }
    });

    function animatePath(playerIndex) {
        let currentX = playerIndex;
        let y = 30;

        const anim = () => {
            drawLadder(); // Redraw ladder to clear previous path
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(playerIndex * 100 + 50, 30);

            let pathY = 30;
            let pathX = playerIndex;

            while(pathY < y) {
                 if (ladder[pathX] && ladder[pathX][pathY] === 1) {
                    ctx.lineTo(pathX * 100 + 50, pathY);
                    ctx.lineTo((pathX + 1) * 100 + 50, pathY);
                    pathX++;
                } else if (ladder[pathX] && ladder[pathX][pathY] === -1) {
                    ctx.lineTo(pathX * 100 + 50, pathY);
                    ctx.lineTo((pathX - 1) * 100 + 50, pathY);
                    pathX--;
                }
                 pathY++;
            }
             ctx.lineTo(pathX * 100 + 50, y);
             ctx.stroke();


            if (y < canvas.height - 30) {
                if (ladder[currentX] && ladder[currentX][y] === 1) {
                    currentX++;
                } else if (ladder[currentX] && ladder[currentX][y] === -1) {
                    currentX--;
                }
                y++;
                requestAnimationFrame(anim);
            } else {
                 resultDisplay.textContent = `${players[playerIndex]} -> ${results[currentX]}`;
                 ctx.strokeStyle = 'black';
                 ctx.lineWidth = 2;
            }
        }
        anim();
    }
});