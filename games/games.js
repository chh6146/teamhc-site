// 준비중 오버레이 토스트 및 정렬 기능
document.addEventListener('DOMContentLoaded', function () {
    var overlay = document.getElementById('overlay-toast');
    var toastTimer = null;

    function showToast(title) {
        if (!overlay) { alert(title + '\n준비중입니다.'); return; }
        var titleEl = overlay.querySelector('.toast-title');
        if (titleEl) titleEl.textContent = '준비중입니다.';
        overlay.classList.add('visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { overlay.classList.remove('visible'); }, 1500);
    }

    if (overlay) {
        overlay.addEventListener('click', function () {
            overlay.classList.remove('visible');
            clearTimeout(toastTimer);
        });
    }

    // coming-soon handler uses toast instead of alert
    document.querySelectorAll('.coming-soon').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            var title = el.getAttribute('data-title') || '해당 항목';
            showToast(title);
        });
    });

    var listRoot = document.querySelector('.link-group');

    function getInfo(el) {
        var subEl = el.querySelector('.game-sub');
        var titleEl = el.querySelector('.game-title');
        var sub = subEl ? subEl.textContent.trim() : '';
        var name = titleEl ? titleEl.textContent.trim() : (el.textContent || '').trim();
        var match = sub.match(/(\d+)/);
        var num = match ? parseInt(match[1], 10) : null;
        // Treat '프로젝트 β' (or 'β', 'beta', '베타') as project 8
        if (num === null) {
            var lower = sub.toLowerCase();
            if (sub.indexOf('β') !== -1 || lower.indexOf('beta') !== -1 || lower.indexOf('베타') !== -1) {
                num = 8;
            }
        }
        return { el: el, sub: sub, name: name, num: num };
    }

    function sortList(mode) {
        var items = Array.from(listRoot.querySelectorAll('.link-button'));
        var infos = items.map(getInfo);

        if (mode === 'project-desc' || mode === 'project-asc') {
            var desc = mode === 'project-desc';
            infos.sort(function (a, b) {
                var aHas = a.num !== null;
                var bHas = b.num !== null;
                if (aHas && bHas) return desc ? b.num - a.num : a.num - b.num;
                if (aHas && !bHas) return -1;
                if (!aHas && bHas) return 1;
                return a.name.localeCompare(b.name, 'ko');
            });
        } else if (mode === 'name-asc') {
            infos.sort(function (a, b) {
                return a.name.localeCompare(b.name, 'ko');
            });
        } else if (mode === 'name-desc') {
            infos.sort(function (a, b) {
                return b.name.localeCompare(a.name, 'ko');
            });
        }

        // FLIP animation: record initial positions
        var firstRects = new Map();
        items.forEach(function (el) { firstRects.set(el, el.getBoundingClientRect()); });

        // re-attach in order (DOM change)
        infos.forEach(function (info) { listRoot.appendChild(info.el); });

        // record final positions and apply inverted transforms
        infos.forEach(function (info) {
            var el = info.el;
            var first = firstRects.get(el);
            var last = el.getBoundingClientRect();
            var dx = first.left - last.left;
            var dy = first.top - last.top;
            if (dx || dy) {
                el.style.transition = 'none';
                el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
                // force reflow
                el.getBoundingClientRect();
                // play to natural position
                el.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1)';
                el.style.transform = '';
                // cleanup after transition
                (function(node){
                    var handler = function(){
                        node.style.transition = '';
                        node.style.transform = '';
                        node.removeEventListener('transitionend', handler);
                    };
                    node.addEventListener('transitionend', handler);
                })(el);
            }
        });
    }

    // initial sort (프로젝트 최신순)
    sortList('project-desc');

    // segment control removed — bottom tabs used instead

    // top filters and bottom-sheet removed — no chip or sheet logic
    var backdrop = null;

// --- Bottom tabbar (segmented) interactions ---
    var segButtons = document.querySelectorAll('.bottom-tabbar .seg-group button');
    if (segButtons && segButtons.length) {
        segButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                // 모든 버튼에서 active 제거
                segButtons.forEach(function (b) { 
                    b.classList.remove('active'); 
                    b.setAttribute('aria-pressed', 'false'); 
                });
                
                // 클릭된 버튼에 active 추가
                btn.classList.add('active'); 
                btn.setAttribute('aria-pressed', 'true');
                
                // 정렬 실행
                var t = btn.getAttribute('data-tab');
                if (t === 'latest') { 
                    sortList('project-desc'); 
                } else if (t === 'name') { 
                    sortList('name-asc'); 
                }
            }); // <--- 이 부분의 닫는 괄호가 누락되었었습니다.
        });
    }
});
