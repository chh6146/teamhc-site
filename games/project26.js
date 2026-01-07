function openBadge() {
    const modal = document.getElementById('badge-toast');
    if (modal) {
        // 즉시 클래스를 추가하여 블러와 애니메이션 시작
        modal.classList.add('visible');
    }
}

function closeBadge() {
    const modal = document.getElementById('badge-toast');
    if (modal) {
        modal.classList.remove('visible');
    }
}

// 배경 클릭 시 닫기
window.addEventListener('click', (e) => {
    const modal = document.getElementById('badge-toast');
    if (e.target === modal) {
        closeBadge();
    }
});