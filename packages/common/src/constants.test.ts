import { DEFAULT_ELEMENT_PROPS, STROKE_WIDTH } from "@excalidraw/common";

describe("DEFAULT_ELEMENT_PROPS", () => {
  it("defaults new shapes to 2px stroke width (bold)", () => {
    expect(DEFAULT_ELEMENT_PROPS.strokeWidth).toBe(STROKE_WIDTH.bold);
    expect(DEFAULT_ELEMENT_PROPS.strokeWidth).toBe(2);
  });
});
