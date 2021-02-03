import dayjs from "dayjs";
import {getType} from "../utils/waypoint";
import SmartView from "./smart-view";
import flatpickr from "flatpickr";
import {createEditWaypointOffersTemplate, createEditWaypointDescriptionTemplate, createEditWaypointEventTypesTemplate, createEditWaypointDestinationsTemplate} from "../utils/waypoint";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";
import {generateDestinations, generateOffers} from "../mock/waypoint";


const createEditWaypointTemplate = (waypoint, destinations, allOffers) => {
  const {type, destination, offers, price} = waypoint;
  const typeOffers = allOffers.find((offer) => offer.type === type).offers;
  const dateFromFormat = dayjs(waypoint.dateFrom).format(`DD/MM/YY HH:mm`);
  const dateToFormat = dayjs(waypoint.dateTo).format(`DD/MM/YY HH:mm`);


  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${getType(type)}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>

                      ${createEditWaypointEventTypesTemplate(allOffers, waypoint.type)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${getType(type)}
                  </label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    ${createEditWaypointDestinationsTemplate(destinations)}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dateFromFormat}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dateToFormat}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Delete</button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </header>
              <section class="event__details">
                ${createEditWaypointOffersTemplate(typeOffers, offers)}

                ${createEditWaypointDescriptionTemplate(destination)}
              </section>
            </form>
          </li>`;
};


export default class EditWaypoint extends SmartView {
  constructor(waypoint) {
    super();

    this._waypoint = waypoint;

    this._destinations = generateDestinations();
    this._allOffers = generateOffers();

    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._changeTypeHandler = this._changeTypeHandler.bind(this);
    this._changeDestinationHandler = this._changeDestinationHandler.bind(this);
    this._changePriceHandler = this._changePriceHandler.bind(this);
    this._changeOfferHandler = this._changeOfferHandler.bind(this);

    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatePickers();
  }

  getTemplate() {
    return createEditWaypointTemplate(this._waypoint, this._destinations, this._allOffers);
  }

  reset(waypoint) {
    this.updateData(waypoint);
  }

  _setDatePickers() {
    if (this._datepickerFrom || this._datepickerTo) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;

      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    if (this._waypoint.dateFrom && this._waypoint.dateTo) {
      this._datepickerFrom = flatpickr(
          this.getElement().querySelector(`input[name=event-start-time]`),
          {enableTime: true, dateFormat: `d/m/Y H:i`, defaultDate: this._waypoint.dateFrom, onChange: this._dateFromChangeHandler}
      );
      this._datepickerTo = flatpickr(
          this.getElement().querySelector(`input[name=event-end-time]`),
          {enableTime: true, dateFormat: `d/m/Y H:i`, defaultDate: this._waypoint.dateTo, onChange: this._dateToChangeHandler}
      );
    }
  }

  _dateFromChangeHandler([userData]) {
    this.updateData({dateFrom: dayjs(userData).toDate()});
  }

  _dateToChangeHandler([userData]) {
    this.updateData({dateTo: dayjs(userData).toDate()});
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.event__type-group`).addEventListener(`change`, this._changeTypeHandler);
    this.getElement().querySelector(`.event__input--destination`).addEventListener(`input`, this._changeDestinationHandler);
    this.getElement().querySelector(`.event__input--price`).addEventListener(`input`, this._changePriceHandler);
    this.getElement().querySelector(`.event__available-offers`).addEventListener(`change`, this._changeOfferHandler);
  }

  _restoreHandlers() {
    this._setInnerHandlers();
    this._setDatePickers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this.setCloseClickHandler(this._callback.close);
  }

  _changeDestinationHandler(evt) {
    const destinationData = this._destinations.find((destination) => destination.name === evt.target.value);
    const defaultDestination = {name: evt.target.value, description: ``, pictures: []};

    if (destinationData) {
      this.updateData({destination: destinationData});
    } else if (defaultDestination !== this._waypoint.destination) {
      this.updateData({destination: defaultDestination});
    }
    const input = this.getElement().querySelector(`.event__input--destination`);
    input.focus();
    input.selectionStart = input.value.length;
  }

  _changeTypeHandler(evt) {
    const offersData = this._allOffers.find((offer) => offer.type === evt.target.value);

    if (offersData) {
      this.updateData({type: evt.target.value, offers: []});
    }
  }

  _changePriceHandler(evt) {
    this.updateData({price: evt.target.value}, true);
  }

  _changeOfferHandler(evt) {
    const typeOffers = this._allOffers.find((offer) => offer.type === this._waypoint.type).offers;
    const offerData = typeOffers.find((typeOffer) => typeOffer.title === evt.target.name);
    const inWaypointOffers = this._waypoint.offers.findIndex((offer) => offer.title === offerData.title);
    const newOffers = this._waypoint.offers.slice();

    if (inWaypointOffers === -1) {
      newOffers.push(offerData);
      this.updateData({offers: newOffers});
    } else {
      newOffers.splice(inWaypointOffers, 1);
      this.updateData({offers: newOffers});
    }
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();

    this._callback.deleteClick(this._waypoint);
  }
  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    this._callback.formSubmit(this._waypoint);
  }
  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector(`.event--edit`).addEventListener(`submit`, this._formSubmitHandler);
  }

  _closeClickHandler() {
    this._callback.close();
  }
  setCloseClickHandler(callback) {
    this._callback.close = callback;
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeClickHandler);
  }
}
