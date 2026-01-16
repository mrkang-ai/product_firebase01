const recommendBtn = document.getElementById('recommend-btn');
const loadingAnimation = document.getElementById('loading-animation');
const imageSpinner = document.getElementById('image-spinner');
const resultDiv = document.getElementById('result');
const resultImage = document.getElementById('result-image');
const resultName = document.getElementById('result-name');

recommendBtn.addEventListener('click', () => {
    // Hide result and show loading animation
    resultDiv.classList.add('hidden');
    loadingAnimation.classList.remove('hidden');

    let imageChangeInterval = setInterval(() => {
        const randomMenuItem = menuData[Math.floor(Math.random() * menuData.length)];
        const imageUrl = `https://placehold.co/300x200.jpg?text=${encodeURIComponent(randomMenuItem.name)}`;
        imageSpinner.style.backgroundImage = `url('${imageUrl}')`;
    }, 100);

    // After a delay, show the result
    setTimeout(() => {
        clearInterval(imageChangeInterval);

        const randomMenuItem = menuData[Math.floor(Math.random() * menuData.length)];
        const imageUrl = `https://placehold.co/300x200.jpg?text=${encodeURIComponent(randomMenuItem.name)}`;

        resultImage.src = imageUrl;
        resultName.textContent = randomMenuItem.name;

        loadingAnimation.classList.add('hidden');
        resultDiv.classList.remove('hidden');
    }, 3000); // 3 seconds delay
});
