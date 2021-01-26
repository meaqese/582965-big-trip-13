export const POSITIONS = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `afterend`
};

export const getTripRoute = (waypoints) => {
  const cities = waypoints.map((point) => point.destination.name);

  return cities.length <= 3 ? cities.join(` — `) : `${cities[0]} — ... — ${cities[cities.length - 1]}`;
};

export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstChild;
};

export const render = (container, element, position) => {
  switch (position) {
    case POSITIONS.AFTERBEGIN:
      container.prepend(element);
      break;
    case POSITIONS.BEFOREEND:
      container.append(element);
      break;
    case POSITIONS.AFTER:
      container.after(element);
      break;
  }
};

export const renderTemplate = (container, layout, where) => {
  container.insertAdjacentHTML(where, layout);
};
