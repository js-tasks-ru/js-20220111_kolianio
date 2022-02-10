export default class SortableTable {
  element;
  subElements = {};

  static lastSortType;


  constructor(headerConfig = [], {data = [], sorted = {}}, localSort = true) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.sorted = sorted;
    this.isSortLocally = localSort;

    this.render();
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headerConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow({id, title, sortable}) {
    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}">
        <span>${title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>
      </div>
    `;
  }

  getTableBody() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.getTableRows(this.data)}
      </div>`;
  }

  getTableRows(data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
          ${this.getTableRow(item)}
        </a>`;
    }).join('');
  }

  getTableRow(item) {
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
        ${this.getTableBody()}
      </div>`;
  }

  render() {
    const wrapper = document.createElement('div');

    wrapper.innerHTML = this.getTable();

    const element = wrapper.firstElementChild;

    this.element = element;
    this.subElements = this.getSubElements(element);

    this.sort();

    this.sortHeaderListener();
  }

  sortHeaderListener() {
    this.subElements.header.addEventListener('click', this.sortClickHandler);
  }

  sortClickHandler = (event) => {
    const columnForSort = event.target.closest('.sortable-table__cell');
    const columnForSortName = columnForSort.dataset.id;
    const lastSortTarget = document.querySelector(`[data-order = ${SortableTable.lastSortType}`);
    const lastSortType = lastSortTarget.dataset.order;
    const LastSortTargetName = lastSortTarget.dataset.id;

    if (columnForSort.dataset.sortable === 'true') {
      if (columnForSortName === LastSortTargetName) {
        if (lastSortType === 'asc') {
          return this.sort(columnForSortName, 'desc');
        } else {
          return this.sort(columnForSortName, 'asc');
        }
      } else {
        return this.sort(columnForSortName, 'desc');
      }
    }
  }

  sort(sortField = this.sorted.id, order = this.sorted.order) {
    if (this.isSortLocally) {
      this.sortOnClient(sortField, order);
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient(field, order) {
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${field}"]`);

    const sortedData = this.sortData(field, order);
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');

    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = order;

    this.subElements.body.innerHTML = this.getTableRows(sortedData);
  }


  sortOnServer() {

  }

  sortData(field, order) {
    SortableTable.lastSortType = order;
    const arr = [...this.data];
    const column = this.headerConfig.find(item => item.id === field);
    const { sortType } = column;
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];

    return arr.sort((a, b) => {
      switch (sortType) {
      case 'string':
        return direction * a[field].localeCompare(b[field], ['ru', 'en']);
      case 'number':
      default:
        return direction * (a[field] - b[field]);
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

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

