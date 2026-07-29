document.addEventListener("DOMContentLoaded", () => {
  const layoutToggle = document.getElementById("layoutToggle");
  const mainContainer = document.getElementById("mainContainer");
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  const gradeInput = document.getElementById("gradeInput");
  const statusMessage = document.getElementById("statusMessage");

  // 스테퍼 디스플레이 요소
  const d1 = document.getElementById("d1");
  const d2 = document.getElementById("d2");
  const d3 = document.getElementById("d3");

  let currentMode = "g1";

  // 🌟 테이블 클릭 시 호출될 전역 함수
  window.updateGradeFromTable = (value) => {
    gradeInput.value = Number(value).toFixed(2);
    syncDisplayWithInput();
    renderCurrentState();
  };

  // 🌟 스테퍼 자릿수 조절 함수
  window.adjustDigit = (pos, amount) => {
    let currentVal = parseFloat(gradeInput.value);
    let delta = 0;
    if (pos === 0) delta = amount * 1;
    else if (pos === 1) delta = amount * 0.1;
    else if (pos === 2) delta = amount * 0.01;

    let newVal = Math.round((currentVal + delta) * 100) / 100;

    // 범위 제한
    const config = modeConfig[currentMode];
    if (newVal < config.min) newVal = config.min;
    if (newVal > config.max) newVal = config.max;

    gradeInput.value = newVal.toFixed(2);
    syncDisplayWithInput();
    renderCurrentState();
  };

  function syncDisplayWithInput() {
    const valStr = Number(gradeInput.value).toFixed(2);
    const parts = valStr.split('.');
    d1.textContent = parts[0];
    d2.textContent = parts[1][0];
    d3.textContent = parts[1][1];
  }

  const modeConfig = {
    g1: { inputKey: "grade9", min: 1.0, max: 9.0, table: window.G1_9TO5 || [] },
    g2: { inputKey: "grade5", min: 1.0, max: 5.0, table: window.G2_5TO9 || [] }
  };

  window.calculateCumulativePercent = calculateCumulativePercent;

  function initialize() {
    syncDisplayWithInput();
    bindEvents();
    renderCurrentState();
  }

  function bindEvents() {
    layoutToggle.addEventListener("click", () => {
      mainContainer.classList.toggle("horizontal");
      mainContainer.classList.toggle("vertical");
    });

    modeRadios.forEach(radio => {
      radio.addEventListener("change", (e) => {
        currentMode = e.target.value;
        gradeInput.value = "1.00";
        syncDisplayWithInput();
        renderCurrentState();
      });
    });
  }

  function renderCurrentState() {
    const config = modeConfig[currentMode];
    const val = Number(gradeInput.value);
    const lookupResult = findGradeResult(val, config.table, config.inputKey);

    if (lookupResult.found) {
      displayResults(lookupResult.result, calculateCumulativePercent(currentMode === "g1" ? val : lookupResult.result.mean));
      renderTable(config.table, config.inputKey, lookupResult.highlightKeys);
      scrollToFirstHighlight();
    }
  }

  function calculateCumulativePercent(grade9Value) {
    const data = window.CUMULATIVE_DATA;
    if (!data) return null;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i].grade9 <= grade9Value && grade9Value <= data[i+1].grade9) {
        const ratio = (grade9Value - data[i].grade9) / (data[i+1].grade9 - data[i].grade9);
        return data[i].percent + ratio * (data[i+1].percent - data[i].percent);
      }
    }
    return null;
  }

  function displayResults(res, pct) {
    document.getElementById("resultUpper").textContent = res.upper.toFixed(2);
    document.getElementById("resultMean").textContent = res.mean.toFixed(2);
    document.getElementById("resultLower").textContent = res.lower.toFixed(2);
    document.getElementById("resultPercent").textContent = pct ? `상위 ${pct.toFixed(2)}%` : "- %";
  }

  // 🌟 2. 뷰포트 고정 스크롤 로직
  function scrollToFirstHighlight() {
    const highlightedRow = document.querySelector("#tableBody .highlight");
    if (highlightedRow) {
      const container = document.getElementById("tablePanel");
      const thead = document.querySelector("#gradeTable thead");

      // 표 헤더(thead)의 실제 높이를 가져옵니다.
      const headerHeight = thead ? thead.offsetHeight : 0;
      const rowOffset = highlightedRow.offsetTop;

      // 하이라이트된 행의 위치에서 헤더 높이만큼만 빼주어 바로 밑에 딱 붙게 스크롤합니다.
      container.scrollTo({
        top: rowOffset - headerHeight,
        behavior: "smooth"
      });
    }
  }

  initialize();
});
