document.addEventListener('DOMContentLoaded', () => {
    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
        updateText(lang);
    };

    const updateText = (lang) => {
        document.querySelectorAll('[data-lang-ko]').forEach(el => {
            el.textContent = el.getAttribute(`data-lang-${lang}`);
        });
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.textContent = titleElement.getAttribute(`data-lang-${lang}`);
        }
        const metaDescriptionElement = document.querySelector('meta[name="description"]');
        if (metaDescriptionElement) {
            metaDescriptionElement.setAttribute('content', metaDescriptionElement.getAttribute(`data-lang-${lang}`));
        }
        const ogTitleElement = document.querySelector('meta[property="og:title"]');
        if (ogTitleElement) {
            ogTitleElement.setAttribute('content', ogTitleElement.getAttribute(`data-lang-${lang}`));
        }
        const ogDescriptionElement = document.querySelector('meta[property="og:description"]');
        if (ogDescriptionElement) {
            ogDescriptionElement.setAttribute('content', ogDescriptionElement.getAttribute(`data-lang-${lang}`));
        }
        const twitterTitleElement = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitleElement) {
            twitterTitleElement.setAttribute('content', twitterTitleElement.getAttribute(`data-lang-${lang}`));
        }
        const twitterDescriptionElement = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescriptionElement) {
            twitterDescriptionElement.setAttribute('content', twitterDescriptionElement.getAttribute(`data-lang-${lang}`));
        }
    };

    // Event listeners for dropdown links
    document.getElementById('lang-ko').addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage('ko');
    });
    document.getElementById('lang-en').addEventListener('click', (e) => {
        e.preventDefault();
        setLanguage('en');
    });

    const savedLang = localStorage.getItem('language') || 'ko';
    setLanguage(savedLang);
});
