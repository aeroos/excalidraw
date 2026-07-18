import { API } from "@excalidraw/excalidraw/tests/helpers/api";
import { getDefaultAppState } from "@excalidraw/excalidraw/appState";

import { duplicateElements } from "../src/duplicate";
import {
  excludeElementsInFramesFromSelection,
  getSelectionStateForElements,
  makeNextSelectedElementIds,
} from "../src/selection";

import type { AppState } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "../src/types";

const getTestAppState = (): AppState =>
  ({
    ...getDefaultAppState(),
    offsetTop: 0,
    offsetLeft: 0,
    width: 1000,
    height: 1000,
  }) as AppState;

describe("excludeElementsInFramesFromSelection", () => {
  it("should keep frames and drop their children when both are selected", () => {
    const frame = API.createElement({ type: "frame", id: "frame" });
    const rectangle = API.createElement({
      type: "rectangle",
      id: "rectangle",
      frameId: frame.id,
    });

    const filtered = excludeElementsInFramesFromSelection([
      frame,
      rectangle,
    ]);

    expect(filtered.map((element) => element.id)).toEqual([frame.id]);
  });
});

describe("getSelectionStateForElements", () => {
  it("should not select frame children when group expansion includes a selected frame", () => {
    const frame = API.createElement({
      type: "frame",
      groupIds: ["A"],
    });
    const rectangle = API.createElement({
      type: "rectangle",
      frameId: frame.id,
      groupIds: ["A"],
    });
    const text = API.createElement({
      type: "text",
      text: "sample-text",
      frameId: frame.id,
      groupIds: ["A"],
    });
    const ellipse = API.createElement({
      type: "ellipse",
      groupIds: ["A"],
    });
    const elements = [rectangle, text, frame, ellipse];

    const { duplicatedElements, elementsWithDuplicates, origIdToDuplicateId } =
      duplicateElements({
        type: "in-place",
        elements,
        idsOfElementsToDuplicate: new Map<ExcalidrawElement["id"], ExcalidrawElement>([
          [frame.id, frame],
          [ellipse.id, ellipse],
        ]),
        appState: { editingGroupId: null, selectedGroupIds: {} },
      });

    const selectionState = getSelectionStateForElements(
      duplicatedElements,
      elementsWithDuplicates,
      getTestAppState(),
    );

    const selectedIds = Object.keys(selectionState.selectedElementIds);
    expect(selectedIds).toHaveLength(2);
    expect(selectionState.selectedElementIds[rectangle.id]).toBeFalsy();
    expect(selectionState.selectedElementIds[text.id]).toBeFalsy();
    expect(
      selectionState.selectedElementIds[origIdToDuplicateId.get(rectangle.id)!],
    ).toBeFalsy();
    expect(
      selectionState.selectedElementIds[origIdToDuplicateId.get(text.id)!],
    ).toBeFalsy();
  });

  it("should select only the duplicated element when duplicating one grouped member", () => {
    const rect1 = API.createElement({
      type: "rectangle",
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      groupIds: ["A"],
    });
    const rect2 = API.createElement({
      type: "rectangle",
      x: 100,
      y: 0,
      width: 50,
      height: 50,
      groupIds: ["A"],
    });
    const elements = [rect1, rect2];

    const { duplicatedElements, elementsWithDuplicates } = duplicateElements({
      type: "in-place",
      elements,
      idsOfElementsToDuplicate: new Map<ExcalidrawElement["id"], ExcalidrawElement>([
        [rect1.id, rect1],
      ]),
      appState: { editingGroupId: null, selectedGroupIds: {} },
    });

    const selectionState = getSelectionStateForElements(
      duplicatedElements,
      elementsWithDuplicates,
      getTestAppState(),
    );

    const selectedIds = Object.keys(selectionState.selectedElementIds);
    expect(selectedIds).toHaveLength(1);
    expect(selectedIds[0]).not.toBe(rect1.id);
    expect(selectionState.selectedElementIds[rect2.id]).toBeFalsy();
  });
});

describe("makeNextSelectedElementIds", () => {
  const _makeNextSelectedElementIds = (
    selectedElementIds: { [id: string]: true },
    prevSelectedElementIds: { [id: string]: true },
    expectUpdated: boolean,
  ) => {
    const ret = makeNextSelectedElementIds(selectedElementIds, {
      selectedElementIds: prevSelectedElementIds,
    });
    expect(ret === selectedElementIds).toBe(expectUpdated);
  };
  it("should return prevState selectedElementIds if no change", () => {
    _makeNextSelectedElementIds({}, {}, false);
    _makeNextSelectedElementIds({ 1: true }, { 1: true }, false);
    _makeNextSelectedElementIds(
      { 1: true, 2: true },
      { 1: true, 2: true },
      false,
    );
  });
  it("should return new selectedElementIds if changed", () => {
    // _makeNextSelectedElementIds({ 1: true }, { 1: false }, true);
    _makeNextSelectedElementIds({ 1: true }, {}, true);
    _makeNextSelectedElementIds({}, { 1: true }, true);
    _makeNextSelectedElementIds({ 1: true }, { 2: true }, true);
    _makeNextSelectedElementIds({ 1: true }, { 1: true, 2: true }, true);
    _makeNextSelectedElementIds(
      { 1: true, 2: true },
      { 1: true, 3: true },
      true,
    );
  });
});
