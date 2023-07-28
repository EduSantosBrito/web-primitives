const toPascalCase = (text) => {
  return text.replace(/(^\w|-\w)/g, clearAndUpper);
};

const clearAndUpper = (text) => {
  return text.replace(/-/, "").toUpperCase();
};

const toConstant = (text) => {
  return text.replace(/-/, "_").toUpperCase();
};

export const generateTestFile = (componentName) => `
import { beforeEach, describe, expect, it } from "vitest";
import "../dist/${componentName}.js";

describe("${componentName}", async () => {
  function getShadowRoot(): ShadowRoot | null | undefined {
    return document.body.querySelector("primitive-${componentName}")?.shadowRoot;
  }

  beforeEach(async () => {
    document.body.innerHTML =
      '<primitive-${componentName} name="World"></primitive-${componentName}>';
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (getShadowRoot()) {
          clearInterval(interval);
          resolve();
        }
      });
    });
  });

  it("should exist", () => {
    const shadowRoot = getShadowRoot();

    expect(shadowRoot).toBeTruthy();
  });
});

`;

export const generateStoriesFile = (componentName) => `
import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import "../dist/${componentName}.js";

const meta: Meta = {
  title: "${toPascalCase(componentName)}",
  component: "primitive-${componentName}",
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    name: "test",
  },
  render: ({ name }) => {
    return html\` <primitive-${componentName} name="$\{name}"></primitive-${componentName}> \`;
  },
};

`;

export const generateConstantsFile = (componentName) => `
export const ${toConstant(componentName)}_CONSTANT = [];
`;

export const generateUtilsFile = () => `
export const awesomeFunction = () => {
  console.log("Awesome stuff here");
}
`;

export const generateComponentFile = (componentName) => `
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("primitive-${componentName}")
export class Primitive${toPascalCase(componentName)} extends LitElement {
  static styles = css\`
    :host {
      color: blue;
    }
  \`;

  @property({ reflect: true })
  name: string;

  constructor() {
    super();
    this.name = "World";
  }

  // Render the UI as a function of component state
  render() {
    return html\`<p>Hello, $\{this.name}!</p>\`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "primitive-${componentName}": Primitive${toPascalCase(componentName)};
  }
}
`;
