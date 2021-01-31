import SortView from "../view/sort-view";
import TripView from "../view/trip-view";
import NoWaypointView from "../view/no-waypoint-view";
import {POSITIONS, render} from "../utils/render";
import WaypointPresenter from "../presenter/waypoint-presenter";
import {updateItem} from "../utils/common";


export default class Trip {
  constructor(tripContainer) {
    this._tripContainer = tripContainer;

    this._waypointPresenter = {};

    this._tripComponent = new TripView();
    this._sortComponent = new SortView();
    this._noWaypointComponent = new NoWaypointView();

    this._handleWaypointChange = this._handleWaypointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(waypoints) {
    this._waypoints = waypoints.slice();

    this._renderTrip();
  }

  _handleWaypointChange(updatedWaypoint) {
    this._waypoints = updateItem(this._waypoints, updatedWaypoint);
    this._waypointPresenter[updatedWaypoint.id].init(updatedWaypoint);
  }

  _handleModeChange() {
    Object.values(this._waypointPresenter).forEach((presenter) => presenter.resetView());
  }

  _renderSort() {
    render(this._tripContainer, this._sortComponent, POSITIONS.BEFOREEND);
  }

  _renderWaypoint(waypoint) {
    const waypointPresenter = new WaypointPresenter(this._tripComponent, this._handleWaypointChange, this._handleModeChange);
    waypointPresenter.init(waypoint);

    this._waypointPresenter[waypoint.id] = waypointPresenter;
  }

  _renderWaypoints() {
    for (const waypoint of this._waypoints) {
      this._renderWaypoint(waypoint);
    }
  }

  _renderNoWaypoints() {
    render(this._tripContainer, this._noWaypointComponent, POSITIONS.BEFOREEND);
  }

  _renderTrip() {
    this._renderSort();

    if (this._waypoints.length > 0) {
      render(this._tripContainer, this._tripComponent, POSITIONS.BEFOREEND);
      this._renderWaypoints();
    } else {
      this._renderNoWaypoints();
    }
  }
}
