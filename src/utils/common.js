export const getTripRoute = (waypoints) => {
  const cities = waypoints.map((point) => point.destination.name);

  return cities.length <= 3 ? cities.join(` — `) : `${cities[0]} — ... — ${cities[cities.length - 1]}`;
};
