export default class ColumnChart {
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    value = 0,
    link = '',
    formatHeading = data => data
  } = {}) {
    this.data = data;
    this.label = label;
    this.value = formatHeading(value);
    this.link = link;

    this.render();
  }
  getTemplate () {
    return `<div class="column-chart" style="--chart-height: 50">
                <div class="column-chart__title">
                    Total ${this.label}
                    ${this.getLink()}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header">${this.value}</div>
                    <div data-element="body" class="column-chart__chart"></div>
                </div>
            </div>`;

  }
  render () {
    const elem = document.createElement('div');
    elem.innerHTML = this.getTemplate();
    this.element = elem.firstElementChild;

    if (this.data.length === 0) {
      this.element.querySelector(`.column-chart__chart`).insertAdjacentHTML('beforeend', `<img src="charts-skeleton.svg" alt="chart filler">`);
      this.element.classList.add('column-chart_loading');
    } else {
      this.appendColumnBody();
    }
  }

  appendColumnBody () {
    const maxValue = Math.max(...this.data);

    for (let prop of this.data) {
      this.element.querySelector(`.column-chart__chart`).insertAdjacentHTML('beforeend', `<div style="--value: ${Math.floor(this.chartHeight / maxValue * prop)}"
                                                                                                                   data-tooltip="${(prop / maxValue * 100).toFixed(0)}%"></div>`);
    }
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy () {
    this.remove();
    this.element = null;
    this.subElements = {};
  }

  update(data) {
    this.data = data;
    this.appendColumnBody(data);
  }

  getLink () {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }
}
