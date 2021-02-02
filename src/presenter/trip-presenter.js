import SortView from "../view/sort-view";
import TripView from "../view/trip-view";
import NoWaypointView from "../view/no-waypoint-view";
import {POSITIONS, remove, render} from "../utils/render";
import WaypointPresenter from "../presenter/waypoint-presenter";
import {SortType, UpdateType, UserAction} from "../const";
import {sortByPrice, sortByTime} from "../utils/waypoint";


export default class Trip {
  constructor(tripContainer, waypointsModel) {
    this._waypointsModel = waypointsModel;
    this._tripContainer = tripContainer;

    this._waypointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._tripComponent = new TripView();
    this._sortComponent = null;
    this._noWaypointComponent = new NoWaypointView();

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._waypointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
  }

  _getWaypoints() {
    switch (this._currentSortType) {
      case SortType.PRICE:
        return this._waypointsModel.getWaypoints().slice().sort(sortByPrice);
      case SortType.TIME:
        return this._waypointsModel.getWaypoints().slice().sort(sortByTime);
    }

    return this._waypointsModel.getWaypoints();
  }

  _clearTrip({resetSortType = false} = {}) {
    Object.values(this._waypointPresenter).forEach((presenter) => presenter.destroy());
    this._waypointPresenter = {};

    remove(this._sortComponent);
    remove(this._noWaypointComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE:
        this._waypointsModel.updateWaypoint(updateType, update);
        break;
      case UserAction.ADD:
        this._waypointsModel.addWaypoint(updateType, update);
        break;
      case UserAction.DELETE:
        this._waypointsModel.deleteWaypoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        // Обновление внутри точки
        this._waypointPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    Object.values(this._waypointPresenter).forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._tripContainer, this._sortComponent, POSITIONS.BEFOREEND);
  }

  _renderWaypoint(waypoint) {
    const waypointPresenter = new WaypointPresenter(this._tripComponent, this._handleViewAction, this._handleModeChange);
    waypointPresenter.init(waypoint);

    this._waypointPresenter[waypoint.id] = waypointPresenter;
  }

  _renderWaypoints(waypoints) {
    waypoints.forEach((waypoint) => this._renderWaypoint(waypoint));
  }

  _renderNoWaypoints() {
    render(this._tripContainer, this._noWaypointComponent, POSITIONS.BEFOREEND);
  }

  _renderTrip() {
    this._renderSort();

    const waypoints = this._getWaypoints();

    if (waypoints.length > 0) {
      render(this._tripContainer, this._tripComponent, POSITIONS.BEFOREEND);
      this._renderWaypoints(waypoints);
    } else {
      this._renderNoWaypoints();
    }
  }
}
