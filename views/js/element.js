class Element {
  constructor(type, props = {}, children = []) {
    this.element = document.createElement(type);
    this.children = children;

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
  }

  addChildren(elems = []) {
    if (!elems) {
      return;
    }

    this.children.push(elems);
  }

  renderTo(elem) {
    if (!elem) {
      console.error("Could not find element to mount Element to.");
      return;
    }

    if (this.children && Array.isArray(this.children)) {
      this.children.forEach(child => {
        this.element.appendChild(child.element);
      });
    }

    elem.appendChild(this.element);
  }
}
