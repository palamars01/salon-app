import { test, expect } from "@playwright/test";
import { salonData } from "../test-data";

test.describe("First login change temp password", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/" + "auth/signin");
    await page.locator("#tab-1").click();

    await page
      .locator("#email")
      .fill(salonData.withPrivateWorkers.privateWorker.email);
    await page
      .locator("#password")
      .fill(salonData.withPrivateWorkers.privateWorker.tempPassword.toString());

    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForResponse((resp) => resp.status() === 200);

    await page.waitForURL(/router/);

    await page.waitForLoadState("networkidle");
  });

  test("Not equal passwords get errors", async ({ page }) => {
    await expect(page.url()).toContain("router");

    await expect(
      page.getByText(/Change temprorary password/, { exact: true })
    ).toBeVisible();

    await page
      .locator("#password")
      .fill(salonData.withPrivateWorkers.privateWorker.password.toString());
    await page
      .locator("#confirmPassword")
      .fill(salonData.withPrivateWorkers.privateWorker.tempPassword.toString());

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Passwords must be equal")).toBeVisible();

    //Passwords must be equal
  });

  test("Change password", async ({ page }) => {
    await page
      .locator("#password")
      .fill(salonData.withPrivateWorkers.privateWorker.password.toString());
    await page
      .locator("#confirmPassword")
      .fill(salonData.withPrivateWorkers.privateWorker.password.toString());

    await page.getByRole("button", { name: "Save" }).click();

    await page.waitForResponse((resp) => resp.status() === 200);

    await page.waitForURL(/private-workers/);

    await expect(page.getByText("Password has been updated")).toBeVisible();

    expect(page.getByText("Second Test Salon Dashboard"));
  });
});
