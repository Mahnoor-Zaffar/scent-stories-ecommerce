import { test, expect } from "@playwright/test";

test.describe("Scent Quiz", () => {
  test("completes quiz and shows recommendation", async ({ page }) => {
    await page.goto("/quiz");

    await expect(page.getByRole("heading", { name: /Discover Your Signature/i })).toBeVisible();
    await page.getByRole("button", { name: /Begin Discovery/i }).click();

    await expect(page.getByRole("heading", { name: /What mood do you wish to embody/i })).toBeVisible();
    await page.getByRole("button", { name: "Bold" }).click();

    await expect(page.getByRole("heading", { name: /Where will you wear/i })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Evening" }).click();

    await expect(page.getByRole("heading", { name: /Which ingredient family/i })).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: "Oriental" }).click();

    await expect(page.getByText(/Your Signature Match/i)).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole("link", { name: /View Fragrance/i })).toBeVisible();
  });

  test("allows retaking the quiz", async ({ page }) => {
    await page.goto("/quiz");
    await page.getByRole("button", { name: /Begin Discovery/i }).click();
    await page.getByRole("button", { name: "Serene" }).click();
    await page.getByRole("button", { name: "Daytime" }).click();
    await page.getByRole("button", { name: "Citrus" }).click();

    await expect(page.getByText(/Your Signature Match/i)).toBeVisible({ timeout: 5000 });
    await page.getByRole("button", { name: /Retake Quiz/i }).click();
    await expect(page.getByRole("heading", { name: /Discover Your Signature/i })).toBeVisible();
  });
});
