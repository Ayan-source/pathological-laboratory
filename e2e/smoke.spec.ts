import { expect, test } from "@playwright/test";

test("app boots and renders the home page", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page).toHaveTitle(/Pathology Lab LIS/);
});
