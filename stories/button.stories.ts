import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import "../dist/button.js";

const meta: Meta = {
  title: "Button",
  component: "primitive-button",
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    name: "test",
  },
  render: ({ name }) => {
    return html` <primitive-button name="${name}"></primitive-button> `;
  },
};
