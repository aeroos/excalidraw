import { newElement } from "../src/newElement";
import { generateRoughOptions } from "../src/shape";

describe("generateRoughOptions", () => {
  const createRectangle = (
    strokeStyle: "solid" | "dashed" | "dotted" | "dash-dot",
    strokeWidth = 2,
  ) =>
    newElement({
      type: "rectangle",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      strokeStyle,
      strokeWidth,
    });

  it("should not set strokeLineDash for solid strokes", () => {
    const options = generateRoughOptions(createRectangle("solid"));
    expect(options.strokeLineDash).toBeUndefined();
    expect(options.disableMultiStroke).toBe(false);
    expect(options.strokeWidth).toBe(2);
  });

  it("should set dashed stroke line dash pattern scaled by stroke width", () => {
    const options = generateRoughOptions(createRectangle("dashed", 3));
    expect(options.strokeLineDash).toEqual([8, 11]);
    expect(options.disableMultiStroke).toBe(true);
    expect(options.strokeWidth).toBe(3.5);
  });

  it("should set dotted stroke line dash pattern scaled by stroke width", () => {
    const options = generateRoughOptions(createRectangle("dotted", 1));
    expect(options.strokeLineDash).toEqual([1.5, 7]);
    expect(options.disableMultiStroke).toBe(true);
    expect(options.strokeWidth).toBe(1.5);
  });

  it("should set dash-dot stroke line dash pattern scaled by stroke width", () => {
    const options = generateRoughOptions(createRectangle("dash-dot", 2));
    expect(options.strokeLineDash).toEqual([8, 6, 1.5, 6]);
    expect(options.disableMultiStroke).toBe(true);
    expect(options.strokeWidth).toBe(2.5);
  });
});
