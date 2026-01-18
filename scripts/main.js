document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and insert HTML content
    const loadHTML = (url, elementId, callback) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
                if (callback) {
                    callback();
                }
            })
            .catch(error => console.error(`Error loading ${url}:`, error));
    };

    // Determine the base path
    const path = window.location.pathname;
    const isSubpage = path.includes('/eat/') || path.includes('/ladder/') || path.includes('/lotto/') || path.includes('/Rock-paper-scissors/') || path.includes('/TextCount/');
    const basePath = isSubpage ? '../' : '';

    // Load header and add event listeners for share buttons
    loadHTML(`${basePath}header.html`, 'header-placeholder', () => {
        // Dropdown functionality
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const button = dropdown.querySelector('.dropbtn');
            const content = dropdown.querySelector('.dropdown-content');

            button.addEventListener('click', (event) => {
                event.stopPropagation();
                // Close other dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.querySelector('.dropdown-content').classList.remove('show');
                    }
                });
                content.classList.toggle('show');
            });
        });

        // Close dropdowns if clicked outside
        window.onclick = function(event) {
            if (!event.target.matches('.dropbtn')) {
                const openDropdowns = document.querySelectorAll('.dropdown-content');
                openDropdowns.forEach(openDropdown => {
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                });
            }
        }

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
                    console.log('Web Share API not supported.');
                    // Fallback for desktop: open a popup with share links
                    const socialMediaLinks = {
                        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
                        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(document.title)}`,
                        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}`,
                    };
                    const popup = window.open('', 'Share', 'height=400,width=600');
                    popup.document.write('<html><head><title>Share</title></head><body>');
                    popup.document.write('<h3>Share on:</h3>');
                    for (const [key, value] of Object.entries(socialMediaLinks)) {
                        popup.document.write(`<a href="${value}" target="_blank">${key}</a><br>`);
                    }
                    popup.document.write('</body></html>');
                }
            });
        }
    });

    // Load footer
    loadHTML(`${basePath}footer.html`, 'footer-placeholder');
});