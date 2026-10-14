document.addEventListener('DOMContentLoaded', () => {
    const langButtons = document.querySelectorAll('.lang-toggle button');
    const langSections = document.querySelectorAll('.lang-section');

    if (!langButtons.length || !langSections.length) return;

    function setLang(lang) {
        // 섹션 전환
        langSections.forEach(sec => {
            sec.classList.toggle('active', sec.id === `lang-${lang}`);
        });

        // 버튼 활성
        langButtons.forEach(btn => {
            const isActive = btn.dataset.lang === lang;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        // html lang 속성
        document.documentElement.lang = lang;

        // 선택 저장 (다음 방문 시 유지)
        try {
            localStorage.setItem('privacy-lang', lang);
        } catch (e) {}
    }

    // 클릭 이벤트
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setLang(btn.dataset.lang);
        });
    });

    // 초기 언어 (저장된 값 또는 브라우저 언어)
    let initialLang = 'ko';
    try {
        const saved = localStorage.getItem('privacy-lang');
        if (saved === 'ko' || saved === 'en') {
            initialLang = saved;
        } else if (!navigator.language.startsWith('ko')) {
            initialLang = 'en';
        }
    } catch (e) {}

    setLang(initialLang);
});