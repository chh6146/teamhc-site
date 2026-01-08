// tabbar.js
(function() {
    // 캡처링(true)을 사용하여 games.js보다 먼저 실행되게 함
    document.addEventListener("click", function (e) {
        // 1. 클릭된 게 .seg-group 안의 버튼인지 확인
        const btn = e.target.closest('.seg-group button');
        if (!btn) return;

        const group = btn.closest('.seg-group');
        const buttons = Array.from(group.querySelectorAll('button'));
        const index = buttons.indexOf(btn);

        // 2. 흰 박스 이동 클래스 처리 (부모인 .seg-group에 부여)
        if (index === 0) {
            group.classList.remove('en-active');
        } else {
            group.classList.add('en-active');
        }

        // 3. 글자색 변경 (active 클래스)
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // 주의: 정렬 기능(sortList)은 games.js가 알아서 처리하도록 둡니다.
    }, true); 
})();