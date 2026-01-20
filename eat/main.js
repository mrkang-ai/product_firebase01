const recommendBtn = document.getElementById('recommend-btn');
const loadingAnimation = document.getElementById('loading-animation');
const imageSpinner = document.getElementById('image-spinner');
const resultDiv = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const resultName = document.getElementById('result-name');
const resultDescription = document.getElementById('result-description');

// Function to get the correct image URL (prioritizing .webp)
function getImageUrl(itemName) {
    const webpPath = `images/${itemName}.webp`;
    return webpPath;
}

recommendBtn.addEventListener('click', () => {
    // Hide result and show loading animation
    resultDiv.classList.add('hidden');
    loadingAnimation.classList.remove('hidden');

    const lang = document.documentElement.lang || 'ko';

    let imageChangeInterval = setInterval(() => {
        const randomMenuItem = menuData[Math.floor(Math.random() * menuData.length)];
        const imageUrl = getImageUrl(randomMenuItem.name_ko); // Use Korean name for image
        imageSpinner.style.backgroundImage = `url('${imageUrl}')`;
    }, 100);

    // After a delay, show the result
    setTimeout(() => {
        clearInterval(imageChangeInterval);

        const randomMenuItem = menuData[Math.floor(Math.random() * menuData.length)];
        const imageUrl = getImageUrl(randomMenuItem.name_ko); // Use Korean name for image

        resultImage.src = imageUrl;
        if (lang === 'en') {
            resultName.textContent = randomMenuItem.name_en;
            resultDescription.textContent = randomMenuItem.description_en;
        } else {
            resultName.textContent = randomMenuItem.name_ko;
            resultDescription.textContent = randomMenuItem.description_ko;
        }

        loadingAnimation.classList.add('hidden');
        resultDiv.classList.remove('hidden');
    }, 3000); // 3 seconds delay
});
