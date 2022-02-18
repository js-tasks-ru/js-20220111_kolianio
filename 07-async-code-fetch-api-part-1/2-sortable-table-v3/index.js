import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {
  element;
  subElements = {};
  step = 20;
  start = 1;
  end = this.start + this.step;
  data = [];
  loading = false;

  constructor(headerConfig = [], {
    url = '',
    isSortLocally = false,
    sorted = {
      id: headerConfig.find(item => item.sortable).id,
      order: 'asc'
    },
  } = {}) {
    this.headerConfig = headerConfig;
    this.url = new URL(url, BACKEND_URL);
    this.isSortLocally = isSortLocally;
    this.sorted = sorted;

    this.render();
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow ({id, title, sortable}) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow(id)}
      </div>
    `;
  }

  getHeaderSortingArrow (id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  getTableBody(data) {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(data)}
      </div>`;
  }

  getTableRows (data) {
    return data.map(item => `
      <div class="sortable-table__row">
        ${this.getTableRow(item)}
      </div>`
    ).join('');
  }

  getTableRow (item) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template
      };
    });

    return cells.map(({id, template}) => {
      return template
        ? template(item[id])
        : `<div class="sortable-table__cell">${item[id]}</div>`;
    }).join('');
  }

  getTable() {
    return `
      <div class="sortable-table">
        ${this.getTableHeader()}
        ${this.getTableBody(this.data)}
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          No products
        </div>
      </div>`;
  }

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSortClick);
    window.addEventListener('scroll', this.onScrollUpdate);
  }

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    const toggleOrder = order => {
      const orders = {
        asc: 'desc',
        desc: 'asc'
      };

      return orders[order];
    };

    if (column) {
      const { id, order } = column.dataset;
      const newOrder = toggleOrder(order);
      this.sortStart(id, newOrder);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = newOrder;

      this.sorted.id = id;
      this.sorted.order = newOrder;

      if (!arrow) {
        column.append(this.subElements.arrow);
      }
    }
  };

  onScrollUpdate = async (event) => {
    const bottom = this.element.getBoundingClientRect().bottom;
    const {id, order} = this.sorted;

    if (bottom < document.documentElement.clientHeight && !this.loading && !this.isSortLocally) {
      this.start = this.end;
      this.end = this.start + this.step;

      this.loading = true;

      const data = await this.loadData(id, order, this.start, this.end);
      this.updateRows(data);

      this.loading = false;
    }
  }

  async render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTable();

    const element = wrapper.firstElementChild;
    this.element = element;

    this.subElements = this.getSubElements(element);

    const {id, order} = this.sorted;
    const data = await this.loadData(id, order, this.start, this.end);
    this.addRows(data);

    this.initEventListeners();
  }

  async loadData(id, order, start, end) {
    this.url.searchParams.set('_sort', id);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    this.element.classList.add('sortable-table_loading');

    const data = await fetchJson(this.url);

    this.element.classList.remove('sortable-table_loading');

    return data;
  }

  updateRows(data) {
    this.subElements.body.insertAdjacentHTML('beforeend', this.getTableRows(data));
  }

  addRows(data) {
    this.data = data;
    this.subElements.body.innerHTML = this.getTableRows(this.data);
  }

  sortStart(id, order) {
    this.start = 1;
    this.end = this.start + this.step;
    if (this.isSortLocally) {
      return this.sortOnClient(id, order);
    } else {
      return this.sortOnServer(id, order);
    }
  }

  sortOnClient (id, order) {
    const sortedData = this.sortData(id, order);

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }

  async sortOnServer (id, order) {
    const start = 1;
    const end = start + this.step;
    const data = await this.loadData(id, order, start, end);
    this.addRows(data);
  }

  sortData(id, order) {
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === id);
    const {sortType, customSorting} = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'number':
        return direction * (a[id] - b[id]);
      case 'string':
        return direction * a[id].localeCompare(b[id], 'ru');
      case 'custom':
        return direction * customSorting(a, b);
      default:
        return direction * (a[id] - b[id]);
      }
    });
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements = {};
    window.removeEventListener('scroll', this.onScrollUpdate);
  }
}

