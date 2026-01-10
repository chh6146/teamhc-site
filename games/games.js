document.addEventListener('DOMContentLoaded', () => {
    const listRoot = document.querySelector('.link-group');
    const overlay = document.getElementById('overlay-toast');
    let toastTimer = null;
    const itemTimers = new Map();

    function showToast() {
        overlay.classList.add('visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            overlay.classList.remove('visible');
        }, 1500);
    }

    document.addEventListener('click', e => {
        const soon = e.target.closest('.coming-soon');
        if (!soon) return;
        e.preventDefault();
        showToast();
    });

    fetch('games.json')
        .then(res => res.json())
        .then(data => {
            createItems(data);
            sortList('project-desc'); // 초기 정렬
        });

    function formatDisplayDate(dateStr) {
        if (!dateStr) return "";
        const parts = dateStr.split('.');
        const isUpcoming = dateStr.includes('.00');
        const suffix = isUpcoming ? '예정' : '발매';

        if (parts[1] === '00') return `${parts[0]}년 ${suffix}`;
        if (parts[2] === '00') return `${parts[0]}년 ${parseInt(parts[1])}월 ${suffix}`;
        return `${dateStr} ${suffix}`;
    }

    function startItemTimer(a) {
        if (!a.dataset.date || a.dataset.date.trim() === "") return;
        if (itemTimers.has(a)) clearInterval(itemTimers.get(a));

        const subArea = a.querySelector('.game-sub');
        const timerId = setInterval(() => {
            subArea.classList.add('fade-out'); 
            setTimeout(() => {
                const isCurrentlyDate = a.dataset.mode === "date";
                const bHtml = a.dataset.badgeText ? `<span class="badge ${a.dataset.badgeClass}">${a.dataset.badgeText}</span>` : '';
                
                if (isCurrentlyDate) {
                    subArea.innerHTML = `${bHtml} ${a.dataset.sub}`;
                    a.dataset.mode = "sub";
                } else {
                    subArea.innerHTML = `${bHtml} ${formatDisplayDate(a.dataset.date)}`;
                    a.dataset.mode = "date";
                }
                subArea.classList.remove('fade-out'); 
            }, 500); 
        }, 5000);
        itemTimers.set(a, timerId);
    }

    function createItems(data) {
        listRoot.innerHTML = '';
        data.forEach(game => {
            const a = document.createElement('a');
            a.className = 'link-button';
            a.dataset.id = Number(game.id);
            a.dataset.title = game.title;
            a.dataset.new = (game.badge && game.badge.text === "NEW") ? 1 : 0;
            a.dataset.date = game.date || "";
            a.dataset.sub = game.sub || "";
            a.dataset.status = game.status || "released";
            a.dataset.mode = "sub";
            a.dataset.badgeText = game.badge ? game.badge.text : "";
            a.dataset.badgeClass = game.badge ? game.badge.class : "";

            if (game.status !== 'released') {
                a.classList.add('coming-soon');
                a.href = '#';
            } else {
                a.href = game.url;
            }

            const badgeHtml = a.dataset.badgeText ? `<span class="badge ${a.dataset.badgeClass}">${a.dataset.badgeText}</span>` : '';
            a.innerHTML = `
                <img src="${game.icon}" class="icon-img">
                <div class="game-info">
                    <div class="game-sub">${badgeHtml} ${game.sub}</div>
                    <div class="game-title">${game.title}</div>
                </div>
            `;
            listRoot.appendChild(a);
            startItemTimer(a);
        });
    }

    function sortList(mode) {
        const items = Array.from(listRoot.children);
        const rects = new Map();
        items.forEach(el => rects.set(el, el.getBoundingClientRect()));

        items.sort((a, b) => {
            // "NEW" 배지는 어떤 정렬에서도 최상단 유지
            const newA = Number(a.dataset.new);
            const newB = Number(b.dataset.new);
            if (newA !== newB) return newB - newA;

            // 1. 최신순 (날짜 기반)
            if (mode === 'latest-desc') {
                const dateA = a.dataset.date ? parseInt(a.dataset.date.replace(/\./g, '')) : 0;
                const dateB = b.dataset.date ? parseInt(b.dataset.date.replace(/\./g, '')) : 0;
                return dateB - dateA || Number(b.dataset.id) - Number(a.dataset.id);
            }

            // 2. 가나다순 (제목 기반)
            if (mode === 'name-asc') {
                return a.dataset.title.localeCompare(b.dataset.title, 'ko');
            }

            // 3. 프로젝트순 (ID 기반 내림차순)
            if (mode === 'project-desc') {
                return Number(b.dataset.id) - Number(a.dataset.id);
            }

            return 0;
        });

        items.forEach(el => listRoot.appendChild(el));
        
        // 애니메이션 효과
        items.forEach(el => {
            const first = rects.get(el);
            const last = el.getBoundingClientRect();
            const dy = first.top - last.top;
            if (dy !== 0) {
                el.style.transition = 'none';
                el.style.transform = `translateY(${dy}px)`;
                el.getBoundingClientRect();
                el.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1)';
                el.style.transform = '';
            }
        });
    }

    // ✅ 탭 변경 이벤트 수신부 수정
    document.addEventListener('tabchange', e => {
        const tab = e.detail.tab;
        
        // 정렬 실행
        if (tab === 'latest') sortList('latest-desc');
        if (tab === 'name') sortList('name-asc');
        if (tab === 'project') sortList('project-desc'); // 프로젝트순 대응

        // 서브 텍스트 즉시 갱신
        Array.from(listRoot.children).forEach(a => {
            const subArea = a.querySelector('.game-sub');
            if (!subArea || !a.dataset.date) return;

            const bHtml = a.dataset.badgeText ? `<span class="badge ${a.dataset.badgeClass}">${a.dataset.badgeText}</span>` : '';
            
            // 최신순 탭일 때만 날짜를 먼저 보여줌 (선택 사항)
            if (tab === 'latest') {
                subArea.innerHTML = `${bHtml} ${formatDisplayDate(a.dataset.date)}`;
                a.dataset.mode = "date";
            } else {
                subArea.innerHTML = `${bHtml} ${a.dataset.sub}`;
                a.dataset.mode = "sub";
            }
            startItemTimer(a);
        });
    });
});