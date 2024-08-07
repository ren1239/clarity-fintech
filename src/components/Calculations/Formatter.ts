import numeral from "numeral";

export const moneyFormatter = (value: number) => {
  if (Math.abs(value) <= 1000) {
    return numeral(value).format("$0.0");
  }
  return numeral(value).format("$0.0a").toUpperCase();
};

export const largeNumberFormatter = (value: number) => {
  if (Math.abs(value) <= 1000) {
    return numeral(value).format("0.0");
  }
  return numeral(value).format("0.0a").toUpperCase();
};

export const percentFormatter = (value: number) => {
  return numeral(value).format("0.0%");
};

interface ExchangeRates {
  [key: string]: {
    [key: string]: number;
  };
}

export const exchangeRates: ExchangeRates = {
  USD: {
    HKD: 7.8,
    CNY: 7.18,
  },
  HKD: {
    USD: 0.13,
    CNY: 0.92,
  },
  CNY: {
    USD: 0.14,
    HKD: 1.09,
  },
};

export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string
) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  const rate = exchangeRates[fromCurrency]?.[toCurrency];
  if (!rate) {
    console.error("Conversion rate not found for", fromCurrency, toCurrency);
    return amount; // Return the amount as-is if conversion rate is not found
  }

  return amount * rate;
};
