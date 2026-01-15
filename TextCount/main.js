// DOM 요소 가져오기
const textInput = document.getElementById('text-input');
const countCharIncludeSpace = document.getElementById('count-char-include-space');
const countCharExcludeSpace = document.getElementById('count-char-exclude-space');
const countWords = document.getElementById('count-words');
const countLines = document.getElementById('count-lines');
const resetBtn = document.getElementById('reset-btn');

/**
 * 텍스트 분석 및 결과 업데이트 함수
 */
function updateCounts() {
    const text = textInput.value;

    // 1. 공백 포함 글자 수
    countCharIncludeSpace.textContent = text.length;

    // 2. 공백 제외 글자 수
    countCharExcludeSpace.textContent = text.replace(/\s/g, '').length;

    // 3. 단어 수
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    countWords.textContent = words.length;
    
    // 4. 줄 수
    const lines = text.split('\n');
    countLines.textContent = text.length === 0 ? 0 : lines.length;
}

/**
 * 모든 값 초기화 함수
 */
function resetAll() {
    textInput.value = '';
    updateCounts();
}

// 이벤트 리스너 연결
textInput.addEventListener('input', updateCounts);
resetBtn.addEventListener('click', resetAll);

// 페이지 로드 시 초기 상태 업데이트
updateCounts();
