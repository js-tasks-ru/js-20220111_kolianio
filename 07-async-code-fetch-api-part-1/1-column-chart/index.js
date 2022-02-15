import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  subElements = {};
  chartHeight = 50;

  constructor({
    url = '',
    range = {},
    label = '',
    link = '',
    formatHeading = data => data
  } = {}) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;

    this.render();
    this.update(this.range.from, this.range.to);
  }

  getHeaderValue(data) {
    return this.formatHeading(Object.values(data).reduce((accum, next) => accum + next, 0));
  }

  getUrl(start, end) {
    const endpoint = BACKEND_URL + '/' + this.url;
    const currentUrl = new URL(endpoint);

    currentUrl.searchParams.set(`from`, `${start.toISOString()}`);
    currentUrl.searchParams.set(`to`, `${end.toISOString()}`);

    return currentUrl;
  }

  async getDataFromServer(start, end) {
    const currentUrl = this.getUrl(start, end);
    return await fetchJson(currentUrl);
  }

  getTemplate() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
           <div data-element="header" class="column-chart__header">
           </div>
          <div data-element="body" class="column-chart__chart">
          </div>
          <div data-element="js"></div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements();
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;

      result[name] = subElement;
    }

    return result;
  }

  getColumnBody(data) {
    const maxValue = Math.max(...Object.values(data));
    const scale = this.chartHeight / maxValue;

    return Object.entries(data)
      .map(([key, value]) => {
        return `<div style="--value: ${Math.floor(value * scale)}" data-tooltip="${key}'\n'
                ${this.formatHeading(value)}%"></div>`;
      })
      .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  async update(start, end) {
    this.element.classList.add('column-chart_loading');

    const data = await this.getDataFromServer(start, end);

    if (Object.values(data)) {
      this.subElements.header.innerText = this.getHeaderValue(Object.values(data));
      this.subElements.body.innerHTML = this.getColumnBody(data);
      this.element.classList.remove('column-chart_loading');
    }

    return data;
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
