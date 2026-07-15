import { pointFrom } from "@excalidraw/math";

import { COLOR_PALETTE } from "@excalidraw/common";

import { newElement, newLinearElement } from "../src/newElement";
import { generateRoughOptions } from "../src/shape";

describe("generateRoughOptions fillStyle", () => {
  it("should pass dots fillStyle through for filled shapes", () => {
    const shapeTypes = ["rectangle", "ellipse", "diamond"] as const;

    for (const type of shapeTypes) {
      const element = newElement({
        type,
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        fillStyle: "dots",
        backgroundColor: "#a5d8ff",
      });

      const options = generateRoughOptions(element);

      expect(options.fillStyle).toBe("dots");
      expect(options.fill).toBe("#a5d8ff");
    }
  });

  it("should preserve dots fillStyle but omit fill for transparent backgrounds", () => {
    const element = newElement({
      type: "rectangle",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      fillStyle: "dots",
      backgroundColor: COLOR_PALETTE.transparent,
    });

    const options = generateRoughOptions(element);

    expect(options.fillStyle).toBe("dots");
    expect(options.fill).toBeUndefined();
  });

  it("should pass dots fillStyle through for closed linear paths", () => {
    const element = newLinearElement({
      type: "line",
      x: 0,
      y: 0,
      fillStyle: "dots",
      backgroundColor: "#a5d8ff",
      points: [
        pointFrom(0, 0),
        pointFrom(100, 0),
        pointFrom(5, 5),
      ],
    });

    const options = generateRoughOptions(element);

    expect(options.fillStyle).toBe("dots");
    expect(options.fill).toBe("#a5d8ff");
  });

  it("should not set fillStyle for open linear paths", () => {
    const element = newLinearElement({
      type: "line",
      x: 0,
      y: 0,
      fillStyle: "dots",
      backgroundColor: "#a5d8ff",
      points: [pointFrom(0, 0), pointFrom(100, 0)],
    });

    const options = generateRoughOptions(element);

    expect(options.fillStyle).toBeUndefined();
    expect(options.fill).toBeUndefined();
  });
});
