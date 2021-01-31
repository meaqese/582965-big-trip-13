import WaypointView from "../view/waypoint-view";
import EditWaypointView from "../view/edit-waypoint-view";
import {POSITIONS, render, replace, remove} from "../utils/render";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Waypoint {
  constructor(tripList, changeData, changeMode) {
    this._tripList = tripList;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._waypointComponent = null;
    this._editWaypointComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._closeOnKeydown = this._closeOnKeydown.bind(this);
    this._closeOnSubmit = this._closeOnSubmit.bind(this);

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(waypoint) {
    this._waypoint = waypoint;
    this._mode = Mode.DEFAULT;

    const prevWaypointComponent = this._waypointComponent;
    const prevEditWaypointComponent = this._editWaypointComponent;

    this._waypointComponent = new WaypointView(waypoint);
    this._editWaypointComponent = new EditWaypointView(waypoint);

    this._closeRollupButton = this._editWaypointComponent.getElement().querySelector(`.event__rollup-btn`);
    this._editWaypointForm = this._editWaypointComponent.getElement().querySelector(`.event--edit`);
    this._waypointComponent.setEditClickHandler(this._handleEditClick);

    this._waypointComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevWaypointComponent === null || prevEditWaypointComponent === null) {
      render(this._tripList, this._waypointComponent, POSITIONS.BEFOREEND);
      return;
    }

    // Just replace if element exists
    if (this._mode === Mode.DEFAULT) {
      replace(this._waypointComponent, prevWaypointComponent);
    } else if (this._mode === Mode.EDITING) {
      replace(this._editWaypointComponent, prevEditWaypointComponent);
    }

    remove(prevWaypointComponent);
    remove(prevEditWaypointComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToWaypoint();
    }
  }

  _replaceWaypointToForm() {
    replace(this._editWaypointComponent, this._waypointComponent);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToWaypoint() {
    replace(this._waypointComponent, this._editWaypointComponent);
    this._mode = Mode.DEFAULT;
  }

  _closeEdit() {
    this._replaceFormToWaypoint();

    this._editWaypointForm.removeEventListener(`submit`, this._closeOnSubmit);
    document.removeEventListener(`keydown`, this._closeOnKeydown);
    this._closeRollupButton.removeEventListener(`click`, this._closeEdit);
  }

  _closeOnSubmit(evt) {
    evt.preventDefault();

    this._closeEdit();
  }

  _closeOnKeydown(evt) {
    if (evt.key === `Esc` || evt.key === `Escape`) {
      this._closeEdit();
    }
  }

  _handleEditClick() {
    this._replaceWaypointToForm();

    this._editWaypointForm.addEventListener(`submit`, this._closeOnSubmit);
    document.addEventListener(`keydown`, this._closeOnKeydown);

    this._editWaypointComponent.setCloseClickHandler(() => {
      this._closeEdit();
    });
  }

  _handleFavoriteClick() {
    this._changeData(Object.assign({}, this._waypoint, {isFavorite: !this._waypoint.isFavorite}));
  }
}
