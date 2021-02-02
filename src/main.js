import StatsView from "./view/stats-view";
import MenuView from "./view/menu-view";
import FiltersView from "./view/filters-view";
import {generateWaypoint} from "./mock/waypoint";
import {POSITIONS, render} from "./utils/render";

import TripPresenter from "./presenter/trip-presenter";
import WaypointsModel from "./model/waypoints-model";
import FilterModel from "./model/filter-model";

const WAYPOINTS_COUNT = 20;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(() => generateWaypoint());

const waypointsModel = new WaypointsModel();
waypointsModel.setWaypoints(waypoints);

const filterModel = new FilterModel();

const tripMain = document.querySelector(`.trip-main`);
render(tripMain, new StatsView().getElement(), POSITIONS.AFTERBEGIN);

const tripControls = tripMain.querySelector(`.trip-controls`);
const switchTrip = tripControls.querySelector(`h2:first-child`);
const filterEvents = tripControls.querySelector(`h2:last-child`);
render(switchTrip, new MenuView().getElement(), POSITIONS.AFTER);
render(filterEvents, new FiltersView().getElement(), POSITIONS.AFTER);


const tripEvents = document.querySelector(`.trip-events`);

const trip = new TripPresenter(tripEvents, waypointsModel);
trip.init();
