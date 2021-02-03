import InfoView from "./view/info-view";
import MenuView from "./view/menu-view";
import StatsView from "./view/stats";

import {generateOffers, generateWaypoint} from "./mock/waypoint";
import {POSITIONS, remove, render} from "./utils/render";

import FilterPresenter from "./presenter/filter-presenter";
import TripPresenter from "./presenter/trip-presenter";

import WaypointsModel from "./model/waypoints-model";
import FilterModel from "./model/filter-model";
import {MenuItem} from "./const";


const WAYPOINTS_COUNT = 20;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(() => generateWaypoint());

const waypointsModel = new WaypointsModel();
waypointsModel.setWaypoints(waypoints);

const filterModel = new FilterModel();

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const switchTrip = tripControls.querySelector(`h2:first-child`);
const filterEvents = tripControls.querySelector(`h2:last-child`);
const tripEvents = document.querySelector(`.trip-events`);

render(tripMain, new InfoView().getElement(), POSITIONS.AFTERBEGIN);

const menuComponent = new MenuView();
render(switchTrip, menuComponent, POSITIONS.AFTER);

let statsComponent = null;

const filter = new FilterPresenter(filterEvents, filterModel);
const trip = new TripPresenter(tripEvents, waypointsModel, filterModel);

const handleMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      trip.init();
      remove(statsComponent);

      menuComponent.unsetMenuItem(MenuItem.STATS);
      menuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      trip.destroy();

      menuComponent.unsetMenuItem(MenuItem.TABLE);
      menuComponent.setMenuItem(MenuItem.STATS);

      statsComponent = new StatsView(waypointsModel.getWaypoints());
      render(tripEvents, statsComponent, POSITIONS.AFTER);
      break;
  }
};
menuComponent.setMenuClickHandler(handleMenuClick);

filter.init();
trip.init();


document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  trip.createTask();
});
