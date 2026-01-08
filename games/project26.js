// 1. 아이템 열기 함수
function openItem(title, desc, imgSrc) {
    const modal = document.getElementById('badge-toast');
    if (modal) {
        // 내부 내용 변경
        modal.querySelector('.badge-title').innerText = title;
        modal.querySelector('.badge-desc').innerText = desc;
        modal.querySelector('.badge-img').src = imgSrc;
        
        // 보이기
        modal.classList.add('visible');
    }
}

// 2. 아이템 닫기 함수
function closeBadge() {
    const modal = document.getElementById('badge-toast');
    if (modal) {
        modal.classList.remove('visible');
    }
}

// 3. 배경(블러) 클릭 시 닫기 기능
window.addEventListener('click', (e) => {
    const modal = document.getElementById('badge-toast');
    // 클릭된 대상(e.target)이 모달의 가장 바깥 배경(overlay)인 경우에만 닫기
    if (e.target === modal) {
        closeBadge();
    }
});