import { test, expect } from "@playwright/test";
import { privateWorkerService, salonData } from "../test-data";

test.describe("Add private worker service", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/" + "auth/signin");
    await page.locator("#tab-1").click();

    await page
      .locator("#email")
      .fill(salonData.withPrivateWorkers.privateWorker.email);
    await page
      .locator("#password")
      .fill(salonData.withPrivateWorkers.privateWorker.password.toString());

    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForResponse((resp) => resp.status() === 200);
    await page.getByLabel("close").click();

    await page.waitForURL(/private-workers/);
    await page.waitForLoadState("networkidle");
  });

  test("Add service", async ({ page }) => {
    await page.locator("#add-service").click();
    await page.waitForURL(/services/);

    await page.getByRole("link", { name: /Add New Service/ }).click();
    await page.waitForURL(/add/);

    await expect(page.getByText(/Add Service/, { exact: true })).toBeVisible();

    await page.locator("#name").fill(privateWorkerService.name);
    await page.locator("#price").fill(privateWorkerService.price.toString());
    await page
      .locator("#duration")
      .fill(privateWorkerService.duration.toString());
    await page.locator(`#${privateWorkerService.availability[0]}`).check();
    await page.locator(`#${privateWorkerService.availability[1]}`).check();
    await page.locator(`#${privateWorkerService.availability[2]}`).check();

    await page.getByRole("button", { name: "Save Service" }).click();

    await page.waitForResponse((resp) => resp.status() === 200);
    await page.waitForLoadState("networkidle");
    /* Services List Page */
    await page.waitForURL(/services/);

    await expect(page.getByText("Service added successfully")).toBeVisible();
    await page.getByLabel("close").click();

    await expect(page.getByText("Service Management")).toBeVisible();

    /* Service Card */
    await expect(page.getByText(`${privateWorkerService.name}`)).toBeVisible();
    await expect(
      page.getByText(`Price: $${privateWorkerService.price}`)
    ).toBeVisible();
    await expect(
      page.getByText(`${privateWorkerService.duration} mins`)
    ).toBeVisible();
    await expect(
      page.getByText(`${privateWorkerService.availability.join("-")}`)
    ).toBeVisible();

    /* Service Card Buttons */
    await page.screenshot({
      path: "playwright-screenshots/1.png",
      fullPage: true,
    });
    await expect(page.getByRole("link", { name: "Edit" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Delete" })).toBeVisible();

    await page.getByRole("link", { name: "Go to Dashboard" }).click();

    await page.waitForLoadState("networkidle");

    /* Services List Page */
    await page.waitForURL(/private-workers/);
    await page.screenshot({
      path: "playwright-screenshots/2.png",
      fullPage: true,
    });
    expect(page.getByText("Active Services"));
    await expect(page.locator("#servicesCount")).toHaveText("1");
  });
});
