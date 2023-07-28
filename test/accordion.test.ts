import { beforeEach, describe, expect, it } from "vitest";
import "../dist/accordion.js";

describe("accordion", async () => {
  function getShadowRoot(): ShadowRoot | null | undefined {
    return document.body.querySelector("primitive-accordion")?.shadowRoot;
  }

  beforeEach(async () => {
    document.body.innerHTML =
      '<primitive-accordion name="World"></primitive-accordion>';
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
