import {statsView} from "./view/stats-view";
import {menuView} from "./view/menu-view";
import {filtersView} from "./view/filters-view";
import {sortView} from "./view/sort-view";

import {editWaypointView} from "./view/edit-waypoint-view";
import {waypointView} from "./view/waypoint";

const renderElement = (container, layout, where) => {
  container.insertAdjacentHTML(where, layout);
};

const tripMain = document.querySelector(`.trip-main`);
renderElement(tripMain, statsView().getTemplate(), `afterbegin`);

const tripControls = tripMain.querySelector(`.trip-controls`);

const switchTrip = tripControls.querySelector(`h2:first-child`);
renderElement(switchTrip, menuView().getTemplate(), `afterend`);
const filterEvents = tripControls.querySelector(`h2:last-child`);
renderElement(filterEvents, filtersView().getTemplate(), `afterend`);

const tripEvents = document.querySelector(`.trip-events`);
renderElement(tripEvents, sortView().getTemplate(), `beforeend`);

renderElement(tripEvents, `<ul class="trip-events__list"></ul>`, `beforeend`);
const list = document.querySelector(`.trip-events__list`);
renderElement(list, editWaypointView().getTemplate(), `beforeend`);

for (let i = 0; i < 3; i++) {
  renderElement(list, waypointView().getTemplate(), `beforeend`);
}
