var getUniqueId = (function(startingIndex) {
  return function() {
    return startingIndex++;
  };
})(0);

class Element {
  constructor(type, props = {}, children = []) {
    this.type = type;
    this.id = type + getUniqueId();
    this.element = document.createElement(type);
    this.children = children;
    this.boundToElement = null;

    if (props) {
      Object.keys(props).forEach(key => {
        if (typeof props[key] === "object") {
          // Dirty way to get styles working
          // @TODO make this more robust
          const subKeys = Object.keys(props[key]);

          subKeys.forEach(sk => {
            this.element[key][sk] = props[key][sk];
          });
        } else {
          if (key === "innerHTML") {
            this.element[key] = props[key];
          } else {
            this.element.setAttribute(key, props[key]);
          }
        }
      });
    }

    this.element.dataset.id = this.id;
  }

  addEvent(type, callback) {
    if (!type) {
      console.error("Missing addEvent action type for " + this.type);
      return;
    }

    if (!callback) {
      console.error("Missing addEvent callback for " + this.type);
      return;
    }

    var that = this;

    this.element.addEventListener(type, function(event) {
      callback(that, event);
    });

    return this;
  }

  addChildren(elems = []) {
    if (!elems) {
      return;
    }

    this.children = this.children.concat(elems);

    return this;
  }

  renderTo(elem) {
    if (!elem) {
      console.error("Could not find element to mount " + this.type + " to.");
      return;
    }

    if (this.children && Array.isArray(this.children)) {
      this.children.forEach(child => {
        child.renderTo(this.element);
      });
    }

    elem.appendChild(this.element);
    this.boundToElement = elem;
  }

  refresh() {
    if (this.boundToElement) {
      var elem = this.boundToElement.querySelector("[data-id=" + this.id + "]");
      this.boundToElement.removeChild(elem);

      this.renderTo(this.boundToElement);
    }
  }
}
