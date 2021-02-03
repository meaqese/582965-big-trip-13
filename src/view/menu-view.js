import AbstractView from "./abstract-view";
import {MenuItem} from "../const";

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
            <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">${MenuItem.STATS}</a>
          </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.menuItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const item = this.getElement().querySelector(`a[data-menu-item=${menuItem}]`);

    if (item !== null) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }

  unsetMenuItem(menuItem) {
    const item = this.getElement().querySelector(`a[data-menu-item=${menuItem}]`);

    if (item !== null) {
      item.classList.remove(`trip-tabs__btn--active`);
    }
  }
}
