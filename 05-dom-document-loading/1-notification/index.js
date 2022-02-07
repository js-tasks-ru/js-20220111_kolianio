export default class NotificationMessage {
  element;
  static lastInstance;

  constructor(
    message = '',
    {
      duration = 2000,
      type = 'success'
    } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get template() {
    return `<div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
              <div class="timer"></div>
                <div class="inner-wrapper">
                  <div class="notification-header">Notification</div>
                  <div class="notification-body">
                    ${this.message}
                  </div>
                </div>
            </div>`;
  }

  render() {
    const elem = document.createElement('div');
    elem.innerHTML = this.template;

    this.element = elem.firstElementChild;
  }

  show(target = document.querySelector("body")) {
    if (NotificationMessage.lastInstance) {
      NotificationMessage.lastInstance.remove();
    }

    target.append(this.element);

    this.timer = setTimeout(() => {
      this.remove();
    }, this.duration);

    NotificationMessage.lastInstance = this;
  }

  remove() {
    clearTimeout(this.timer);
    this.element.remove();
  }

  destroy() {
    clearTimeout(this.timer);
    this.element = null;
    NotificationMessage.lastInstance = null;
  }
}
