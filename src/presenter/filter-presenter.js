import FilterView from "../view/filter-view";
import {POSITIONS, remove, render, replace} from "../utils/render";
import {UpdateType} from "../const";

export default class Filter {
  constructor(filterContainer, filterModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilterType = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._currentFilterType);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, POSITIONS.AFTER);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (filterType === this._currentFilterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [`Everything`, `Past`, `Future`];
  }
}
