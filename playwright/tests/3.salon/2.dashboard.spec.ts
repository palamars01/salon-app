import { test, expect } from "@playwright/test";
import { userSalonData } from "../test-data";

test.describe("Salon Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/" + "auth/signin");
    await page.locator("#phone").fill(userSalonData.phone);
    await page.locator("#password").fill(userSalonData.password);

    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForResponse((resp) => resp.status() === 200);
    await page.waitForURL(/admin\/dashboard/);
  });
  test.describe.configure({ mode: "serial" });

  test("Widgets", async ({ page }) => {
    await expect(page.getByText(/Total Customers/)).toBeVisible();
    await expect(page.getByText(/Avg Wait Time/)).toBeVisible();
    await expect(page.getByText(/Total Salons/)).toBeVisible();
    await expect(
      page.getByText("Active Queues", { exact: true })
    ).toBeVisible();
  });

  test("Buttons", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Add New Salon" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Add New Salon" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "View Salons" })).toBeVisible();
  });
});
