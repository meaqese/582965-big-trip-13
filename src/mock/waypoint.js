import dayjs from "dayjs";
import {offerTypes} from "../const";

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateType = () => offerTypes[getRandomInteger(0, offerTypes.length - 1)];

const generateDescription = (min, max) => {
  const descriptions = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna,
  non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.
   Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh
   vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus
   nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat.
   Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`. `);

  return new Array(getRandomInteger(min, max))
    .fill()
    .map(() => descriptions[getRandomInteger(0, descriptions.length - 1)] + `. `);
};

const generatePhotos = () => {
  return generateDescription(0, 4).map((value) => ({src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`, description: value}));
};

export const generateOffers = () => {
  return offerTypes.map((choice) => {
    return {
      type: choice,
      offers: [
        {
          title: `${choice} #1`,
          price: 120
        }, {
          title: `${choice} #2`,
          price: 60
        }
      ]
    };
  });
};

const generateFavorite = () => Boolean(getRandomInteger());

export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const generatePrice = () => getRandomInteger(40, 300);

const generateDates = () => {
  const dateFrom = dayjs().add(getRandomInteger(-30, 30), `day`);
  const dateTo = dateFrom.add(getRandomInteger(1, 4), `hour`).add(getRandomInteger(10, 59), `minute`);


  return [dateFrom.format(), dateTo.format()];
};

export const generateDestinations = () => {
  return [`Quebec`, `Vancouver`, `Geneva`, `Los-Angeles`, `Georgia`].map((item) => {
    return {
      description: `${item}, is a beautiful city, a true asian pearl, with crowded streets.`,
      name: item,
      pictures: generatePhotos()
    };
  });
};

export const generateWaypoint = () => {
  const [dateFrom, dateTo] = generateDates();
  const type = generateType();

  return {
    id: generateId(),
    dateFrom,
    dateTo,
    type,
    price: generatePrice(),
    destination: generateDestinations()[getRandomInteger(0, 4)],
    offers: [generateOffers().find((offer) => offer.type === type).offers[0]],
    isFavorite: generateFavorite()
  };
};
