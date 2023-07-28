import type { Meta, StoryObj } from "@storybook/web-components";

import { html } from "lit";
import "../dist/accordion.js";

const meta: Meta = {
  title: "Accordion",
  component: "primitive-accordion",
};

export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: {
    name: "test",
  },
  render: ({ name }) => {
    return html` <primitive-accordion name="${name}"></primitive-accordion> `;
  },
};
