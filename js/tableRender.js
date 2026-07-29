function renderTable(table, inputKey, highlightKeys) {
  const tableBody = document.getElementById("tableBody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  table.forEach((row) => {
    const tr = document.createElement("tr");
    const keyValue = Number(row[inputKey]);

    // 🌟 3. 행 클릭 시 상단 입력값으로 반영
    tr.onclick = () => {
        if (window.updateGradeFromTable) {
            window.updateGradeFromTable(keyValue);
        }
    };

    if (highlightKeys.includes(keyValue)) {
      tr.classList.add("highlight");
    }

    // 각 셀 생성
    tr.appendChild(createCell(Math.floor(keyValue)));
    tr.appendChild(createCell(keyValue.toFixed(2)));
    tr.appendChild(createCell(row.upper.toFixed(2)));
    tr.appendChild(createCell(row.mean.toFixed(2)));
    tr.appendChild(createCell(row.lower.toFixed(2)));

    // 누적비 계산 및 추가
    let targetG9 = (inputKey === "grade9") ? keyValue : row.mean;
    let pct = window.calculateCumulativePercent ? window.calculateCumulativePercent(targetG9) : null;
    tr.appendChild(createCell(pct ? pct.toFixed(2) + "%" : "-"));

    tableBody.appendChild(tr);
  });
}

function createCell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}
