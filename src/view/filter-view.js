import AbstractView from "./abstract-view";

const createFilterTemplate = (filterName, currentFilterType) => {
  const filterType = filterName.toLowerCase();

  return `<div class="trip-filters__filter">
            <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType}" ${currentFilterType === filterType ? `checked` : ``}>
            <label class="trip-filters__filter-label" for="filter-${filterType}">${filterName}</label>
          </div>`;
};

const createFiltersTemplate = (filterItems, currentFilterType) => {
  const filtersTemplates = filterItems.map((filter) => createFilterTemplate(filter, currentFilterType)).join(``);
  return `<form class="trip-filters" action="#" method="get">
            ${filtersTemplates}

            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();

    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }
  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }
}

