import { test, expect } from "@playwright/test";
import { userCustomerData } from "../test-data";

test.describe("Dashboard UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/" + "auth/signin");
    await page.locator("#tab-1").click();

    await page.locator("#email").fill(userCustomerData.email);
    await page.locator("#password").fill(userCustomerData.password.toString());

    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForResponse((resp) => resp.status() === 200);

    await page.waitForURL(/customer/);

    await page.waitForLoadState("networkidle");
  });

  test("Title & subtitle", async ({ page }) => {
    await expect(page.getByText(/Welcome/, { exact: true })).toBeVisible();
    await expect(
      page.getByText(/Tap the “Join Queue” button below to secure your spot./, {
        exact: true,
      })
    ).toBeVisible();
  });
  test("Action buttons: 'View Salons','Notifications setting'", async ({
    page,
  }) => {
    await expect(page.getByRole("link", { name: "View Salons" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Notifications Settings" })
    ).toBeVisible();
  });
});
