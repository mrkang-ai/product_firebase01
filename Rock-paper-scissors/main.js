const choiceBtns = document.querySelectorAll('.choice-btn');
const userChoiceElem = document.getElementById('user-choice');
const computerChoiceElem = document.getElementById('computer-choice');
const resultTextElem = document.getElementById('result-text');

const choices = ['rock', 'paper', 'scissors'];
const choiceMap = {
    rock: '✊',
    paper: '✋',
    scissors: '✌️'
};

choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const userChoice = btn.dataset.choice;
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];

        userChoiceElem.textContent = choiceMap[userChoice];
        computerChoiceElem.textContent = choiceMap[computerChoice];

        const result = getResult(userChoice, computerChoice);
        resultTextElem.textContent = result;
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
