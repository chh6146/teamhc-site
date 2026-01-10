document.addEventListener('DOMContentLoaded', () => {
    const group = document.querySelector('.bottom-tabbar .seg-group');
    if (!group) return;

    const buttons = Array.from(group.querySelectorAll('button'));
    if (buttons.length === 0) return;

    // 인디케이터 생성
    let indicator = group.querySelector('.seg-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'seg-indicator';
        group.appendChild(indicator);
    }

    let activeBtn = group.querySelector('button.active') || buttons[0];
    activeBtn.classList.add('active');

    function moveIndicator(btn, animate = true) {
        const groupRect = group.getBoundingClientRect();
        const btnRect = btn.getBoundingClientRect();

        const x = btnRect.left - groupRect.left;
        const w = btnRect.width;

        indicator.style.transition = animate
            ? 'transform 0.42s cubic-bezier(.2,.8,.2,1), width 0.42s cubic-bezier(.2,.8,.2,1)'
            : 'none';

        indicator.style.transform = `translateX(${x}px)`;
        indicator.style.width = `${w}px`;
    }

    // 초기 위치 (레이아웃 안정 후)
    requestAnimationFrame(() => {
        moveIndicator(activeBtn, false);
    });

    // 클릭 이벤트
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn === activeBtn) return;

            activeBtn.classList.remove('active');
            btn.classList.add('active');
            activeBtn = btn;

            moveIndicator(btn, true);

            // ✅ 이 부분을 추가하세요!
            const tabName = btn.getAttribute('data-tab'); // 'latest' 또는 'name'
            const event = new CustomEvent('tabchange', {
                detail: { tab: tabName }
            });
            document.dispatchEvent(event);
        });
    });

    // 창 크기 변경 대응
    window.addEventListener('resize', () => {
        moveIndicator(activeBtn, false);
    });
});