import AbstractView from "./abstract-view";

export default class SmartView extends AbstractView {
  updateData(update, updateData) {
    if (!update) {
      return;
    }

    this._waypoint = Object.assign({}, this._waypoint, update);

    if (updateData) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  }

  _restoreHandlers() {
    throw new Error(`Method should be implemented`);
  }
}
