import AbstractView from "../view/abstract-view";

export const POSITIONS = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `afterend`
};

export const render = (container, element, position) => {
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  if (element instanceof AbstractView) {
    element = element.getElement();
  }

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
  if (container instanceof AbstractView) {
    container = container.getElement();
  }

  container.insertAdjacentHTML(where, layout);
};

export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;

  return element.firstChild;
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof AbstractView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof AbstractView) {
    newChild = newChild.getElement();
  }

  const elementParent = oldChild.parentElement;
  if (elementParent === null || newChild === null) {
    throw new Error(`Can't replace not existing elements`);
  }

  elementParent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (!(component instanceof AbstractView)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};
