export const getTripRoute = (waypoints) => {
  const cities = waypoints.map((point) => point.destination.name);

  return cities.length <= 3 ? cities.join(` — `) : `${cities[0]} — ... — ${cities[cities.length - 1]}`;
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
