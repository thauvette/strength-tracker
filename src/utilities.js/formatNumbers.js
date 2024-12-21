export const formatToFixed = (num) => {
  const value = +num;
  if (value === null || isNaN(value)) {
    return '';
  }

  if (Number.isInteger(value)) {
    return value;
  }

  return Number(value.toFixed(2));
};
