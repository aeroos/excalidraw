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
} from "../tests/test-utils";

const { h } = window;

const mouse = new Pointer("mouse");

describe("strokeStyle", () => {
  beforeEach(async () => {
    await render(<Excalidraw handleKeyboardGlobally={true} />);
  });

  afterEach(async () => {
    await act(async () => {});
  });

  it("should apply dash-dot stroke style to selected element", () => {
    UI.clickTool("rectangle");
    mouse.down(10, 10);
    mouse.up(20, 20);

    fireEvent.click(screen.getByTitle("Dash-dot"));

    const rect = API.getSelectedElement();
    expect(rect.strokeStyle).toBe("dash-dot");
  });

  it("should copy & paste dash-dot stroke style via keyboard", async () => {
    UI.clickTool("rectangle");
    mouse.down(10, 10);
    mouse.up(20, 20);

    UI.clickTool("rectangle");
    mouse.down(30, 30);
    mouse.up(40, 40);

    API.setSelectedElements([h.elements[1]]);
    fireEvent.click(screen.getByTitle("Dash-dot"));

    Keyboard.withModifierKeys({ ctrl: true, alt: true }, () => {
      Keyboard.codeDown(CODES.C);
    });
    const secondRect = JSON.parse(copiedStyles)[0];
    expect(secondRect.strokeStyle).toBe("dash-dot");

    API.setSelectedElements([h.elements[0]]);
    Keyboard.withModifierKeys({ ctrl: true, alt: true }, () => {
      Keyboard.codeDown(CODES.V);
    });

    const firstRect = API.getSelectedElement();
    expect(firstRect.strokeStyle).toBe("dash-dot");
  });
});
