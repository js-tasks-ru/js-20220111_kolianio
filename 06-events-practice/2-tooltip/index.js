class Tooltip {
  static instance;

  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }

    Tooltip.instance = this;
  }

  initialize () {
    document.addEventListener("mouseover", this.showTooltip);
    document.addEventListener("mouseout", this.removeTooltip);
  }

  getTooltipTemplate(textContent) {
    return `<div class="tooltip">${textContent}</div>`;
  }

  render(tooltipText) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTooltipTemplate(tooltipText);

    this.element = wrapper.firstElementChild;

    document.body.append(this.element);
  }

  showTooltip = (event) => {
    const tooltipElem = event.target.closest('[data-tooltip]');
    if (tooltipElem) {
      const tooltipText = tooltipElem.dataset.tooltip;
      this.render(tooltipText);
      document.addEventListener('pointermove', this.pointerMove);
    }
  }

  pointerMove = (event) => {
    this.moveTooltip(event);
  }

  removeTooltip = () => {
    this.remove();
    document.removeEventListener('pointermove', this.pointerMove);
  }

  moveTooltip (event) {
    const shift = 10;

    const left = event.clientX + shift;
    const top = event.clientY + shift;

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    document.removeEventListener("mouseover", this.showTooltip);
    document.removeEventListener("mouseout", this.removeTooltip);
    document.removeEventListener('pointermove', this.pointerMove);
    this.remove();
    this.element = null;
  }
}

export default Tooltip;
