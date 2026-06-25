import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads with brand title and collection", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Every Scent Tells a Story/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Obsidian Orchid/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Cedar & Silk/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Amber Meridian/i })).toBeVisible();
  });

  test("navigates to product detail page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Obsidian Orchid/i }).first().click();
    await expect(page).toHaveURL(/\/products\/obsidian-orchid/);
    await expect(page.getByRole("heading", { name: "Obsidian Orchid" })).toBeVisible();
  });
});
