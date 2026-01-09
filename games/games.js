document.addEventListener('DOMContentLoaded', function () {
    const listRoot = document.querySelector('.link-group');
    const overlay = document.getElementById('overlay-toast');
    let toastTimer = null;

    // 1. 토스트 알림 함수
    function showToast() {
        if (!overlay) return;
        overlay.classList.add('visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => overlay.classList.remove('visible'), 1500);
    }

    // 토스트 닫기 클릭 이벤트
    if (overlay) {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            clearTimeout(toastTimer);
        });
    }

    // 2. [복구] 준비중 항목(.coming-soon) 클릭 시 토스트 표시
    // 이 부분이 빠져서 토스트가 안 떴던 것입니다.
    document.addEventListener('click', function(e) {
        const soonEl = e.target.closest('.coming-soon');
        if (soonEl) {
            e.preventDefault();
            showToast();
        }
    });

    // 3. 정보 추출 로직 (NEW 뱃지 및 숫자 파싱)
    function getInfo(el) {
        const subText = el.querySelector('.game-sub')?.textContent.trim() || '';
        const nameText = el.querySelector('.game-title')?.textContent.trim() || el.textContent.trim();
        const isNew = el.querySelector('.badge.new') !== null;
        
        let num = parseInt(subText.match(/(\d+)/)?.[0], 10) || null;
        if (num === null && /β|beta|베타/i.test(subText)) num = 8;

        return { el, name: nameText, num, isNew };
    }

    // 4. 정렬 로직
    function sortList(mode) {
        if (!listRoot) return;
        const items = Array.from(listRoot.querySelectorAll('.link-button'));
        const infos = items.map(getInfo);

        infos.sort((a, b) => {
            if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
            if (mode.startsWith('project')) {
                if (a.num !== b.num) return (a.num === null) ? 1 : (b.num === null) ? -1 : b.num - a.num;
            }
            return a.name.localeCompare(b.name, 'ko');
        });

        const rects = new Map();
        items.forEach(el => rects.set(el, el.getBoundingClientRect()));

        infos.forEach(info => listRoot.appendChild(info.el));

        infos.forEach(({ el }) => {
            const first = rects.get(el);
            const last = el.getBoundingClientRect();
            const dy = first.top - last.top;
            if (dy) {
                el.style.transition = 'none';
                el.style.transform = `translateY(${dy}px)`;
                el.getBoundingClientRect();
                el.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1)';
                el.style.transform = '';
            }
        });
    }

    // 5. 하단 탭바 통합 제어 (모션 + 정렬)
    const segGroups = document.querySelectorAll('.seg-group');

    segGroups.forEach(group => {
        const buttons = group.querySelectorAll('button');
        
        buttons.forEach((btn, index) => {
            btn.addEventListener('click', function () {
                // 디자인 처리
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                if (index === 0) group.classList.remove('en-active');
                else group.classList.add('en-active');

                // 정렬 기능 실행
                const tab = this.getAttribute('data-tab');
                if (tab === 'latest') sortList('project-desc');
                else if (tab === 'name') sortList('name-asc');
                
                // 언어 변경은 별도의 setLang 함수가 있다면 여기서 호출 가능
                if (tab === 'ko' || tab === 'en') {
                    if (typeof setLang === 'function') setLang(tab);
                }
            });
        });
    });

    // 초기 정렬 실행
    sortList('project-desc');
});