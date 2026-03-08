function findGradeResult(inputValue, table, inputKey) {
  if (!Array.isArray(table) || table.length === 0) {
    return {
      found: false
    };
  }

  const exactRow = findExactMatch(inputValue, table, inputKey);

  if (exactRow) {
    return {
      found: true,
      type: "exact",
      input: inputValue,
      result: {
        upper: exactRow.upper,
        mean: exactRow.mean,
        lower: exactRow.lower
      },
      highlightKeys: [exactRow[inputKey]]
    };
  }

  const bounds = findBoundingRows(inputValue, table, inputKey);

  if (!bounds) {
    return {
      found: false
    };
  }

  const interpolated = interpolateRow(inputValue, bounds.lowerRow, bounds.upperRow, inputKey);

  return {
    found: true,
    type: "interpolated",
    input: inputValue,
    lowerKey: bounds.lowerRow[inputKey],
    upperKey: bounds.upperRow[inputKey],
    result: interpolated,
    highlightKeys: [
      bounds.lowerRow[inputKey],
      bounds.upperRow[inputKey]
    ]
  };
}

function findExactMatch(inputValue, table, inputKey) {
  const epsilon = 1e-9;

  for (const row of table) {
    if (Math.abs(row[inputKey] - inputValue) < epsilon) {
      return row;
    }
  }

  return null;
}

function findBoundingRows(inputValue, table, inputKey) {
  for (let i = 0; i < table.length - 1; i += 1) {
    const currentRow = table[i];
    const nextRow = table[i + 1];

    const currentValue = currentRow[inputKey];
    const nextValue = nextRow[inputKey];

    if (currentValue < inputValue && inputValue < nextValue) {
      return {
        lowerRow: currentRow,
        upperRow: nextRow
      };
    }
  }

  return null;
}

function formatNumber(value) {
  return Number(value).toFixed(2);
}