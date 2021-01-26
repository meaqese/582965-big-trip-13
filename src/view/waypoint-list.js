import {createElement} from "../utils";

const createWaypointListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class WaypointList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createWaypointListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
