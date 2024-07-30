import numeral from "numeral";

export const moneyFormatter = (value: number) => {
  if (value <= 1000) {
    return numeral(value).format("$0.0");
  }
  return numeral(value).format("$0a.0");
};

export const percentFormatter = (value: number) => {
  return numeral(value).format("0.0%");
};
