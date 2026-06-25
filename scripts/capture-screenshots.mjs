import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";
import { join } from "path";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3001";
const outDir = join(process.cwd(), "docs", "screenshots");

async function captureScreenshots() {
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${baseURL}/`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(outDir, "01-homepage.png") });
  console.log("Captured 01-homepage.png");

  await page.goto(`${baseURL}/products/obsidian-orchid`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: join(outDir, "02-product-detail.png"),
    fullPage: true,
  });
  console.log("Captured 02-product-detail.png");

  await page.goto(`${baseURL}/quiz`);
  await page.getByRole("button", { name: /Begin Discovery/i }).click();
  await page.getByRole("button", { name: "Bold" }).click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(outDir, "03-scent-quiz.png") });
  console.log("Captured 03-scent-quiz.png");

  await page.goto(`${baseURL}/private-reserve`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(outDir, "04-private-reserve.png") });
  console.log("Captured 04-private-reserve.png");

  await page.goto(`${baseURL}/products/obsidian-orchid`);
  await page.getByRole("button", { name: /Add to Collection/i }).click();
  await page.getByRole("link", { name: "Bag" }).click();
  await page.waitForURL(/checkout/);
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(outDir, "05-checkout.png") });
  console.log("Captured 05-checkout.png");

  await browser.close();
}

captureScreenshots().catch((err) => {
  console.error(err);
  process.exit(1);
});
