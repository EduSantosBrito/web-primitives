import { beforeEach, describe, expect, it } from "vitest";
import "../dist/button.js";

describe("button", async () => {
  function getShadowRoot(): ShadowRoot | null | undefined {
    return document.body.querySelector("primitive-button")?.shadowRoot;
  }

  beforeEach(async () => {
    document.body.innerHTML =
      '<primitive-button name="World"></primitive-button>';
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
