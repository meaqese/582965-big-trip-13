import dayjs from "dayjs";
import {createEditWaypointOffersTemplate, createEditWaypointDescriptionTemplate, getType, createEditWaypointDestinationsTemplate, createEditWaypointEventTypesTemplate} from "../utils/waypoint";
import EditWaypointView from "./edit-waypoint-view";


const BLANK_WAYPOINT = {
  type: `flight`,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  price: 0,
  destination: {
    name: ``,
    description: ``,
    photos: []
  },
  offers: [],
  isFavorite: false
};

const createAddWaypointView = (waypoint, destinations, allOffers) => {
  const {type, destination, offers} = waypoint;
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
                  <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Cancel</button>
              </header>
              <section class="event__details">
                ${createEditWaypointOffersTemplate(typeOffers, offers)}

                ${createEditWaypointDescriptionTemplate(destination)}
              </section>
            </form>
          </li>`;
};


export default class AddWaypoint extends EditWaypointView {
  constructor() {
    super(BLANK_WAYPOINT);
  }


  getTemplate() {
    return createAddWaypointView(this._waypoint, this._destinations, this._allOffers);
  }

  setCancelClickHandler(callback) {
    super.setDeleteClickHandler(callback);
  }

  setCloseClickHandler() {}
}
