document.addEventListener('DOMContentLoaded', () => {
    const listRoot = document.querySelector('.link-group');

    /* ✅ coming-soon 카드 클릭 시 이동만 막기 (토스트 없음) */
    document.addEventListener('click', e => {
        const soon = e.target.closest('.coming-soon');
        if (!soon) return;
        e.preventDefault();
    });

    fetch('games.json')
        .then(res => res.json())
        .then(data => {
            const sorted = sortData(data, 'project-desc');
            createItems(sorted);
        })
        .catch(err => console.error('games.json 로드 실패:', err));

    function sortData(data, mode) {
        const visible = data.filter(g => g.status !== 'hidden');

        const withPin = visible.map(g => {
            let pin = 0;
            if (g.badge) {
                if (g.badge.class === 'new' || g.badge.text === 'NEW') pin = 2;
                else if (g.badge.class === 'dev' || g.badge.text === '개발중') pin = 1;
            }
            return { ...g, pin };
        });

        return withPin.sort((a, b) => {
            if (a.pin !== b.pin) return b.pin - a.pin;

            if (mode === 'latest-desc') {
                const da = a.date ? parseInt(a.date.replace(/\./g, '')) : 0;
                const db = b.date ? parseInt(b.date.replace(/\./g, '')) : 0;
                return db - da || Number(b.id) - Number(a.id);
            }
            if (mode === 'name-asc') {
                return a.title.localeCompare(b.title, 'ko');
            }
            if (mode === 'project-desc') {
                return Number(b.id) - Number(a.id);
            }
            return 0;
        });
    }

    function formatDisplayDate(dateStr) {
        if (!dateStr) return "";
        const parts = dateStr.split('.');
        const isUpcoming = dateStr.includes('.00');
        const suffix = isUpcoming ? '예정' : '발매';

        if (parts[1] === '00') return `${parts[0]}년 ${suffix}`;
        if (parts[2] === '00') return `${parts[0]}년 ${parseInt(parts[1])}월 ${suffix}`;
        return `${dateStr} ${suffix}`;
    }

    function createItems(data) {
        listRoot.innerHTML = '';

        data.forEach((game, idx) => {
            const a = document.createElement('a');
            a.className = 'link-button';
            a.dataset.id = Number(game.id);
            a.dataset.title = game.title;
            a.dataset.pin = game.pin ?? 0;
            a.dataset.date = game.date || "";
            a.dataset.sub = game.sub || "";
            a.dataset.status = game.status || "released";
            a.dataset.badgeText = game.badge ? game.badge.text : "";
            a.dataset.badgeClass = game.badge ? game.badge.class : "";

            if (game.status !== 'released') {
                a.classList.add('coming-soon');
                a.href = '#';
            } else {
                a.href = game.url;
            }

            const badgeHtml = a.dataset.badgeText
                ? `<span class="badge ${a.dataset.badgeClass}">${a.dataset.badgeText}</span>`
                : '';

            const dateStr = game.date ? formatDisplayDate(game.date) : '';

            a.innerHTML = `
                <img src="${game.icon}" class="icon-img" alt="" aria-hidden="true">
                <div class="game-info">
                    <div class="game-sub">${badgeHtml} ${game.sub}</div>
                    ${dateStr ? `<div class="game-extra">${dateStr}</div>` : ''}
                    <div class="game-title">${game.title}</div>
                </div>
            `;

            a.style.animationDelay = `${Math.min(150 + idx * 60, 700)}ms`;

            listRoot.appendChild(a);
        });
    }

    function sortList(mode) {
        const items = Array.from(listRoot.children);
        const rects = new Map();
        items.forEach(el => rects.set(el, el.getBoundingClientRect()));

        items.sort((a, b) => {
            const pinA = Number(a.dataset.pin || 0);
            const pinB = Number(b.dataset.pin || 0);
            if (pinA !== pinB) return pinB - pinA;

            if (mode === 'latest-desc') {
                const dateA = a.dataset.date ? parseInt(a.dataset.date.replace(/\./g, '')) : 0;
                const dateB = b.dataset.date ? parseInt(b.dataset.date.replace(/\./g, '')) : 0;
                return dateB - dateA || Number(b.dataset.id) - Number(a.dataset.id);
            }
            if (mode === 'name-asc') {
                return a.dataset.title.localeCompare(b.dataset.title, 'ko');
            }
            if (mode === 'project-desc') {
                return Number(b.dataset.id) - Number(a.dataset.id);
            }
            return 0;
        });

        items.forEach(el => listRoot.appendChild(el));

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

    document.addEventListener('tabchange', e => {
        const tab = e.detail.tab;
        if (tab === 'latest') sortList('latest-desc');
        if (tab === 'name') sortList('name-asc');
        if (tab === 'project') sortList('project-desc');
    });
});