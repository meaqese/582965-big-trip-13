import AbstractView from "./abstract-view";

export default class NoWaypoint extends AbstractView {
  getTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }
}
