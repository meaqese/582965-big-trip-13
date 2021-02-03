import dayjs from "dayjs";

export const sortByDay = (a, b) => {
  const dateA = dayjs(a.dateFrom);
  const dateB = dayjs(b.dateFrom);

  if (dateA === dateB) {
    return 0;
  } else if (dateA < dateB) {
    return -1;
  } else {
    return 1;
  }
};

export const sortByPrice = (a, b) => {
  return b.price - a.price;
};

export const sortByTime = (a, b) => {
  const intervalA = dayjs(a.dateFrom).diff(dayjs(a.dateTo));
  const intervalB = dayjs(b.dateFrom).diff(dayjs(b.dateTo));

  let result = null;
  if (intervalA === intervalB) {
    result = 0;
  } else if (intervalA > intervalB) {
    result = -1;
  } else if (intervalB > intervalA) {
    result = 1;
  }
  return result;
};

export const getType = (type) => type[0].toUpperCase() + type.slice(1);

const createEditWaypointOfferTemplate = (offer, waypointOffers) => {
  const {title, price} = offer;
  const titleAsId = title.split(` `).join(`-`);
  const inWaypointOffers = waypointOffers.findIndex((waypointOffer) => waypointOffer.title === title) !== -1;

  return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${titleAsId}-1" type="checkbox" name="${title}" ${inWaypointOffers ? `checked` : ``}>
            <label class="event__offer-label" for="event-offer-${titleAsId}-1">
              <span class="event__offer-title">${title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>`;
};
export const createEditWaypointOffersTemplate = (typeOffers, waypointOffers) => {
  const offersList = typeOffers.map((offer) => createEditWaypointOfferTemplate(offer, waypointOffers)).join(``);
  return typeOffers.length > 0 ? `<section class="event__section  event__section--offers">
                                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                                  <div class="event__available-offers">
                                    ${offersList}
                                  </div>
                              </section>` : ``;
};

const createEditWaypointPicturesTemplate = (pictures) => {
  const picturesTemplates = pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join(``);
  return picturesTemplates.length > 0 ? `<div class="event__photos-container">
            <div class="event__photos-tape">
              ${picturesTemplates}
            </div>
          </div>` : ``;
};
export const createEditWaypointDescriptionTemplate = (destination) => {
  const {description, pictures} = destination;
  const notEmpty = description.length > 0;
  return notEmpty ? `<section class="event__section  event__section--destination">
                         <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                         <p class="event__destination-description">${description}</p>

                         ${createEditWaypointPicturesTemplate(pictures)}
                       </section>` : ``;
};

const getEventTypes = (offers) => {
  return offers.map((offer) => offer.type);
};
const createEditWaypointEventTypeTemplate = (type, currentType) => {
  const typeName = type[0].toUpperCase() + type.slice(1);
  return `<div class="event__type-item">
            <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${currentType === type ? `checked` : ``}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${typeName}</label>
          </div>`;
};
export const createEditWaypointEventTypesTemplate = (allOffers, currentType) => {
  const eventTypes = getEventTypes(allOffers);
  return eventTypes.map((type) => createEditWaypointEventTypeTemplate(type, currentType)).join(``);
};

export const createEditWaypointDestinationsTemplate = (destinations) => {
  return destinations.map((destination) => `<option value="${destination.name}"></option>`).join();
};
