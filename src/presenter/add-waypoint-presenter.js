import AddWaypointView from "../view/add-waypoint-view";
import {POSITIONS, remove, render} from "../utils/render";
import {UpdateType, UserAction} from "../const";
import {generateId} from "../mock/waypoint";

export default class AddWaypoint {
  constructor(tripContainer, changeData) {
    this._tripContainer = tripContainer;
    this._changeData = changeData;

    this._waypointAddComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCancelClick = this._handleCancelClick.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
  }

  init() {
    if (this._waypointAddComponent !== null) {
      return;
    }

    this._waypointAddComponent = new AddWaypointView();
    this._waypointAddComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._waypointAddComponent.setCancelClickHandler(this._handleCancelClick);

    render(this._tripContainer, this._waypointAddComponent, POSITIONS.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeydownHandler);
  }

  _destroy() {
    if (this._waypointAddComponent === null) {
      return;
    }

    remove(this._waypointAddComponent);
    this._waypointAddComponent = null;

    document.removeEventListener(`keydown`, this._escKeydownHandler);
  }

  _handleFormSubmit(waypoint) {
    this._changeData(UserAction.ADD, UpdateType.MINOR, Object.assign(waypoint, {id: generateId()}));

    this._destroy();
  }

  _handleCancelClick() {
    this._destroy();
  }

  _escKeydownHandler(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      evt.preventDefault();
      this._destroy();
    }
  }
}
