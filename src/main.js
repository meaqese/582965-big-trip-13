import StatsView from "./view/stats-view";
import MenuView from "./view/menu-view";
import FiltersView from "./view/filters-view";
import SortView from "./view/sort-view";
import WaypointListView from "./view/waypoint-list-view";

import EditWaypointView from "./view/edit-waypoint-view";
import WaypointView from "./view/waypoint-view";

import {generateWaypoint} from "./mock/waypoint";
import {POSITIONS, render, renderTemplate, replace} from "./utils/render";
import AbstractView from "./view/abstract-view";

const WAYPOINTS_COUNT = 20;
const waypoints = new Array(WAYPOINTS_COUNT).fill().map(() => generateWaypoint());

const tripMain = document.querySelector(`.trip-main`);
render(tripMain, new StatsView().getElement(), POSITIONS.AFTERBEGIN);

const tripControls = tripMain.querySelector(`.trip-controls`);
const switchTrip = tripControls.querySelector(`h2:first-child`);
const filterEvents = tripControls.querySelector(`h2:last-child`);
render(switchTrip, new MenuView().getElement(), POSITIONS.AFTER);
render(filterEvents, new FiltersView().getElement(), POSITIONS.AFTER);

const renderWaypoint = (waypointList, waypoint) => {
  if (waypointList instanceof AbstractView) {
    waypointList = waypointList.getElement();
  }

  const waypointComponent = new WaypointView(waypoint);
  const editWaypointComponent = new EditWaypointView(waypoint);

  const closeRollupButton = editWaypointComponent.getElement().querySelector(`.event__rollup-btn`);

  const editWaypointForm = editWaypointComponent.getElement().querySelector(`.event--edit`);

  const replaceWaypointToForm = () => {
    replace(editWaypointComponent, waypointComponent);
  };

  const replaceFormToWaypoint = () => {
    replace(waypointComponent, editWaypointComponent);
  };

  const closeEdit = () => {
    replaceFormToWaypoint();

    editWaypointForm.removeEventListener(`submit`, closeOnSubmit);
    document.removeEventListener(`keydown`, closeOnKeyDown);
    closeRollupButton.removeEventListener(`click`, closeEdit);
  };

  const closeOnSubmit = (evt) => {
    evt.preventDefault();

    closeEdit();
  };

  const closeOnKeyDown = (evt) => {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      closeEdit();
    }
  };

  waypointComponent.setEditClickHandler(() => {
    replaceWaypointToForm();

    editWaypointForm.addEventListener(`submit`, closeOnSubmit);
    document.addEventListener(`keydown`, closeOnKeyDown);

    editWaypointComponent.setCloseClickHandler(() => {
      closeEdit();
    });
  });

  render(waypointList, waypointComponent, POSITIONS.BEFOREEND);
};

const renderEventsBoard = (eventsListContainer, waypointsList) => {
  const waypointsListComponent = new WaypointListView();

  render(eventsListContainer, new SortView(), POSITIONS.BEFOREEND);

  if (waypointsList.length > 0) {
    render(eventsListContainer, waypointsListComponent, POSITIONS.BEFOREEND);
    for (const waypoint of waypointsList) {
      renderWaypoint(waypointsListComponent, waypoint);
    }
  } else {
    renderTemplate(eventsListContainer, `<p class="trip-events__msg">Click New Event to create your first point</p>`, POSITIONS.BEFOREEND);
  }
};

const tripEvents = document.querySelector(`.trip-events`);
renderEventsBoard(tripEvents, waypoints);
