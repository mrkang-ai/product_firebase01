const choiceBtns = document.querySelectorAll('.choice-btn');
const userChoiceElem = document.getElementById('user-choice');
const computerChoiceElem = document.getElementById('computer-choice');
const resultTextElem = document.getElementById('result-text');

const totalRoundsElem = document.getElementById('total-rounds');
const winCountElem = document.getElementById('win-count');
const winPercentageElem = document.getElementById('win-percentage');
const historyLogElem = document.getElementById('history-log');

const choices = ['rock', 'paper', 'scissors'];
const choiceMap = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

let totalRounds = 0;
let winCount = 0;

choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Disable buttons during animation
        choiceBtns.forEach(b => b.disabled = true);

        const userChoice = btn.dataset.choice;
        userChoiceElem.textContent = choiceMap[userChoice];

        // Clear previous result
        resultTextElem.textContent = '';
        computerChoiceElem.textContent = '';

        let spinCount = 0;
        const spinInterval = setInterval(() => {
            const randomChoice = choices[spinCount % 3];
            computerChoiceElem.textContent = choiceMap[randomChoice];
            spinCount++;
        }, 100);

        setTimeout(() => {
            clearInterval(spinInterval);

            const computerChoice = choices[Math.floor(Math.random() * choices.length)];
            computerChoiceElem.textContent = choiceMap[computerChoice];

            const result = getResult(userChoice, computerChoice);
            resultTextElem.textContent = result;

            updateStats(result);
            updateHistory(userChoice, computerChoice, result);

            // Re-enable buttons
            choiceBtns.forEach(b => b.disabled = false);
        }, 3000);
    });
});

function getResult(user, computer) {
    if (user === computer) {
        return '무승부!';
    }
    if (
        (user === 'rock' && computer === 'scissors') ||
        (user === 'paper' && computer === 'rock') ||
        (user === 'scissors' && computer === 'paper')
    ) {
        return '이겼습니다! 🎉';
    }
    return '졌습니다... 😢';
}

function updateStats(result) {
    totalRounds++;
    if (result === '이겼습니다! 🎉') {
        winCount++;
    }

    const winPercentage = totalRounds > 0 ? ((winCount / totalRounds) * 100).toFixed(1) : 0;

    totalRoundsElem.textContent = totalRounds;
    winCountElem.textContent = winCount;
    winPercentageElem.textContent = winPercentage;
}

function updateHistory(user, computer, result) {
    const historyItem = document.createElement('div');
    historyItem.classList.add('history-item');
    historyItem.textContent = `제 ${totalRounds}회: 나: ${choiceMap[user]} vs 컴퓨터: ${choiceMap[computer]} -> ${result}`;
    historyLogElem.prepend(historyItem);
}
