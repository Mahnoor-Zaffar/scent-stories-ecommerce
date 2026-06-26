import { test, expect } from "@playwright/test";

async function addProductAndOpenCheckout(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /Add to Collection/i }).click();
  await page.getByRole("link", { name: "Bag" }).click();
  await expect(page).toHaveURL(/\/checkout/);
}

test.describe("Checkout Pipeline", () => {
  test("adds product to cart and completes checkout", async ({ page }) => {
    await page.goto("/products/obsidian-orchid");
    await addProductAndOpenCheckout(page);

    await expect(page.getByText(/1 item/i)).toBeVisible();
    await expect(page.getByText("Obsidian Orchid")).toBeVisible();

    await page.getByRole("button", { name: /Proceed to Shipping/i }).click();
    await page.getByPlaceholder("Email address").fill("guest@scentandstories.com");
    await page.getByPlaceholder("Phone number").fill("+15551234567");
    await page.getByRole("button", { name: /Continue to Payment/i }).click();

    await expect(page.getByRole("heading", { name: "Payment" })).toBeVisible();
    await page.getByRole("button", { name: /Complete Purchase/i }).click();

    await expect(page.getByText(/Order Confirmed/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Thank You/i)).toBeVisible();
    await expect(page.getByText(/Webhook Events/i)).toBeVisible();
  });

  test("recalculates totals for GB region", async ({ page }) => {
    await page.goto("/products/cedar-and-silk");
    await addProductAndOpenCheckout(page);
    await page.goto("/checkout?region=GB");

    await expect(page.locator("#region-select")).toHaveValue("GB");
    await expect(page.getByText(/Import Duties/i)).toBeVisible();
    await expect(page.getByText("Royal Mail International Priority")).toBeVisible();
  });
});
