/* ================================================
   상호 & 수완의 러브 다이어리 - 자바스크립트
   ================================================
   
   📌 수정 가이드:
   - D-Day 날짜 변경: calcDDay() 함수의 startDate 수정
   - 페이지 수 변경: totalPapers 값 수정
   - 파티클 효과 변경: initParticles() 함수 수정
   
   ================================================ */


/* ================================================
   📌 설정값 (여기서 쉽게 변경!)
   ================================================ */
const CONFIG = {
  // 📅 사귀기 시작한 날짜 (YYYY-MM-DD 형식)
  startDate: '2025-04-13',
  
  // 📄 총 페이지 수 (표지 포함)
  // 페이지 추가하면 이 숫자도 늘려주세요!
  totalPapers: 6,
  
  // ⏱️ 페이지 넘김 속도 (밀리초)
  flipDelay: 800,
  
  // 🎨 파티클 개수
  particleCount: 60
};


/* ================================================
   📊 전역 변수
   ================================================ */
let currentPage = 0;      // 현재 페이지 번호
let isFlipping = false;   // 페이지 넘기는 중인지


/* ================================================
   📅 D-Day 계산
   ================================================ */
function calcDDay() {
  const today = new Date();
  const startDate = new Date(CONFIG.startDate);
  
  // 날짜 차이 계산
  const timeDiff = today.getTime() - startDate.getTime();
  // 날짜 차이 계산 (시작일 포함 = +1)
  const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24)) + 1;
  
  // D-Day 표시
  const ddayElement = document.getElementById('d-day-count');
  if (ddayElement) {
    if (dayDiff >= 0) {
      ddayElement.innerText = "D+" + (dayDiff);
    } else {
      ddayElement.innerText = "D" + dayDiff;
    }
  }
}


/* ================================================
   📖 페이지 넘김 업데이트
   ================================================ */
function updateBook() {
  const papers = document.querySelectorAll('.paper');
  
  // 각 페이지 상태 업데이트
  papers.forEach((paper, index) => {
    if (index < currentPage) {
      // 이미 넘긴 페이지
      paper.classList.add('open');
      paper.style.zIndex = 100 + index;
    } else {
      // 아직 안 넘긴 페이지
      paper.classList.remove('open');
      paper.style.zIndex = 60 - index;
    }
  });

  // 그림자 & 바닥면 처리 (마지막 페이지에서 숨김)
  const shadow = document.querySelector('.shadow');
  const bottom = document.querySelector('.bottom');
  
  if (currentPage === CONFIG.totalPapers) {
    shadow.style.display = 'none';
    bottom.style.display = 'none';
  } else {
    shadow.style.display = 'block';
    bottom.style.display = 'block';
  }

  // 책 회전 효과 (PC에서만)
  const book = document.querySelector('.book');
  if (window.innerWidth > 768) {
    if (currentPage > 0) {
      book.style.transform = 'rotateX(10deg) rotateY(0deg) rotateZ(0deg)';
    } else {
      book.style.transform = 'rotateX(30deg) rotateY(0deg) rotateZ(-30deg)';
    }
  }
}


/* ================================================
   🖱️ 마우스 휠 이벤트
   ================================================ */
function handleWheel(e) {
  if (isFlipping) return;
  
  if (e.deltaY > 0 && currentPage < CONFIG.totalPapers) {
    // 아래로 스크롤 = 다음 페이지
    currentPage++;
    updateBook();
  } else if (e.deltaY < 0 && currentPage > 0) {
    // 위로 스크롤 = 이전 페이지
    currentPage--;
    updateBook();
  }
  
  // 연속 넘김 방지
  isFlipping = true;
  setTimeout(() => { isFlipping = false; }, CONFIG.flipDelay);
}


/* ================================================
   👆 클릭 이벤트
   ================================================ */
function handlePaperClick(paper) {
  if (paper.classList.contains('open')) {
    // 열린 페이지 클릭 = 이전 페이지
    if (currentPage > 0) {
      currentPage--;
      updateBook();
    }
  } else {
    // 닫힌 페이지 클릭 = 다음 페이지
    if (currentPage < CONFIG.totalPapers) {
      currentPage++;
      updateBook();
    }
  }
}


/* ================================================
   📱 터치 이벤트 (모바일)
   ================================================ */
let touchStartY = 0;

function handleTouchStart(e) {
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  const touchEndY = e.changedTouches[0].screenY;
  
  if (isFlipping) return;
  
  // 위로 스와이프 = 다음 페이지
  if (touchStartY - touchEndY > 50 && currentPage < CONFIG.totalPapers) {
    currentPage++;
    updateBook();
    isFlipping = true;
    setTimeout(() => { isFlipping = false; }, CONFIG.flipDelay);
  }
  // 아래로 스와이프 = 이전 페이지
  else if (touchEndY - touchStartY > 50 && currentPage > 0) {
    currentPage--;
    updateBook();
    isFlipping = true;
    setTimeout(() => { isFlipping = false; }, CONFIG.flipDelay);
  }
}


/* ================================================
   ✨ 파티클 효과 초기화
   ================================================ */
function initParticles() {
  tsParticles.load("tsparticles", {
    autoPlay: true,
    fullScreen: { enable: true, zIndex: 0 },
    detectRetina: true,
    fpsLimit: 120,
    particles: {
      color: { value: "#ffffff" },
      move: {
        direction: "bottom",
        enable: true,
        speed: 1
      },
      number: {
        density: { enable: true, area: 800 },
        value: CONFIG.particleCount
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 2, max: 5 } }
    }
  });
}


/* ================================================
   🚀 이벤트 리스너 등록
   ================================================ */
function initEventListeners() {
  // 마우스 휠
  window.addEventListener('wheel', handleWheel);
  
  // 페이지 클릭
  document.querySelectorAll('.paper').forEach(paper => {
    paper.addEventListener('click', () => handlePaperClick(paper));
  });
  
  // 터치 이벤트 (모바일)
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);
}


/* ================================================
   🎬 페이지 로드 시 초기화
   ================================================ */
window.addEventListener('load', () => {
  // D-Day 계산
  calcDDay();
  
  // 파티클 효과 시작
  initParticles();
  
  // 이벤트 리스너 등록
  initEventListeners();
  
  // 로딩 화면 숨기기
  setTimeout(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }, 800);
});


/* ================================================
   📌 페이지 추가 방법
   ================================================
   
   1. index.html에서 새 페이지 추가:
      <!-- 📄 페이지 N: 제목 -->
      <div class="paper" id="pN">
        <div class="page front">
          ... 내용 ...
        </div>
        <div class="page back"></div>
      </div>
   
   2. style.css에서 z-index 추가:
      #pN { z-index: ?; }
      (숫자가 작을수록 뒤에 있음)
   
   3. 이 파일 상단의 CONFIG.totalPapers 값 +1
   
   ================================================ */
