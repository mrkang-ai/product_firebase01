const generateBtn = document.getElementById('generate-btn');
const generatedNumbersContainer = document.getElementById('generated-numbers-container');

// '번호 생성하기' 버튼 클릭 이벤트 리스너
generateBtn.addEventListener('click', () => {
    // 버튼 비활성화 (중복 클릭 방지)
    generateBtn.disabled = true;

    const numbers = generateLottoNumbers();
    appendNewNumbers(numbers);

    // 잠시 후 버튼 다시 활성화
    setTimeout(() => {
        generateBtn.disabled = false;
    }, 300);
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

    const numbersDiv = document.createElement('div');
    numbersDiv.className = 'numbers';

    numbers.forEach(number => {
        const numberSpan = document.createElement('span');
        numberSpan.className = 'lotto-ball';
        numberSpan.textContent = number;
        numbersDiv.appendChild(numberSpan);
    });

    const timestampSpan = document.createElement('span');
    timestampSpan.className = 'timestamp';
    const now = new Date();
    timestampSpan.textContent = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setDiv.appendChild(numbersDiv);
    setDiv.appendChild(timestampSpan);

    // 목록의 맨 위에 추가하여 최신 번호가 가장 잘 보이도록 함
    generatedNumbersContainer.prepend(setDiv);
}

const copyLinkBtn = document.getElementById('copy-link-btn');

copyLinkBtn.addEventListener('click', () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('페이지 주소가 복사되었습니다!');
    }, () => {
        alert('주소 복사에 실패했습니다.');
    });
});
