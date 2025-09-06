import { test, expect } from "@playwright/test";
import { salonData, userCustomerData } from "../test-data";

test.describe("Create appointment", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/" + "auth/signin");
    await page.locator("#tab-1").click();

    await page.locator("#email").fill(userCustomerData.email);
    await page.locator("#password").fill(userCustomerData.password.toString());

    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForResponse((resp) => resp.status() === 200);

    await page.waitForURL(/customer/);

    await page.getByLabel("close").click();

    await page.waitForLoadState("networkidle");

    await page.getByRole("link", { name: "View Salons" }).click();

    await page.waitForURL(/customer\/salons/);
  });

  test.describe("Salon Appointment", () => {
    test.beforeEach(async ({ page }) => {
      await page
        .locator("li:nth-of-type(1)")
        .getByRole("button", { name: "Join Queue" })
        .click();
    });

    test("Check services list", async ({ page }) => {
      await expect(page.getByText("Select Service")).toBeVisible();
      await expect(page.locator("label > span:nth-of-type(2)")).toHaveText(
        salonData.noprivateWorkers.service.name
      );
    });

    test('Customer data form has two inputs (fName,phone) and title "Confirm Services?"', async ({
      page,
    }) => {
      await page.locator("label > span > input").check();
      await page.getByRole("button", { name: "Next" }).click();

      await expect(page.getByText("Confirm Services?")).toBeVisible();
      await expect(page.locator("#fName")).toBeVisible();
      await expect(page.locator("#phone")).toBeVisible();
    });

    test("Send request with empty customer data (fName,phone) displays error notifications", async ({
      page,
    }) => {
      await page.locator("label > span > input").check();
      await page.getByRole("button", { name: "Next" }).click();
      await page.getByRole("button", { name: "Yes" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);
      await page.waitForLoadState("networkidle");

      await expect(
        page.getByText("Phone number format is not valid")
      ).toBeVisible();
      await expect(page.getByText("First name is required")).toBeVisible();
    });

    test("Create Appointment", async ({ page }) => {
      await page.locator("label > span > input").check();
      await page.getByRole("button", { name: "Next" }).click();

      await page.locator("#fName").fill(userCustomerData.fName);
      await page.locator("#phone").fill(userCustomerData.phone);
      await page.getByRole("button", { name: "Yes" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);
      await page.waitForLoadState("networkidle");

      await expect(page.getByText("Appointment created")).toBeVisible();
      await expect(
        page.getByText("You’ve Successfully Joined the Queue!")
      ).toBeVisible();
      await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Status" })).toBeVisible();

      await page.getByRole("link", { name: "Status" }).click();

      await page.waitForURL(/status/);

      await expect(page.getByText("Your turn")).toBeVisible();
      await expect(page.getByText("Queue Entry Time")).toBeVisible();
      await expect(page.getByText("Estimated Wait Time")).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Leave Queue" })
      ).toBeVisible();
    });
  });
});
