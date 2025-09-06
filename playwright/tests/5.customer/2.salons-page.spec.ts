import { test, expect } from "@playwright/test";
import { salonData, userCustomerData } from "../test-data";

test.describe("Salons Page UI", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/" + "auth/signin");
    await page.locator("#tab-1").click();

    await page.locator("#email").fill(userCustomerData.email);
    await page.locator("#password").fill(userCustomerData.password.toString());

    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForResponse((resp) => resp.status() === 200);

    await page.waitForURL(/customer/);

    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: "View Salons" }).click();

    await page.waitForURL(/customer\/salons/);
  });

  test("Nav title", async ({ page }) => {
    await expect(
      page.getByText(/Browse Salons/, { exact: true })
    ).toBeVisible();
  });
  test("Search input", async ({ page }) => {
    await expect(
      page.getByPlaceholder(/Search by name, address, service/, {
        exact: true,
      })
    ).toBeVisible();
  });
  test("2 cards visible", async ({ page }) => {
    await expect(
      page.getByText("Estimated wait time: Free seats available!", {
        exact: true,
      })
    ).toHaveCount(2);
  });

  test("1 salon card", async ({ page }) => {
    await expect(
      page.getByText(salonData.noprivateWorkers.name, {
        exact: true,
      })
    ).toBeVisible();
    await expect(
      page
        .getByRole("button", {
          name: "Join Queue",
        })
        .first()
    ).toBeVisible();
    await expect(
      page.getByText(
        `Services Offered: ${salonData.noprivateWorkers.service.name}`,
        {
          exact: true,
        }
      )
    ).toBeVisible();
    await expect(
      page
        .getByText("Estimated wait time: Free seats available!", {
          exact: true,
        })
        .first()
    ).toBeVisible();
  });
  test("1 private stylist card", async ({ page }) => {
    await expect(
      page.getByText(
        `Personal stylist: ${salonData.withPrivateWorkers.privateWorker.name}`,
        {
          exact: true,
        }
      )
    ).toBeVisible();

    await expect(
      page.getByText(
        `Services Offered: ${salonData.withPrivateWorkers.privateWorker.service.name}`,
        {
          exact: true,
        }
      )
    ).toBeVisible();
  });
});
