document.addEventListener('DOMContentLoaded', () => {
    const langKoButton = document.getElementById('lang-ko');
    const langEnButton = document.getElementById('lang-en');

    const setLanguage = (lang) => {
        document.documentElement.lang = lang;
        localStorage.setItem('language', lang);
        updateText(lang);
    };

    const updateText = (lang) => {
        document.querySelectorAll('[data-lang-ko]').forEach(el => {
            el.textContent = el.getAttribute(`data-lang-${lang}`);
        });
        document.title = document.querySelector('title').getAttribute(`data-lang-${lang}`);
    };

    langKoButton.addEventListener('click', () => setLanguage('ko'));
    langEnButton.addEventListener('click', () => setLanguage('en'));

    const savedLang = localStorage.getItem('language') || 'ko';
    setLanguage(savedLang);
});