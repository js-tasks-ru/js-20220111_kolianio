export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  getTable() {
    return `<div data-element="productsContainer" class="products-list__container">
                <div class="sortable-table">
                    ${this.getTableHeader()}
                    ${this.getTableBody(this.data)}
                </div>
            </div>`;
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.headerConfig.map(prop => this.getHeaderCell(prop)).join('')}
            </div>`;
  }

  getHeaderCell(configUnit) {
    return `<div class="sortable-table__cell" data-id="${configUnit.id}" data-sortable="${configUnit.sortable}">
              <span>${configUnit.title}</span>
            </div>`;
  }

  getTableBody(data) {
    return `<div data-element="body" class="sortable-table__body">
                ${this.getTableRows(data)}
            </div>`;
  }

  getTableRows(data) {
    return data.map(prop => {
      return `
        <a href="/products/${prop.id}" class="sortable-table__row">
          ${this.getTableRow(prop)}
        </a>`;
    }).join('');
  }

  getTableRow(prop) {
    const cells = this.headerConfig.map(({id, template}) => {
      return {
        id,
        template,
      };
    });
    return cells.map(({id, template}) => {
      return template ? template(prop[id]) : `<div class="sortable-table__cell">${prop[id]}</div>`;
    }).join('');
  }

  getSubElements() {
    const elements = this.element.querySelectorAll('[data-element]');
    const subElements = {};

    for (let prop of elements) {
      subElements[prop.dataset.element] = prop;
    }
    return subElements;
  }

  sort(fieldValue, orderValue) {
    const sorted = this.sortData(fieldValue, orderValue);

    this.subElements.body.innerHTML = this.getTableRows(sorted);
  }

  sortData(fieldValue, orderValue) {
    const dataForSort = [...this.data];

    let sortType;
    this.headerConfig.forEach((prop) => {
      if (prop.id === fieldValue) {
        sortType = prop.sortType;
      }
    });

    const order = {
      'asc': 1,
      'desc': -1,
    };

    switch (sortType) {
    case 'string':
      return dataForSort.sort((str1, str2) => {
        return order[orderValue] * str1[fieldValue].localeCompare(str2[fieldValue], ['ru', 'en'], {caseFirst: 'upper'});
      });
    case 'number':
    default: {
      return dataForSort.sort((a, b) => order[orderValue] * (a[fieldValue] - b[fieldValue]));
    }
    }
  }

  render() {
    const elem = document.createElement('div');
    elem.innerHTML = this.getTable();

    this.element = elem.firstElementChild;
    this.subElements = this.getSubElements();
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }
}

