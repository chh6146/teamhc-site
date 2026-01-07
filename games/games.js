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

    // 준비중 항목 클릭 핸들러
    document.querySelectorAll('.coming-soon').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            var title = el.getAttribute('data-title') || '해당 항목';
            showToast(title);
        });
    });

    var listRoot = document.querySelector('.link-group');

    // [수정] 항목 정보 추출 시 NEW 뱃지 유무 확인 추가
    function getInfo(el) {
        var subEl = el.querySelector('.game-sub');
        var titleEl = el.querySelector('.game-title');
        
        // NEW 뱃지(<span class="new-badge">)가 있는지 체크
        var isNew = el.querySelector('.new-badge') !== null; 

        var sub = subEl ? subEl.textContent.trim() : '';
        var name = titleEl ? titleEl.textContent.trim() : (el.textContent || '').trim();
        var match = sub.match(/(\d+)/);
        var num = match ? parseInt(match[1], 10) : null;

        // 베타 버전 숫자 처리
        if (num === null) {
            var lower = sub.toLowerCase();
            if (sub.indexOf('β') !== -1 || lower.indexOf('beta') !== -1 || lower.indexOf('베타') !== -1) {
                num = 8;
            }
        }
        return { el: el, sub: sub, name: name, num: num, isNew: isNew };
    }

    // [수정] 정렬 로직: NEW 우선 정렬 반영
    function sortList(mode) {
        var items = Array.from(listRoot.querySelectorAll('.link-button'));
        var infos = items.map(getInfo);

        infos.sort(function (a, b) {
            // 1순위 정렬: NEW 뱃지가 있으면 최상단으로 (a가 NEW면 위로)
            if (a.isNew && !b.isNew) return -1;
            if (!a.isNew && b.isNew) return 1;

            // 2순위 정렬: 선택된 모드에 따름
            if (mode === 'project-desc' || mode === 'project-asc') {
                var desc = mode === 'project-desc';
                var aHas = a.num !== null;
                var bHas = b.num !== null;
                if (aHas && bHas) return desc ? b.num - a.num : a.num - b.num;
                if (aHas && !bHas) return -1;
                if (!aHas && bHas) return 1;
                return a.name.localeCompare(b.name, 'ko');
            } else if (mode === 'name-asc') {
                return a.name.localeCompare(b.name, 'ko');
            } else if (mode === 'name-desc') {
                return b.name.localeCompare(a.name, 'ko');
            }
            return 0;
        });

        // FLIP 애니메이션: 위치 기록 및 부드러운 이동
        var firstRects = new Map();
        items.forEach(function (el) { firstRects.set(el, el.getBoundingClientRect()); });

        // DOM 재배치
        infos.forEach(function (info) { listRoot.appendChild(info.el); });

        infos.forEach(function (info) {
            var el = info.el;
            var first = firstRects.get(el);
            var last = el.getBoundingClientRect();
            var dx = first.left - last.left;
            var dy = first.top - last.top;
            if (dx || dy) {
                el.style.transition = 'none';
                el.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
                el.getBoundingClientRect(); // 강제 리플로우
                el.style.transition = 'transform 420ms cubic-bezier(.2,.8,.2,1)';
                el.style.transform = '';
                
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

    // 초기 정렬 실행
    sortList('project-desc');

    // 하단 탭바 정렬 버튼 인터랙션
    var segButtons = document.querySelectorAll('.bottom-tabbar .seg-group button');
    if (segButtons && segButtons.length) {
        segButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                segButtons.forEach(function (b) { 
                    b.classList.remove('active'); 
                    b.setAttribute('aria-pressed', 'false'); 
                });
                
                btn.classList.add('active'); 
                btn.setAttribute('aria-pressed', 'true');
                
                var t = btn.getAttribute('data-tab');
                if (t === 'latest') { 
                    sortList('project-desc'); 
                } else if (t === 'name') { 
                    sortList('name-asc'); 
                }
            });
        });
    }
});