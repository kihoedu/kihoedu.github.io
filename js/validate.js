function validateGradeInput(value, min, max) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return {
      valid: false,
      message: "입력 값 없음"
    };
  }

  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return {
      valid: false,
      message: "입력 값은 숫자만 가능"
    };
  }

  if (numericValue < min || numericValue > max) {
    return {
      valid: false,
      message: `입력 값은 ${formatRangeNumber(min)} ~ ${formatRangeNumber(max)} 사이에 있어야 함`
    };
  }

  if (!hasAtMostTwoDecimalPlaces(value)) {
    return {
      valid: false,
      message: "소수점은 두 자리까지만 입력 가능"
    };
  }

  return {
    valid: true,
    message: ""
  };
}

function hasAtMostTwoDecimalPlaces(value) {
  const text = String(value).trim();

  if (!text.includes(".")) {
    return true;
  }

  const decimalPart = text.split(".")[1];
  return decimalPart.length <= 2;
}

function formatRangeNumber(value) {
  return Number(value).toFixed(2);
}