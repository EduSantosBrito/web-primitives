import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("primitive-button")
export class PrimitiveButton extends LitElement {
  static styles = css`
    :host {
      color: blue;
    }
  `;

  @property({ reflect: true })
  name: string;

  constructor() {
    super();
    this.name = "World";
  }

  // Render the UI as a function of component state
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "primitive-button": PrimitiveButton;
  }
}
