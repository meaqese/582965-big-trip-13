import AbstractView from "./abstract-view";

const createWaypointListTemplate = () => {
  return `<ul class="trip-events__list"></ul>`;
};

export default class Trip extends AbstractView {
  getTemplate() {
    return createWaypointListTemplate();
  }
}
