document.addEventListener("DOMContentLoaded", () => {
  const layoutToggle = document.getElementById("layoutToggle");
  const mainContainer = document.getElementById("mainContainer");

  const modeRadios = document.querySelectorAll('input[name="mode"]');
  const gradeInput = document.getElementById("gradeInput");

  const resultUpper = document.getElementById("resultUpper");
  const resultMean = document.getElementById("resultMean");
  const resultLower = document.getElementById("resultLower");
  const statusMessage = document.getElementById("statusMessage");

  const tableInputLabel = document.getElementById("tableInputLabel");
  const tableUpperLabel = document.getElementById("tableUpperLabel");
  const tableMeanLabel = document.getElementById("tableMeanLabel");
  const tableLowerLabel = document.getElementById("tableLowerLabel");

  const modeConfig = {
    g1: {
      inputKey: "grade9",
      inputLabel: "9등급",
      outputLabel: "5등급",
      min: 1.0,
      max: 9.0,
      table: window.G1_9TO5 || []
    },
    g2: {
      inputKey: "grade5",
      inputLabel: "5등급",
      outputLabel: "9등급",
      min: 1.0,
      max: 5.0,
      table: window.G2_5TO9 || []
    }
  };

  let currentMode = getSelectedMode();

  initialize();

  function initialize() {
    applyMode(currentMode);
    bindEvents();
    renderCurrentState();
  }

  function bindEvents() {
    layoutToggle.addEventListener("click", toggleLayout);

    modeRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        currentMode = getSelectedMode();
        applyMode(currentMode);
        renderCurrentState();
      });
    });

    gradeInput.addEventListener("input", () => {
      renderCurrentState();
    });
  }

  function toggleLayout() {
    if (mainContainer.classList.contains("horizontal")) {
      mainContainer.classList.remove("horizontal");
      mainContainer.classList.add("vertical");
    } else {
      mainContainer.classList.remove("vertical");
      mainContainer.classList.add("horizontal");
    }
  }

  function getSelectedMode() {
    const selected = document.querySelector('input[name="mode"]:checked');
    return selected ? selected.value : "g1";
  }

  function applyMode(mode) {
    const config = modeConfig[mode];

    gradeInput.min = config.min.toFixed(2);
    gradeInput.max = config.max.toFixed(2);
    gradeInput.step = "0.01";
    gradeInput.placeholder = `${config.min.toFixed(2)} ~ ${config.max.toFixed(2)}`;

    tableInputLabel.textContent = config.inputLabel;
    tableUpperLabel.textContent = `${config.outputLabel}(상)`;
    tableMeanLabel.textContent = `${config.outputLabel}(평균)`;
    tableLowerLabel.textContent = `${config.outputLabel}(하)`;

    clearResults();
  }

  function renderCurrentState() {
    const config = modeConfig[currentMode];
    const rawValue = gradeInput.value.trim();

    if (rawValue === "") {
      clearResults();
      setStatus("");
      renderTable(config.table, config.inputKey, []);
      return;
    }

    const validation = validateGradeInput(rawValue, config.min, config.max);

    if (!validation.valid) {
      clearResults();
      setStatus(validation.message);
      renderTable(config.table, config.inputKey, []);
      return;
    }

    const numericValue = Number(rawValue);
    const lookupResult = findGradeResult(numericValue, config.table, config.inputKey);

    if (!lookupResult.found) {
      clearResults();
      setStatus("표에 일치하는 값이 없음");
      renderTable(config.table, config.inputKey, []);
      return;
    }

    displayResults(lookupResult.result);
    setStatus(buildStatusMessage(lookupResult));
    renderTable(config.table, config.inputKey, lookupResult.highlightKeys);

    scrollToFirstHighlight();
  }

  function displayResults(result) {
    resultUpper.textContent = formatNumber(result.upper);
    resultMean.textContent = formatNumber(result.mean);
    resultLower.textContent = formatNumber(result.lower);
  }

  function clearResults() {
    resultUpper.textContent = "-";
    resultMean.textContent = "-";
    resultLower.textContent = "-";
  }

  function setStatus(message) {
    statusMessage.textContent = message;
  }

  function buildStatusMessage(lookupResult) {
    if (lookupResult.type === "exact") {
      return `표와 일치하는 값: ${formatNumber(lookupResult.input)}`;
    }

    if (lookupResult.type === "interpolated") {
      return `표에 일치하는 값이 없으므로 ${formatNumber(lookupResult.lowerKey)} ~ ${formatNumber(lookupResult.upperKey)} 사이에서 보간 추정`;
    }

    return "";
  }

  function scrollToFirstHighlight() {
    const highlightedRow = document.querySelector("#tableBody .highlight");
    if (highlightedRow) {
      highlightedRow.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  }
});

function renderDividerImages() {

  const divider = document.getElementById("panelDivider");
  if (!divider) return;

  divider.innerHTML = "";

  const pattern = [
    "img/img01.png",
    "img/img02.png",
    "img/img03.png"
  ];

  const horizontal = document
    .getElementById("mainContainer")
    .classList.contains("horizontal");

  const size = horizontal
    ? divider.clientWidth
    : divider.clientHeight;

  const step = 38;

  const count = Math.ceil(size / step) + 3;

  for (let i = 0; i < count; i++) {

    const img = document.createElement("img");
    img.src = pattern[i % 3];

    divider.appendChild(img);

  }
}

renderDividerImages();
window.addEventListener("resize", renderDividerImages);