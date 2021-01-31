import dayjs from "dayjs";

export const sortByPrice = (a, b) => {
  return b.price - a.price;
};

export const sortByTime = (a, b) => {
  const intervalA = dayjs(a.dateFrom).diff(dayjs(a.dateTo));
  const intervalB = dayjs(b.dateFrom).diff(dayjs(b.dateTo));

  let result = null;
  if (intervalA === intervalB) {
    result = 0;
  } else if (intervalA > intervalB) {
    result = -1;
  } else if (intervalB > intervalA) {
    result = 1;
  }
  return result;
};

export const getType = (type) => type[0].toUpperCase() + type.slice(1);
