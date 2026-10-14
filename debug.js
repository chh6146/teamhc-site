document.addEventListener("DOMContentLoaded", () => {
    let logoClickCount = 0;
    const mainLogo = document.getElementById("mainLogo");
    const devToast = document.getElementById("devToast");
    const devLink = document.getElementById("devLink");

    if (!mainLogo || !devLink) return;

    // 초기화
    devLink.classList.remove("reveal");
    if (devToast) devToast.classList.remove("show");

    mainLogo.addEventListener("click", () => {
        // 이미 활성화된 상태면 카운트 중단
        if (devLink.classList.contains("reveal")) return;

        logoClickCount++;

        if (logoClickCount === 10) {
            // 토스트
            if (devToast) {
                devToast.classList.add("show");
                setTimeout(() => devToast.classList.remove("show"), 3000);
            }

            // reveal 애니메이션 재실행 트릭
            devLink.classList.remove("reveal");
            void devLink.offsetWidth;
            devLink.classList.add("reveal");

            logoClickCount = 0;
        }
    });
});