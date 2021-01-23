import {statsView} from "./view/stats-view";
import {menuView} from "./view/menu-view";
import {filtersView} from "./view/filters-view";
import {sortView} from "./view/sort-view";

import {editWaypointView} from "./view/edit-waypoint-view";
import {waypointView} from "./view/waypoint";

import {generateWaypoint} from "./mock/waypoint";

const WAYPOINTS_COUNT = 20;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(() => generateWaypoint());

const renderElement = (container, layout, where) => {
  container.insertAdjacentHTML(where, layout);
};


const tripMain = document.querySelector(`.trip-main`);
renderElement(tripMain, statsView(), `afterbegin`);

const tripControls = tripMain.querySelector(`.trip-controls`);

const switchTrip = tripControls.querySelector(`h2:first-child`);
const filterEvents = tripControls.querySelector(`h2:last-child`);
renderElement(switchTrip, menuView(), `afterend`);
renderElement(filterEvents, filtersView(), `afterend`);

const tripEvents = document.querySelector(`.trip-events`);
renderElement(tripEvents, sortView(), `beforeend`);
renderElement(tripEvents, `<ul class="trip-events__list"></ul>`, `beforeend`);

const list = document.querySelector(`.trip-events__list`);
renderElement(list, editWaypointView(waypoints[0]), `beforeend`);
for (let i = 1; i < waypoints.length; i++) {
  renderElement(list, waypointView(waypoints[i]), `beforeend`);
}
