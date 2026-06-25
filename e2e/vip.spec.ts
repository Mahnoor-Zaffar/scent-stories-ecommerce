import { test, expect } from "@playwright/test";

test.describe("Private Reserve", () => {
  test("displays order archives with batch numbers", async ({ page }) => {
    await page.goto("/private-reserve");

    await expect(page.getByRole("heading", { name: /The Private Reserve/i })).toBeVisible();
    await expect(page.getByText("Batch No. 0420-26")).toBeVisible();
    await expect(page.getByText("Obsidian Orchid")).toBeVisible();
  });

  test("expands ingredient sourcing details", async ({ page }) => {
    await page.goto("/private-reserve");

    await page.getByText("Batch No. 0420-26").click();
    await expect(page.getByText("Ingredient Sourcing Breakdown")).toBeVisible();
    await expect(page.getByText("Papua New Guinea Highlands")).toBeVisible();
  });

  test("books a consultation slot", async ({ page }) => {
    await page.goto("/private-reserve");

    const dateButtons = page.locator("button").filter({ hasText: /Mon|Tue|Wed|Thu|Fri|Sat|Sun/ });
    await dateButtons.first().click();

    const timeSlot = page.getByRole("button", { name: /10:00|11:30|14:00/ }).first();
    await timeSlot.click();
    await page.getByRole("button", { name: /Confirm Booking/i }).click();

    await expect(page.getByText(/Consultation Confirmed/i)).toBeVisible();
  });
});
