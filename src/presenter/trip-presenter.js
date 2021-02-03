import SortView from "../view/sort-view";
import TripView from "../view/trip-view";
import NoWaypointView from "../view/no-waypoint-view";
import {POSITIONS, remove, render} from "../utils/render";
import WaypointPresenter from "../presenter/waypoint-presenter";
import {FilterType, SortType, UpdateType, UserAction} from "../const";
import {sortByDay, sortByPrice, sortByTime} from "../utils/waypoint";
import {filter} from "../utils/filter";
import {generateDestinations} from "../mock/waypoint";
import AddWaypointPresenter from "./add-waypoint-presenter";


export default class Trip {
  constructor(tripContainer, waypointsModel, filterModel) {
    this._waypointsModel = waypointsModel;
    this._filterModel = filterModel;
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

    this._addWaypointPresenter = new AddWaypointPresenter(this._tripComponent, this._handleViewAction);
  }

  init() {
    this._waypointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._tripComponent);

    this._waypointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createTask() {
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._addWaypointPresenter.init();
  }

  _getWaypoints() {
    const filterType = this._filterModel.getFilter();
    const waypoints = this._waypointsModel.getWaypoints();
    const filteredWaypoints = filter[filterType](waypoints);

    let result = null;
    switch (this._currentSortType) {
      case SortType.PRICE:
        result = filteredWaypoints.sort(sortByPrice);
        break;
      case SortType.TIME:
        result = filteredWaypoints.sort(sortByTime);
        break;
      case SortType.DAY:
        result = filteredWaypoints.sort(sortByDay);
        break;
    }

    return result;
  }

  _clearTrip({resetSortType = false} = {}) {
    this._addWaypointPresenter._destroy();

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
    this._addWaypointPresenter._destroy();
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
    waypoints.forEach((waypoint) => {
      this._renderWaypoint(waypoint);
    });
  }

  _renderNoWaypoints() {
    render(this._tripContainer, this._noWaypointComponent, POSITIONS.BEFOREEND);
  }

  _renderTrip() {
    this._renderSort();
    render(this._tripContainer, this._tripComponent, POSITIONS.BEFOREEND);

    const waypoints = this._getWaypoints();

    if (waypoints.length > 0) {
      this._renderWaypoints(waypoints);
    } else {
      this._renderNoWaypoints();
    }
  }
}
