const recommendBtn = document.getElementById('recommend-btn');
const loadingAnimation = document.getElementById('loading-animation');
const imageSpinner = document.getElementById('image-spinner');
const resultDiv = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const resultName = document.getElementById('result-name');
const resultDescription = document.getElementById('result-description');

// Function to get the correct image URL (prioritizing .webp)
function getImageUrl(itemName) {
    const webpPath = `eat/images/${itemName}.webp`;
    const jpgPath = `eat/images/${itemName}.jpg`;
    
    // In a real scenario, you'd check if the .webp file exists on the server.
    // For this context, we'll assume if it's "가츠동", use webp, otherwise jpg
    // since the user specifically requested 가츠동.webp
    if (itemName === "가츠동") {
        return webpPath;
    }
    return jpgPath;
}

recommendBtn.addEventListener('click', () => {
    // Hide result and show loading animation
    resultDiv.classList.add('hidden');
    loadingAnimation.classList.remove('hidden');

    let imageChangeInterval = setInterval(() => {
        const randomMenuItem = menuData[Math.floor(Math.random() * menuData.length)];
        const imageUrl = getImageUrl(randomMenuItem.name);
        imageSpinner.style.backgroundImage = `url('${imageUrl}')`;
    }, 100);

    // After a delay, show the result
    setTimeout(() => {
        clearInterval(imageChangeInterval);

        const randomMenuItem = menuData[Math.floor(Math.random() * menuData.length)];
        const imageUrl = getImageUrl(randomMenuItem.name);

        resultImage.src = imageUrl;
        resultName.textContent = randomMenuItem.name;
        resultDescription.textContent = randomMenuItem.description;

        loadingAnimation.classList.add('hidden');
        resultDiv.classList.remove('hidden');
    }, 3000); // 3 seconds delay
});
