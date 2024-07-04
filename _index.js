console.log("hello from index.js");
class RatingElement extends HTMLElement {
  constructor() {
    super();
    console.log("hi from constructor!");
    this._rating = 0;
    this._vote = null;
    this._boundOnUpClick = this._onUpClick.bind(this);
    this._boundOnDownClick = this._onDownClick.bind(this);
  }

  connectedCallback() {
    console.log("connectedCallBack()");
    const shadowRoot = this.attachShadow({ mode: "open" });
    const templateContent = document.getElementById(
      "rating-element-template"
    ).content;

    const clonedContent = templateContent.cloneNode(true);
    shadowRoot.appendChild(clonedContent);

    this.shadowRoot.querySelector(".rating").innerText = this.rating;

    this.shadowRoot
      .querySelector(".thumb_up")
      .addEventListener("click", this._boundOnUpClick);
    this.shadowRoot
      .querySelector(".thumb_down")
      .addEventListener("click", this._boundOnDownClick);
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector(".thumb_up")
      .removeEventListener("click", this._boundOnUpClick);
    this.shadowRoot
      .querySelector(".thumb_down")
      .removeEventListener("click", this._boundOnDownClick);
  }

  static get observedAttribute() {
    return ["rating", "vote"];
  }

  attributeChangedCallback(attributeName, oldValue, newValue) {
    console.log(`oldValue: ${oldValue}, newValue: ${newValue}`);
    if (attributeName === "rating") {
      const newRating = Number(newValue);
      this._rating = newRating;
    } else if (attributeName === "vote") {
      this.vote = newValue;
    }
  }

  set rating(value) {
    this._rating = value;
    if (!this.shadowRoot) {
      return;
    }

    const ratingEl = this.shadowRoot.querySelector(".rating");
    if (ratingEl) {
      ratingEl.innerText = this._rating;
    }
  }

  get rating() {
    return this._rating;
  }

  set vote(newValue) {
    const oldValue = this._vote;
    if (newValue === oldValue) {
      return;
    }
    if (newValue === "up") {
      if (oldValue === "down") {
        this.rating += 2;
      } else {
        this.rating += 1;
      }
    } else if (newValue === "down") {
      if (oldValue === "up") {
        this.rating -= 2;
      } else {
        this.rating -= 1;
      }
    }
    this._vote = newValue;
    this.setAttribute("vote", newValue);
  }

  get vote() {
    return this._vote;
  }

  _onUpClick() {
    this.vote = "up";
  }

  _onDownClick() {
    this.vote = "down";
  }
}

customElements.define("rating-element", RatingElement);
