const generateBtn = document.getElementById('generate-btn');
const generatedNumbersContainer = document.getElementById('generated-numbers-container');

// '번호 생성하기' 버튼 클릭 이벤트 리스너
generateBtn.addEventListener('click', () => {
    const numbers = generateLottoNumbers();
    appendNewNumbers(numbers);
});

/**
 * 중복되지 않는 1~45 사이의 6개 숫자를 생성하여 정렬된 배열로 반환합니다.
 */
function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

/**
 * 생성된 번호 세트를 화면에 새로운 줄로 추가합니다.
 * @param {number[]} numbers - 생성된 로또 번호 배열
 */
function appendNewNumbers(numbers) {
    const setDiv = document.createElement('div');
    setDiv.className = 'generated-set';

    numbers.forEach(number => {
        const numberSpan = document.createElement('span');
        numberSpan.className = 'generated-number';
        numberSpan.textContent = number;
        setDiv.appendChild(numberSpan);
    });

    generatedNumbersContainer.appendChild(setDiv);
}
