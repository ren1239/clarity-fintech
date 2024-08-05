import numeral from "numeral";

export const moneyFormatter = (value: number) => {
  if (Math.abs(value) <= 1000) {
    return numeral(value).format("$0.0");
  }
  return numeral(value).format("$0.0a").toUpperCase();
};

export const percentFormatter = (value: number) => {
  return numeral(value).format("0.0%");
};
