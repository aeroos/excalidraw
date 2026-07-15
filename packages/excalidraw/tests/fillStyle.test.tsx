import React from "react";

import { CODES } from "@excalidraw/common";

import { copiedStyles } from "../actions/actionStyles";
import { Excalidraw } from "../index";
import { API } from "../tests/helpers/api";
import { Keyboard, Pointer, UI } from "../tests/helpers/ui";
import {
  act,
  fireEvent,
  render,
  screen,
  togglePopover,
} from "../tests/test-utils";

const { h } = window;

const mouse = new Pointer("mouse");

describe("fillStyle", () => {
  beforeEach(async () => {
    await render(<Excalidraw handleKeyboardGlobally={true} />);
  });

  afterEach(async () => {
    // https://github.com/floating-ui/floating-ui/issues/1908#issuecomment-1301553793
    // affects node v16+
    await act(async () => {});
  });

  it("should apply pattern fill to rectangle with background", async () => {
    UI.clickTool("rectangle");
    mouse.down(10, 10);
    mouse.up(20, 20);

    togglePopover("Background");
    UI.clickOnTestId("color-blue");

    fireEvent.click(screen.getByTitle("Pattern"));

    const rect = API.getSelectedElement();
    expect(rect.fillStyle).toBe("dots");
  });

  it("should copy & paste pattern fill via keyboard", async () => {
    UI.clickTool("rectangle");
    mouse.down(10, 10);
    mouse.up(20, 20);

    UI.clickTool("rectangle");
    mouse.down(30, 30);
    mouse.up(40, 40);

    togglePopover("Background");
    UI.clickOnTestId("color-blue");
    fireEvent.click(screen.getByTitle("Pattern"));

    mouse.reset();

    API.setSelectedElements([h.elements[1]]);

    Keyboard.withModifierKeys({ ctrl: true, alt: true }, () => {
      Keyboard.codeDown(CODES.C);
    });
    const secondRect = JSON.parse(copiedStyles)[0];
    expect(secondRect.id).toBe(h.elements[1].id);
    expect(secondRect.fillStyle).toBe("dots");

    mouse.reset();
    API.setSelectedElements([h.elements[0]]);
    Keyboard.withModifierKeys({ ctrl: true, alt: true }, () => {
      Keyboard.codeDown(CODES.V);
    });

    const firstRect = API.getSelectedElement();
    expect(firstRect.id).toBe(h.elements[0].id);
    expect(firstRect.fillStyle).toBe("dots");
  });
});
