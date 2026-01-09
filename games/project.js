/**
 * 이미지 라이트박스 및 UI 컨트롤러
 */

// 1. 라이트박스 열기/닫기 로직 (객체로 묶어 관리)
const Lightbox = {
    overlay: null,
    content: null,

    init() {
        this.overlay = document.getElementById("imageLightbox");
        this.content = document.getElementById("fullImage");

        if (!this.overlay || !this.content) return;

        // [수정] 배경, 이미지, X버튼 등 '오버레이 영역 내 어디든' 클릭하면 닫기
        this.overlay.addEventListener("click", () => {
            this.close();
        });

        // [추가] 이미지 자체를 클릭했을 때 닫기가 발생하는 것을 방지하고 싶다면 아래 주석을 해제하세요.
        // 하지만 "어딜 터치하건" 닫히길 원하시니 위 코드로 충분합니다.

        // ESC 키 누르면 닫기
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.close();
        });
    },

    open(src) {
        if (!this.overlay || !this.content) return;
        
        // 이미지 로딩 전 이전 이미지 잔상 제거
        this.content.style.opacity = "0";
        this.content.src = src;
        
        // 이미지가 로드된 후 자연스럽게 보여주기
        this.content.onload = () => {
            this.content.style.opacity = "1";
        };

        this.overlay.style.display = "block";
        document.body.style.overflow = "hidden";
    },

    close() {
        if (!this.overlay) return;
        this.overlay.style.display = "none";
        document.body.style.overflow = "auto";
    }
};

// 2. 실행부
document.addEventListener("DOMContentLoaded", () => {
    // 라이트박스 설정 초기화
    Lightbox.init();

    // 이미지 대상 수집 및 이벤트 바인딩
    const selectors = '.card .media img, .link-button img, .icon-img';
    const images = document.querySelectorAll(selectors);
    
    images.forEach(img => {
        // 스타일은 CSS에서 처리하는 것이 좋으나, JS에서도 확인 차 추가
        img.style.cursor = 'zoom-in';
        
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            Lightbox.open(img.src);
        });
    });
});

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

// 4. 탭 전환 함수
(function() {
    document.addEventListener("click", function (e) {
        const btn = e.target.closest('.tab-inner button');
        if (!btn) return;

        const group = btn.closest('.tab-inner');
        const slider = group.querySelector('.tab-slider'); 
        const buttons = Array.from(group.querySelectorAll('.tab-item'));
        const index = buttons.indexOf(btn);

        if (index === -1) return;

        // 1. 버튼 활성화 클래스 처리
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 2. 슬라이더 이동
        if (slider) {
            slider.style.transform = `translateX(${index * 100}%)`;
        }
        
        // 3. 탭 콘텐츠 전환 (핵심 수정 부분)
        // 클릭한 버튼의 onclick에 들어있는 ID값을 가져와서 해당 섹션만 보여줍니다.
        const tabId = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        
        // 모든 섹션 숨기기
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => content.classList.remove('active'));

        // 선택한 섹션만 보이기
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
    }, true);
})();

document.addEventListener("DOMContentLoaded", () => {
    const tabInner = document.querySelector('.tab-inner');
    const buttons = document.querySelectorAll('.tab-item');
    
    if (tabInner && buttons.length > 0) {
        // [자동화 핵심] 버튼 개수를 세어서 CSS 변수(--tab-count)로 주입
        tabInner.style.setProperty('--tab-count', buttons.length);
    }
});

function showTab(tabId, index) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-item');
    const slider = document.querySelector('.tab-slider');

    // 활성화 상태 변경
    tabs.forEach(tab => tab.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    buttons[index].classList.add('active');

    // 슬라이더 이동 (자기 자신의 너비 100% 만큼 옆으로 이동)
    slider.style.transform = `translateX(${index * 100}%)`;
}