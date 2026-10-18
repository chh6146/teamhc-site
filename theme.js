/* ==========================================
   테마 (다크모드) + 뒤로가기 버튼
   ========================================== */

/* ---------- 테마 버튼 주입 ---------- */
const THEME_BTN_HTML = `
    <button class="icon-btn theme-btn" id="themeBtn" aria-label="테마 전환">
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
        </svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        <svg class="icon-system" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 3 a9 9 0 0 1 0 18 z" fill="currentColor" stroke="none"/>
        </svg>
    </button>
`;

function injectThemeButton() {
    if (document.getElementById('themeBtn')) return;
    const bar = document.querySelector('.top-bar, .site-header');
    if (!bar) return;
    bar.insertAdjacentHTML('beforeend', THEME_BTN_HTML);
}

/* FOUC 방지: head에서 즉시 실행되도록 별도 인라인 스니펫 필요 */
/* (아래 HTML 섹션 참고) */

document.addEventListener('DOMContentLoaded', () => {
    injectThemeButton();        // ← 추가 (initThemeToggle보다 먼저)
    initThemeToggle();
    initBackButton(window.BACK_FALLBACK);
});

/* ---------- 다크모드 토글 ---------- */
function initThemeToggle() {
    const btn = document.getElementById('themeBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const root = document.documentElement;
        const current = root.getAttribute('data-theme'); // null | 'light' | 'dark'

        let next;
        if (current === null) next = 'light';
        else if (current === 'light') next = 'dark';
        else next = null;

        if (next === null) {
            root.removeAttribute('data-theme');
            localStorage.removeItem('theme');
        } else {
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        }

        updateThemeButtonLabel(btn, next);
    });

    // 초기 라벨 동기화
    updateThemeButtonLabel(btn, document.documentElement.getAttribute('data-theme'));

    // ▼ 여기부터 추가: 시스템 다크모드 변경 시 라벨 동기화
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', () => {
        if (!document.documentElement.getAttribute('data-theme')) {
            updateThemeButtonLabel(btn, null);
        }
    });
}

/* 버튼 상태(아이콘/aria) 갱신 */
function updateThemeButtonLabel(btn, mode) {
    // mode: null(시스템) | 'light' | 'dark'
    btn.dataset.mode = mode || 'system';
    btn.setAttribute('aria-label',
        mode === 'light' ? '라이트 모드 (클릭 시 다크)' :
        mode === 'dark'  ? '다크 모드 (클릭 시 시스템)' :
                           '시스템 설정 따름 (클릭 시 라이트)'
    );
}

/* ---------- 뒤로가기 버튼 ---------- */
function initBackButton(fallbackUrl) {
    const btn = document.getElementById('backBtn');
    if (!btn) return;

    btn.hidden = false;

    btn.addEventListener('click', () => {
        // 무조건 상위 페이지로. 지정 없으면 index.html
        location.href = fallbackUrl || 'index.html';
    });
}