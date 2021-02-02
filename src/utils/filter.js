import {FilterType} from "../const";
import dayjs from "dayjs";

export const filter = {
  [FilterType.EVERYTHING]: (waypoints) => waypoints,
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => dayjs(waypoint.dateTo) < dayjs()),
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => dayjs(waypoint.dateFrom) > dayjs())
};
