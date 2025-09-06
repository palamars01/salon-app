import { test, expect } from "@playwright/test";
import { userSalonData } from "../test-data";

test.describe("Create Salon UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/" + "auth/signin");
    await page.locator("#phone").fill(userSalonData.phone);
    await page.locator("#password").fill(userSalonData.password);

    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForResponse((resp) => resp.status() === 200);
    await page.waitForURL(/dashboard/);

    await page.getByLabel("close").click();

    await page.getByRole("link", { name: "Add New Salon" }).click();

    await page.waitForResponse(async (resp) => {
      return resp.status() === 200;
    });

    await page.waitForURL(/create/);
    expect(page.url()).toContain("create");
    await page.waitForLoadState("networkidle");
  });

  test("Nav title and subtitle", async ({ page }) => {
    await expect(
      page.getByText(/Register Your Salon/, { exact: true })
    ).toBeVisible();
    await expect(
      page.getByText(/Join our platform to manage your queues effectively/)
    ).toBeVisible();
  });

  test("Fields and Button", async ({ page }) => {
    expect(page.locator("#name")).toBeVisible();
    expect(page.locator("#ownerName")).toBeVisible();
    expect(page.locator("#address")).toBeVisible();
    expect(page.locator("#employees")).toBeVisible();
    expect(page.locator("#city")).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.getByRole("button", { name: "Register" })).toBeVisible();
  });
});
