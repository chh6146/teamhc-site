document.addEventListener("DOMContentLoaded", () => {
    let logoClickCount = 0;
    const mainLogo = document.getElementById("mainLogo");
    const devToast = document.getElementById("devToast");
    const devLink = document.getElementById("devLink");

    // [1] 페이지 로드 시 무조건 초기화 (혹시 남아있을 클래스 제거)
    if (devLink) {
        devLink.classList.remove("reveal");
    }
    if (devToast) {
        devToast.classList.remove("show");
    }

    if (mainLogo) {
        mainLogo.addEventListener("click", () => {
            // 이미 활성화된 상태라면 더 이상 카운트하지 않음
            if (devLink && devLink.classList.contains("reveal")) return;

            logoClickCount++;

            if (logoClickCount === 10) {
                // [2] 토스트 알림 표시
                if (devToast) {
                    devToast.classList.add("show");
                    
                    // 3초 후 토스트만 자동으로 사라짐
                    setTimeout(() => {
                        devToast.classList.remove("show");
                    }, 3000);
                }

                // [3] 숨겨진 버튼 등장
                if (devLink) {
                    devLink.classList.add("reveal");
                }

                // 카운트 초기화
                logoClickCount = 0;
            }
        });
    }
});