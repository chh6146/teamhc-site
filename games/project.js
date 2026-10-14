/* ==========================================================================
   Project Detail Page Controller
   ========================================================================== */

/* ---------- 1. Lightbox ---------- */
const Lightbox = {
    overlay: null,
    content: null,

    init() {
        this.overlay = document.getElementById("imageLightbox");
        this.content = document.getElementById("fullImage");
        if (!this.overlay || !this.content) return;

        this.overlay.addEventListener("click", () => this.close());

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.close();
        });
    },

    open(src) {
        if (!this.overlay || !this.content) return;
        this.content.style.opacity = "0";
        this.content.src = src;
        this.content.onload = () => { this.content.style.opacity = "1"; };
        this.overlay.style.display = "block";
        document.body.style.overflow = "hidden";
    },

    close() {
        if (!this.overlay) return;
        this.overlay.style.display = "none";
        document.body.style.overflow = "";
    }
};

/* ---------- 2. Badge Toast ---------- */
function openItem(title, desc, imgSrc) {
    const modal = document.getElementById('badge-toast');
    if (!modal) return;
    modal.querySelector('.badge-title').innerText = title;
    modal.querySelector('.badge-desc').innerText = desc;
    modal.querySelector('.badge-img').src = imgSrc;
    modal.classList.add('visible');
}

function closeBadge() {
    const modal = document.getElementById('badge-toast');
    if (modal) modal.classList.remove('visible');
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('badge-toast');
    if (modal && e.target === modal) closeBadge();
});

/* ---------- 3. 헤더 스크롤 효과 ---------- */
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let ticking = false;
    const update = () => {
        if (window.scrollY > 20) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    }, { passive: true });

    update();
}

/* ---------- 4. 앵커 탭 (버튼 방식, 히스토리 안 쌓임) ---------- */
function initAnchorHighlight() {
    const tabs = document.querySelectorAll('.anchor-tabs button');
    const sections = document.querySelectorAll('section[id]');
    if (!tabs.length || !sections.length) return;

    const header = document.querySelector('.site-header');

    const setActive = (id) => {
        tabs.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.target === id);
        });
    };

    function getHeaderOffset() {
        if (!header) return 110;
        const rect = header.getBoundingClientRect();
        return rect.height + 40;
    }

    function updateActive() {
        const headerOffset = getHeaderOffset();
        const scrollY = window.scrollY + headerOffset;

        let currentId = sections[0].id;

        sections.forEach(sec => {
            if (scrollY >= sec.offsetTop) {
                currentId = sec.id;
            }
        });

        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) {
            currentId = sections[sections.length - 1].id;
        }

        setActive(currentId);
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActive();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', updateActive);

    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const target = document.getElementById(targetId);
            if (!target) return;

            const headerOffset = getHeaderOffset();
            const targetY = target.offsetTop - headerOffset + 10;

            window.scrollTo({
                top: targetY,
                behavior: 'smooth'
            });
        });
    });

    updateActive();
}

/* ---------- 5. Home Icon ---------- */
function injectHomeIcon() {
    const homeIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>`;
    const container = document.getElementById('homeIcon');
    if (container) container.innerHTML = homeIcon;
}

/* ---------- 6. 기기 감지 ---------- */
function detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);

    if (!isIos && !isAndroid) return;

    if (isIos) {
        document.querySelectorAll('.tab-button.aos').forEach(el => el.style.display = 'none');
    } else if (isAndroid) {
        document.querySelectorAll('.tab-button.ios').forEach(el => el.style.display = 'none');
    }
}

/* ---------- 7. 프로젝트 데이터 로드 ---------- */
function loadProjectData() {
    if (typeof CURRENT_PROJECT_ID === 'undefined') return;

    const subEl = document.querySelector('.hero-sub');
    const titleEl = document.querySelector('.hero-title');

    fetch('games.json')
        .then(res => res.json())
        .then(data => {
            const game = data.find(g => Number(g.id) === CURRENT_PROJECT_ID);
            if (!game) return;

            const formatDate = (dateStr) => {
                if (!dateStr) return "";
                const parts = dateStr.split('.');
                const isUpcoming = dateStr.includes('.00');
                const suffix = isUpcoming ? '예정' : '발매';
                if (parts[1] === '00') return `${parts[0]}년 ${suffix}`;
                if (parts[2] === '00') return `${parts[0]}년 ${parseInt(parts[1])}월 ${suffix}`;
                return `${dateStr} ${suffix}`;
            };

            if (subEl) subEl.textContent = `${game.sub} · ${formatDate(game.date)}`;
            if (titleEl) titleEl.textContent = game.title;

            document.title = `${game.title} - Team HC`;
        })
        .catch(err => console.error("데이터 로드 실패:", err));
}

/* ---------- 8. Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
    Lightbox.init();

    document.querySelectorAll('.feature-card img, .character-card img, .screenshot-grid img').forEach(img => {
        img.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            Lightbox.open(img.src);
        });
    });

    injectHomeIcon();
    detectDevice();
    loadProjectData();
    initHeaderScroll();
    initAnchorHighlight();
});

/* ==========================================================================
   Hero Parallax (애플 스타일 - 살짝 딸려 올라가는 효과)
   ========================================================================== */
(function() {
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');
    
    if (!hero || !heroBg) return;
    
    // 모바일에서는 비활성화 (성능 + iOS 이슈)
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
    
    // 사용자가 모션 최소화를 원하면 비활성화
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    let ticking = false;
    
    function updateParallax() {
        const rect = hero.getBoundingClientRect();
        
        // hero가 화면에 보이는 동안만
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            // 스크롤한 만큼의 30%만 이미지를 위로 이동
            // 0.3 = 굼뜬 정도 (작을수록 더 굼뜸)
            const scrolled = rect.top * 0.3;
            heroBg.style.transform = `translateY(${scrolled}px)`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
    
    // 초기 실행
    updateParallax();
})();