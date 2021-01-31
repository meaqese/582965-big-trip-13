import AbstractView from "./abstract-view";
import dayjs from "dayjs";
import {getType} from "../utils/waypoint";

const createWaypointTemplate = (waypoint) => {
  const {type, destination, offers, price} = waypoint;
  const dateFrom = dayjs(waypoint.dateFrom);
  const dateTo = dayjs(waypoint.dateTo);

  const getOffers = () => {
    return offers.map((offer) => `<li class="event__offer">
                  <span class="event__offer-title">${offer.title}</span>
                  &plus;&euro;&nbsp;
                  <span class="event__offer-price">${offer.price}</span>
                </li>`).join(``);
  };
  const getDateString = () => {
    const month = dateFrom.format(`MMM`);
    const day = dateFrom.format(`D`);

    return `${month} ${day}`;
  };
  const getInterval = () => {
    const interval = dayjs(dateFrom.diff(dateTo));

    if (interval.hour() < 1) {
      return interval.format(`mm[M]`);
    } else if (interval.hour() < 24) {
      return interval.format(`HH[H] mm[M]`);
    } else {
      return interval.format(`DD[D] HH[H] mm[M]`);
    }
  };


  return `<li class="trip-events__item">
            <div class="event">
              <time class="event__date" datetime="${dateFrom.format(`YY-MM-DD`)}">${getDateString(dateFrom)}</time>
              <div class="event__type">
                <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
              </div>
              <h3 class="event__title">${getType(type)} ${destination.name}</h3>
              <div class="event__schedule">
                <p class="event__time">
                  <time class="event__start-time" datetime="${dateFrom.format()}">${dateFrom.format(`HH:mm`)}</time>
                  &mdash;
                  <time class="event__end-time" datetime="${dateTo.format()}">${dateTo.format(`HH:mm`)}</time>
                </p>
                <p class="event__duration">${getInterval()}</p>
              </div>
              <p class="event__price">
                &euro;&nbsp;<span class="event__price-value">${price}</span>
              </p>
              <h4 class="visually-hidden">Offers:</h4>
              <ul class="event__selected-offers">${getOffers()}</ul>
              <button class="event__favorite-btn event__favorite-btn--active" type="button">
                <span class="visually-hidden">Add to favorite</span>
                <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                  <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                </svg>
              </button>
              <button class="event__rollup-btn" type="button">
                <span class="visually-hidden">Open event</span>
              </button>
            </div>
          </li>`;
};

export default class WaypointView extends AbstractView {
  constructor(waypoint) {
    super();

    this._waypoint = waypoint;

    this._editClickHandler = this._editClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createWaypointTemplate(this._waypoint);
  }

  _editClickHandler() {
    this._callback.editClick();
  }

  setEditClickHandler(callback) {
    this._callback.editClick = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }

  _favoriteClickHandler() {
    this._callback.favoriteClick();
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
