import { arrayToMap } from "@excalidraw/common";
import { pointFrom, type GlobalPoint } from "@excalidraw/math";
import { API } from "@excalidraw/excalidraw/tests/helpers/api";

import { getTrianglePoints } from "../src/bounds";
import { hitElementItself, isPointInElement } from "../src/collision";
import { distanceToElement } from "../src/distance";
import { convertToExcalidrawElements } from "../src/transform";
import { deconstructTriangleElement } from "../src/utils";

import type { ExcalidrawElementSkeleton } from "../src/transform";
import type { ExcalidrawTriangleElement } from "../src/types";

const makeTriangle = (
  overrides: Partial<ExcalidrawTriangleElement> = {},
): ExcalidrawTriangleElement =>
  API.createElement({
    type: "triangle",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    backgroundColor: "#a5d8ff",
    ...overrides,
  }) as ExcalidrawTriangleElement;

describe("triangle shape", () => {
  describe("getTrianglePoints", () => {
    it("returns apex and base vertices relative to element origin", () => {
      expect(getTrianglePoints(makeTriangle({ width: 100, height: 80 }))).toEqual(
        [51, 0, 100, 80, 0, 80],
      );
    });

    it("offsets apex for odd widths", () => {
      expect(getTrianglePoints(makeTriangle({ width: 21, height: 40 }))).toEqual(
        [11, 0, 21, 40, 0, 40],
      );
    });
  });

  describe("deconstructTriangleElement", () => {
    it("returns three line segments forming the triangle outline", () => {
      const element = makeTriangle();
      const [sides] = deconstructTriangleElement(element);

      expect(sides).toHaveLength(3);
      expect(sides[0][0]).toEqual(pointFrom<GlobalPoint>(51, 0));
      expect(sides[0][1]).toEqual(pointFrom<GlobalPoint>(100, 100));
      expect(sides[1][0]).toEqual(pointFrom<GlobalPoint>(100, 100));
      expect(sides[1][1]).toEqual(pointFrom<GlobalPoint>(0, 100));
      expect(sides[2][0]).toEqual(pointFrom<GlobalPoint>(0, 100));
      expect(sides[2][1]).toEqual(pointFrom<GlobalPoint>(51, 0));
    });
  });

  describe("distanceToElement", () => {
    it("returns zero for points on the outline", () => {
      const element = makeTriangle();
      const elementsMap = arrayToMap([element]);

      expect(
        distanceToElement(
          element,
          elementsMap,
          pointFrom<GlobalPoint>(51, 0),
        ),
      ).toBe(0);
      expect(
        distanceToElement(
          element,
          elementsMap,
          pointFrom<GlobalPoint>(50, 100),
        ),
      ).toBe(0);
    });

    it("returns a positive distance for points outside the shape", () => {
      const element = makeTriangle();
      const elementsMap = arrayToMap([element]);

      expect(
        distanceToElement(
          element,
          elementsMap,
          pointFrom<GlobalPoint>(10, 10),
        ),
      ).toBeGreaterThan(0);
    });
  });

  describe("isPointInElement", () => {
    it("detects points inside a filled triangle", () => {
      const element = makeTriangle();
      const elementsMap = arrayToMap([element]);

      expect(
        isPointInElement(
          pointFrom<GlobalPoint>(50, 60),
          element,
          elementsMap,
        ),
      ).toBe(true);
    });

    it("rejects points inside the bounding box but outside the triangle", () => {
      const element = makeTriangle();
      const elementsMap = arrayToMap([element]);

      expect(
        isPointInElement(
          pointFrom<GlobalPoint>(10, 10),
          element,
          elementsMap,
        ),
      ).toBe(false);
    });
  });

  describe("hitElementItself", () => {
    it("hits filled triangle interiors and edges", () => {
      const element = makeTriangle();
      const elementsMap = arrayToMap([element]);

      expect(
        hitElementItself({
          point: pointFrom<GlobalPoint>(50, 60),
          element,
          threshold: 1,
          elementsMap,
        }),
      ).toBe(true);

      expect(
        hitElementItself({
          point: pointFrom<GlobalPoint>(50, 100),
          element,
          threshold: 1,
          elementsMap,
        }),
      ).toBe(true);
    });

    it("misses points outside the triangle even within its bounding box", () => {
      const element = makeTriangle();
      const elementsMap = arrayToMap([element]);

      expect(
        hitElementItself({
          point: pointFrom<GlobalPoint>(5, 5),
          element,
          threshold: 1,
          elementsMap,
        }),
      ).toBe(false);
    });
  });

  describe("convertToExcalidrawElements", () => {
    it("transforms triangle skeletons into excalidraw elements", () => {
      const [triangle] = convertToExcalidrawElements(
        [
          {
            type: "triangle",
            x: 10,
            y: 20,
            width: 120,
            height: 80,
            backgroundColor: "#ffc9c9",
          },
        ] as ExcalidrawElementSkeleton[],
        { regenerateIds: false },
      );

      expect(triangle.type).toBe("triangle");
      expect(triangle.x).toBe(10);
      expect(triangle.y).toBe(20);
      expect(triangle.width).toBe(120);
      expect(triangle.height).toBe(80);
      expect(triangle.backgroundColor).toBe("#ffc9c9");
    });
  });
});
