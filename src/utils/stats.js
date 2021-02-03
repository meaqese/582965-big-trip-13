import {offerTypes} from "../const";
import dayjs from "dayjs";

export const moneyExpenses = (waypoints) => {
  let statsByTypes = {};
  offerTypes.forEach((type) => {
    statsByTypes[type.toUpperCase()] = 0;
  });

  waypoints.forEach((waypoint) => {
    const type = waypoint.type.toUpperCase();
    statsByTypes[type] = statsByTypes[type] + parseInt(waypoint.price, 10);
  });

  return statsByTypes;
};

export const typesUseCount = (waypoints) => {
  let statsByTypes = {};
  offerTypes.forEach((type) => {
    statsByTypes[type.toUpperCase()] = 0;
  });

  waypoints.forEach((waypoint) => {
    const type = waypoint.type.toUpperCase();
    statsByTypes[type] = statsByTypes[type] + 1;
  });

  return statsByTypes;
};

export const timeExpense = (waypoints) => {
  let statsByTypes = {};
  offerTypes.forEach((type) => {
    statsByTypes[type.toUpperCase()] = 0;
  });

  waypoints.forEach((waypoint) => {
    const type = waypoint.type.toUpperCase();
    const interval = dayjs(waypoint.dateFrom).diff(waypoint.dateTo, `day`, true);
    statsByTypes[type] = statsByTypes[type] - interval;
  });

  return statsByTypes;
};
