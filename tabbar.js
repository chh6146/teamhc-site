(function() {
    // 1. 초기 실행: 저장된 언어 또는 시스템 언어에 맞춰 UI 설정
    document.addEventListener("DOMContentLoaded", () => {
        // 개인정보처리방침 페이지(container 안의 lang-section)가 있는지 확인
        if (!document.querySelector('.lang-section')) return;

        const savedLang = localStorage.getItem('preferred-language');
        const systemLang = navigator.language.startsWith('ko') ? 'ko' : 'en';
        const targetLang = savedLang || systemLang;

        const group = document.querySelector('.seg-group');
        const btnKo = document.getElementById('btn-ko');
        const btnEn = document.getElementById('btn-en');

        // 초기 언어 적용
        updateLanguageUI(targetLang === 'ko' ? btnKo : btnEn);
    });

    // 2. 클릭 이벤트 처리 (캡처링 유지)
    document.addEventListener("click", function (e) {
        const btn = e.target.closest('.seg-group button');
        if (!btn) return;

        updateLanguageUI(btn);
    }, true);

    // 3. UI 및 언어 섹션 업데이트 공통 함수
    function updateLanguageUI(btn) {
        const group = btn.closest('.seg-group');
        const buttons = Array.from(group.querySelectorAll('button'));
        const index = buttons.indexOf(btn);
        const isEn = index !== 0;

        // 시각적 요소 업데이트 (기존 로직)
        if (!isEn) {
            group.classList.remove('en-active');
        } else {
            group.classList.add('en-active');
        }
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 개인정보처리방침 전용: 섹션 전환 및 언어 저장
        const langKo = document.getElementById('lang-ko');
        const langEn = document.getElementById('lang-en');
        
        if (langKo && langEn) {
            const selectedLang = isEn ? 'en' : 'ko';
            langKo.classList.toggle('active', !isEn);
            langEn.classList.toggle('active', isEn);
            localStorage.setItem('preferred-language', selectedLang);
        }
    }
})();