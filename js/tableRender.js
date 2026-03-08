function renderTable(table, inputKey, highlightKeys) {
  const tableBody = document.getElementById("tableBody");

  if (!tableBody) {
    return;
  }

  tableBody.innerHTML = "";

  if (!Array.isArray(table) || table.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");

    emptyCell.colSpan = 5;
    emptyCell.textContent = "표에 원자료 없음";

    emptyRow.appendChild(emptyCell);
    tableBody.appendChild(emptyRow);
    return;
  }

  const normalizedHighlightKeys = Array.isArray(highlightKeys)
    ? highlightKeys.map((value) => Number(value))
    : [];

  table.forEach((row) => {
    const tr = document.createElement("tr");

    const keyValue = Number(row[inputKey]);
    const bucketValue = Math.floor(keyValue);

    if (isHighlighted(keyValue, normalizedHighlightKeys)) {
      tr.classList.add("highlight");
    }

    tr.appendChild(createCell(formatBucket(bucketValue)));
    tr.appendChild(createCell(formatInputValue(keyValue)));
    tr.appendChild(createCell(formatNumber(row.upper)));
    tr.appendChild(createCell(formatNumber(row.mean)));
    tr.appendChild(createCell(formatNumber(row.lower)));

    tableBody.appendChild(tr);
  });
}

function createCell(text) {
  const td = document.createElement("td");
  td.textContent = text;
  return td;
}

function isHighlighted(value, highlightKeys) {
  const epsilon = 1e-9;

  return highlightKeys.some((key) => Math.abs(Number(key) - Number(value)) < epsilon);
}

function formatBucket(value) {
  return String(value);
}

function formatInputValue(value) {
  const numericValue = Number(value);

  if (Number.isInteger(numericValue)) {
    return numericValue.toFixed(1);
  }

  const fixed = numericValue.toFixed(2);

  if (fixed.endsWith("0")) {
    return fixed.slice(0, -1);
  }

  return fixed;
}