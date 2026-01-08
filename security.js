// security.js
(function() {
    document.addEventListener("DOMContentLoaded", function() {
        // 1. 이메일 마스킹 복원 로직
        var codes = [116, 101, 97, 109, 104, 99, 46, 107, 111, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109];
        var email = codes.map(function(c) { return String.fromCharCode(c); }).join('');
        var anchors = ['privacy-email', 'privacy-email-en', 'privacy-email-2', 'contact-email'];

        anchors.forEach(function(id) {
            var el = document.getElementById(id);
            if (!el) return;
            var a = document.createElement('a');
            a.href = 'mailto:' + email;
            a.textContent = email;
            a.rel = 'noopener noreferrer';
            a.setAttribute('aria-label', '이메일로 문의하기');
            el.textContent = '';
            el.appendChild(a);
        });

        // 2. 언어 토글 로직
        function setLang(lang) {
            var koSec = document.getElementById('lang-ko');
            var enSec = document.getElementById('lang-en');
            var btnKo = document.getElementById('btn-ko');
            var btnEn = document.getElementById('btn-en');

            if (koSec) koSec.classList.toggle('active', lang === 'ko');
            if (enSec) enSec.classList.toggle('active', lang === 'en');
            if (btnKo) btnKo.classList.toggle('active', lang === 'ko');
            if (btnEn) btnEn.classList.toggle('active', lang === 'en');

            try { localStorage.setItem('site-lang', lang); } catch (e) {}
        }

        var btnKo = document.getElementById('btn-ko');
        var btnEn = document.getElementById('btn-en');

        if (btnKo && btnEn) {
            btnKo.addEventListener('click', function() { setLang('ko'); });
            btnEn.addEventListener('click', function() { setLang('en'); });
            
            try {
                var saved = localStorage.getItem('site-lang');
                setLang(saved === 'en' ? 'en' : 'ko');
            } catch (e) { setLang('ko'); }
        }
    });
})();