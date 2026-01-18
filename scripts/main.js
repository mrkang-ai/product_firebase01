document.addEventListener("DOMContentLoaded", function() {
    const loadHTML = (url, elementId, callback) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.innerHTML = data;
                }
                if (callback) {
                    callback();
                }
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    };

    const initializeDropdowns = () => {
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('.dropbtn');
            const content = dropdown.querySelector('.dropdown-content');

            if (button && content) {
                // Reset any previous state
                content.classList.remove('show');

                button.addEventListener('click', (event) => {
                    event.stopPropagation();
                    // Close other open dropdowns before opening a new one
                    document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
                        if (openDropdown !== content) {
                            openDropdown.classList.remove('show');
                        }
                    });
                    content.classList.toggle('show');
                });
            }
        });

        // Close all dropdowns if clicked outside
        window.onclick = (event) => {
            if (!event.target.matches('.dropbtn')) {
                document.querySelectorAll('.dropdown-content.show').forEach(openDropdown => {
                    openDropdown.classList.remove('show');
                });
            }
        };
    };

    const setupShareButtons = () => {
        const copyLinkBtn = document.getElementById('copy-link-btn');
        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => alert('Page URL copied to clipboard!'))
                    .catch(err => console.error('Failed to copy: ', err));
            });
        }

        const snsShareBtn = document.getElementById('sns-share-btn');
        if (snsShareBtn) {
            snsShareBtn.addEventListener('click', () => {
                if (navigator.share) {
                    navigator.share({
                        title: document.title,
                        text: document.querySelector('meta[name="description"]').content,
                        url: window.location.href,
                    })
                    .then(() => console.log('Successful share'))
                    .catch((error) => console.log('Error sharing', error));
                } else {
                    alert('Web Share API is not supported in this browser.');
                }
            });
        }
    };

    const path = window.location.pathname;
    const isSubpage = path.includes('/eat/') || path.includes('/ladder/') || path.includes('/lotto/') || path.includes('/Rock-paper-scissors/') || path.includes('/TextCount/');
    const basePath = isSubpage ? '../' : '';

    loadHTML(`${basePath}header.html`, 'header-placeholder', () => {
        initializeDropdowns();
        setupShareButtons();
        // After loading the header, also re-apply language settings to it
        if (window.applyLanguage) {
            window.applyLanguage();
        }
    });

    loadHTML(`${basePath}footer.html`, 'footer-placeholder', () => {
        // After loading the footer, also re-apply language settings to it
        if (window.applyLanguage) {
            window.applyLanguage();
        }
    });
});
