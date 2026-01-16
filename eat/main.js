const recommendBtn = document.getElementById('recommend-btn');
const loadingAnimation = document.getElementById('loading-animation');
const imageSpinner = document.getElementById('image-spinner');
const resultDiv = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const resultName = document.getElementById('result-name');
const resultDescription = document.getElementById('result-description');

recommendBtn.addEventListener('click', () => {
    // Hide result and show loading animation
    resultDiv.classList.add('hidden');
    loadingAnimation.classList.remove('hidden');

    let imageChangeInterval = setInterval(() => {
        const randomMenuItem = menuData[Math.floor(Math.random() * menuData.length)];
        const imageUrl = `https://loremflickr.com/300/200/${encodeURIComponent(randomMenuItem.name)}/all`;
        imageSpinner.style.backgroundImage = `url('${imageUrl}')`;
    }, 100);

    // After a delay, show the result
    setTimeout(() => {
        clearInterval(imageChangeInterval);

        const randomMenuItem = menuData[Math.floor(Math.random() * menuData.length)];
        const imageUrl = `https://loremflickr.com/300/200/${encodeURIComponent(randomMenuItem.name)}/all`;

        resultImage.src = imageUrl;
        resultName.textContent = randomMenuItem.name;
        resultDescription.textContent = randomMenuItem.description;

        loadingAnimation.classList.add('hidden');
        resultDiv.classList.remove('hidden');
    }, 3000); // 3 seconds delay
});
