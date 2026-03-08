function interpolateRow(inputValue, lowerRow, upperRow, inputKey) {
  const lowerKey = lowerRow[inputKey];
  const upperKey = upperRow[inputKey];

  if (upperKey === lowerKey) {
    return {
      upper: roundToTwo(lowerRow.upper),
      mean: roundToTwo(lowerRow.mean),
      lower: roundToTwo(lowerRow.lower)
    };
  }

  const ratio = (inputValue - lowerKey) / (upperKey - lowerKey);

  const upper = lowerRow.upper + ratio * (upperRow.upper - lowerRow.upper);
  const mean = lowerRow.mean + ratio * (upperRow.mean - lowerRow.mean);
  const lower = lowerRow.lower + ratio * (upperRow.lower - lowerRow.lower);

  return {
    upper: roundToTwo(upper),
    mean: roundToTwo(mean),
    lower: roundToTwo(lower)
  };
}

function roundToTwo(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}