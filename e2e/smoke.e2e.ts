import { test, expect } from "@playwright/test";

test("draw a rectangle on canvas", async ({ page }) => {
  await page.goto("/");

  await page.waitForFunction(() => {
    const h = window.h;
    return h?.app && h.state && !h.state.isLoading;
  });

  await page.getByRole("radio", { name: "Rectangle" }).click({ force: true });

  const canvas = page.locator("canvas.interactive");
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  expect(box).not.toBeNull();

  const startX = box!.x + 30;
  const startY = box!.y + 20;
  const endX = box!.x + 60;
  const endY = box!.y + 70;

  await page.evaluate(
    ({ startX, startY, endX, endY }) => {
      const canvas = document.querySelector("canvas.interactive")!;
      const pointerInit = (x: number, y: number, buttons: number) => ({
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        pointerId: 1,
        pointerType: "mouse",
        isPrimary: true,
        buttons,
      });
      canvas.dispatchEvent(
        new PointerEvent("pointerdown", pointerInit(startX, startY, 1)),
      );
      canvas.dispatchEvent(
        new PointerEvent("pointermove", pointerInit(endX, endY, 1)),
      );
      canvas.dispatchEvent(
        new PointerEvent("pointerup", pointerInit(endX, endY, 0)),
      );
    },
    { startX, startY, endX, endY },
  );

  await page.waitForFunction(() => {
    return window.h.elements.some(
      (el) => el.type === "rectangle" && !el.isDeleted,
    );
  });

  const rectangleCount = await page.evaluate(() => {
    return window.h.elements.filter(
      (el) => el.type === "rectangle" && !el.isDeleted,
    ).length;
  });

  expect(rectangleCount).toBeGreaterThanOrEqual(1);
});
