const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateType = () => {
  const choices = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];

  return choices[getRandomInteger(0, choices.length - 1)];
};

const generateDestination = () => [`Quebec`, `Vancouver`, `Geneva`, `Los-Angeles`, `Georgia`][getRandomInteger(1, 4)];

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
  return generateDescription(1, 4).map((value) => ({src: `http://picsum.photos/248/152?r=${getRandomInteger(1, 100)}`, description: value}));
};

const generateOffers = () => {
  return generateDescription(1, 5).map((value) => ({title: value, price: getRandomInteger(20, 200)}));
};

const generateFavorite = () => Boolean(getRandomInteger());

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const generateWaypoint = () => {
  return {
    id: generateId(),
    type: generateType(),
    destination: {
      name: generateDestination(),
      description: generateDescription(1, 5),
      pictures: generatePhotos()
    },
    offers: generateOffers(),
    isFavorite: generateFavorite()
  };
};
