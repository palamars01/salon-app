import { test, expect } from "@playwright/test";
import { salonData, userSalonData } from "../test-data";

test.describe("Create Salon", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/" + "auth/signin");
    await page.locator("#phone").fill(userSalonData.phone);
    await page.locator("#password").fill(userSalonData.password);

    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForResponse((resp) => resp.status() === 200);
    await page.waitForURL(/admin\/dashboard/);
    await page.getByLabel("close").click();

    await page.getByRole("link", { name: "Add New Salon" }).click();

    await page.waitForURL(/create/);
  });

  test.describe("Register", () => {
    test("Send empty form should display errors", async ({ page }) => {
      await page.getByRole("button", { name: "Register" }).click();
      await page.waitForResponse((resp) => resp.status() === 200);
      await page.waitForLoadState("networkidle");

      await expect(page.getByText("Salon name is required")).toBeVisible();
      await expect(
        page.getByText("Salon owner name is required")
      ).toBeVisible();
      await expect(page.getByText("Salon address is required")).toBeVisible();
      await expect(page.getByText("Salon city is required")).toBeVisible();
    });
    test("With service", async ({ page }) => {
      await page.locator("#name").fill(salonData.noprivateWorkers.name);
      await page.locator("#ownerName").fill(salonData.noprivateWorkers.owner);
      await page
        .locator("#employees")
        .fill(salonData.noprivateWorkers.employees.toString());
      await page.locator("#address").fill(salonData.noprivateWorkers.address);
      await page.locator("#city").fill(salonData.noprivateWorkers.city);

      await page.getByRole("button", { name: "Register" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);
      await page.waitForLoadState("networkidle");

      expect(page.getByText("Salon created successfully")).toBeVisible();
      await page.getByLabel("close").click();

      /* Services Model Page */
      await expect(page).toHaveURL(/select-service-model/);
      await expect(page.getByText("Service Management Model")).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Add Service" })
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Add Personal Stylist" })
      ).toBeVisible();

      await page.getByRole("link", { name: "Add Service" }).click();
      await page.waitForResponse((resp) => resp.status() === 200);
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(/add/);

      await page.locator("#name").fill(salonData.noprivateWorkers.service.name);
      await page
        .locator("#price")
        .fill(salonData.noprivateWorkers.service.price.toString());
      await page
        .locator("#duration")
        .fill(salonData.noprivateWorkers.service.duration.toString());
      await page
        .locator(`#${salonData.noprivateWorkers.service.availability[0]}`)
        .check();
      await page
        .locator(`#${salonData.noprivateWorkers.service.availability[1]}`)
        .check();
      await page
        .locator(`#${salonData.noprivateWorkers.service.availability[2]}`)
        .check();

      await page.getByRole("button", { name: "Save Service" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);
      await page.waitForLoadState("networkidle");

      /* Services List Page */
      await page.waitForURL(/services/);

      await expect(page.getByText("Service added successfully")).toBeVisible();
      await page.getByLabel("close").first().click();

      await expect(page.getByText("Service Management")).toBeVisible();

      /* Service Card */
      await expect(
        page.getByText(`${salonData.noprivateWorkers.service.name}`)
      ).toBeVisible();
      await expect(
        page.getByText(`Price: $${salonData.noprivateWorkers.service.price}`)
      ).toBeVisible();
      await expect(
        page.getByText(`${salonData.noprivateWorkers.service.duration} mins`)
      ).toBeVisible();
      await expect(
        page.getByText(
          `${salonData.noprivateWorkers.service.availability.join("-")}`
        )
      ).toBeVisible();

      /* Service Card Buttons */

      await expect(page.getByRole("link", { name: "Edit" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Delete" })).toBeVisible();
    });
    test("With private stylist", async ({ page }) => {
      await page.locator("#name").fill(salonData.withPrivateWorkers.name);
      await page.locator("#ownerName").fill(salonData.withPrivateWorkers.owner);
      await page
        .locator("#employees")
        .fill(salonData.withPrivateWorkers.employees.toString());
      await page.locator("#address").fill(salonData.withPrivateWorkers.address);
      await page.locator("#city").fill(salonData.withPrivateWorkers.city);

      await page.getByRole("button", { name: "Register" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);
      await page.waitForLoadState("networkidle");

      await expect(page.getByText("Salon created successfully")).toBeVisible();
      await page.getByLabel("close").click();

      /* Services Model Page */
      await expect(page).toHaveURL(/select-service-model/);
      await expect(page.getByText("Service Management Model")).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Add Service" })
      ).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Add Personal Stylist" })
      ).toBeVisible();

      await page.getByRole("link", { name: "Add Personal Stylist" }).click();
      await page.waitForResponse((resp) => resp.status() === 200);
      await page.waitForLoadState("networkidle");

      await expect(page).toHaveURL(/private-workers/);
      await expect(page.getByText("Add Personal Stylist")).toBeVisible();

      await page
        .locator("#name")
        .fill(salonData.withPrivateWorkers.privateWorker.name);
      await page
        .locator("#email")
        .fill(salonData.withPrivateWorkers.privateWorker.email);
      await page
        .locator("#tempPassword")
        .fill(
          salonData.withPrivateWorkers.privateWorker.tempPassword.toString()
        );

      await page.getByRole("button", { name: "Save Personal Stylist" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);
      await page.waitForLoadState("networkidle");

      await expect(
        page.getByText("Personal stylist was added successfully")
      ).toBeVisible();
      await page.getByLabel("close").click();

      await expect(
        page.getByText("Personal Stylists Management")
      ).toBeVisible();

      /* Personal Stylist Card */
      await expect(
        page.getByText(
          `Name: ${salonData.withPrivateWorkers.privateWorker.name}`
        )
      ).toBeVisible();
      await expect(page.getByText(`Services: 0`)).toBeVisible();
      await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();
    });
  });
});
