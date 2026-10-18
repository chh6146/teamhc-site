/* ==========================================
   테마 (다크모드) + 뒤로가기 버튼
   ========================================== */

/* FOUC 방지: head에서 즉시 실행되도록 별도 인라인 스니펫 필요 */
/* (아래 HTML 섹션 참고) */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initBackButton(window.BACK_FALLBACK);
});

/* ---------- 다크모드 토글 ---------- */
function initThemeToggle() {
    const btn = document.getElementById('themeBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        const root = document.documentElement;
        const current = root.getAttribute('data-theme');
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        const effective = current || (systemDark ? 'dark' : 'light');
        const next = effective === 'dark' ? 'light' : 'dark';

        root.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });
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