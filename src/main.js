import StatsView from "./view/stats-view";
import MenuView from "./view/menu-view";
import FiltersView from "./view/filters-view";
import SortView from "./view/sort-view";
import WaypointListView from "./view/waypoint-list";

import EditWaypointView from "./view/edit-waypoint-view";
import WaypointView from "./view/waypoint";

import {generateWaypoint} from "./mock/waypoint";
import {POSITIONS, render, renderTemplate} from "./utils";

const WAYPOINTS_COUNT = 10;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(() => generateWaypoint());

const tripMain = document.querySelector(`.trip-main`);
render(tripMain, new StatsView().getElement(), POSITIONS.AFTERBEGIN);

const tripControls = tripMain.querySelector(`.trip-controls`);
const switchTrip = tripControls.querySelector(`h2:first-child`);
const filterEvents = tripControls.querySelector(`h2:last-child`);
render(switchTrip, new MenuView().getElement(), POSITIONS.AFTER);
render(filterEvents, new FiltersView().getElement(), POSITIONS.AFTER);

const renderWaypoint = (waypointList, waypoint) => {
  const waypointComponent = new WaypointView(waypoint);
  const editWaypointComponent = new EditWaypointView(waypoint);

  const editWaypointForm = editWaypointComponent.getElement().querySelector(`.event--edit`);

  const replaceWaypointToForm = () => {
    waypointList.replaceChild(editWaypointComponent.getElement(), waypointComponent.getElement());
  };

  const replaceFormToWaypoint = () => {
    waypointList.replaceChild(waypointComponent.getElement(), editWaypointComponent.getElement());
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    replaceFormToWaypoint();

    editWaypointForm.removeEventListener(`submit`, onSubmit);
  };

  waypointComponent.getElement().querySelector(`.event__rollup-btn`)
    .addEventListener(`click`, () => {
      replaceWaypointToForm();

      editWaypointForm.addEventListener(`submit`, onSubmit);
    });

  render(waypointList, waypointComponent.getElement(), POSITIONS.BEFOREEND);
};

const renderEventsBoard = (eventsListContainer, waypointsList) => {
  const waypointsListComponent = new WaypointListView();

  render(eventsListContainer, new SortView().getElement(), POSITIONS.BEFOREEND);

  if (waypointsList.length > 0) {
    render(eventsListContainer, waypointsListComponent.getElement(), POSITIONS.BEFOREEND);
    for (const waypoint of waypointsList) {
      renderWaypoint(waypointsListComponent.getElement(), waypoint);
    }
  } else {
    renderTemplate(eventsListContainer, `<p class="trip-events__msg">Click New Event to create your first point</p>`, POSITIONS.BEFOREEND);
  }
};

const tripEvents = document.querySelector(`.trip-events`);
renderEventsBoard(tripEvents, waypoints);
