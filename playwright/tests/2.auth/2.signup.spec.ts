import { test, expect } from "@playwright/test";
import { userCustomerData, userSalonData } from "../test-data";

test.describe("Signup process", () => {
  test.describe.configure({ mode: "serial" });
  test.describe("Signup with phone", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/" + "auth/signup");
    });
    test.describe.configure({ mode: "serial" });

    test("Salon signup with wrong confirm password", async ({ page }) => {
      await page.locator("#phone").fill(userSalonData.phone);
      await page.locator("#password").fill(userSalonData.password);
      await page
        .locator("#confirmPassword")
        .fill(
          userSalonData.password.substring(0, userSalonData.password.length - 2)
        );
      await page.locator("#role-select").selectOption("salon");

      await page.getByRole("button", { name: "Create Account" }).click();

      await page.waitForResponse(async (resp) => {
        const responseBody = (await resp.body()).toString();
        expect(responseBody).toContain("Passwords must be equal");
        return resp.status() === 200;
      });

      expect(page.url()).toContain("signup");
    });

    test("Salon signup with weak password", async ({ page }) => {
      await page.locator("#phone").fill(userSalonData.phone);
      await page
        .locator("#password")
        .fill(userSalonData.password.substring(0, 3));
      await page
        .locator("#confirmPassword")
        .fill(userSalonData.password.substring(0, 3));
      await page.locator("#role-select").selectOption("salon");

      await page.getByRole("button", { name: "Create Account" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);

      await expect(
        page.getByText(/Password should be at least 8 characters/)
      ).toBeVisible();

      expect(page.url()).toContain("signup");
    });

    test("Salon signup witn invalid phone number", async ({ page }) => {
      await page.locator("#phone").fill(userSalonData.phone.substring(0, 3));
      await page.locator("#password").fill(userSalonData.password);
      await page.locator("#confirmPassword").fill(userSalonData.password);
      await page.locator("#role-select").selectOption("salon");

      await page.getByRole("button", { name: "Create Account" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);

      await expect(
        page.getByText(/Phone number format is not valid/)
      ).toBeVisible();

      expect(page.url()).toContain("signup");
    });

    test("Salon signup successful", async ({ page }) => {
      await page.locator("#phone").fill(userSalonData.phone);
      await page.locator("#password").fill(userSalonData.password);
      await page.locator("#confirmPassword").fill(userSalonData.password);
      await page.locator("#role-select").selectOption("salon");

      await page.getByRole("button", { name: "Create Account" }).click();

      await page.waitForURL(/dashboard/);
      await page.getByLabel("close").click();

      await expect(page.getByText(/Total Customers/)).toBeVisible();
    });

    test("Salon signup with existed phone", async ({ page }) => {
      await page.locator("#phone").fill(userSalonData.phone);
      await page.locator("#password").fill(userSalonData.password);
      await page.locator("#confirmPassword").fill(userSalonData.password);
      await page.locator("#role-select").selectOption("salon");

      await page.getByRole("button", { name: "Create Account" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);

      await expect(page.getByText(/phone already exists/)).toBeVisible();

      expect(page.url()).toContain("signup");
    });
  });

  test.describe("Salon signup with email", () => {
    test.describe.configure({ mode: "serial" });
    test.beforeEach(async ({ page }) => {
      await page.goto("/" + "auth/signup");

      await page.locator("#tab-1").click();
    });

    test("Salon signup witn invalid email", async ({ page }) => {
      await page.locator("#email").fill(userSalonData.email.substring(0, 3));
      await page.locator("#password").fill(userSalonData.password);
      await page.locator("#confirmPassword").fill(userSalonData.password);
      await page.locator("#role-select").selectOption("salon");

      await page.getByRole("button", { name: "Create Account" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);

      await expect(page.getByText(/Email is not valid/)).toBeVisible();

      expect(page.url()).toContain("signup");
    });

    test("Salon signup successful", async ({ page }) => {
      await page.locator("#email").fill(userSalonData.email);
      await page.locator("#password").fill(userSalonData.password);
      await page.locator("#confirmPassword").fill(userSalonData.password);
      await page.locator("#role-select").selectOption("salon");

      await page.getByRole("button", { name: "Create Account" }).click();

      await page.waitForURL(/dashboard/);
      await page.getByLabel("close").click();

      await expect(page.getByText(/Total Customers/)).toBeVisible();
    });

    test("Salon signup with existed email", async ({ page }) => {
      await page.locator("#email").fill(userSalonData.email);
      await page.locator("#password").fill(userSalonData.password);
      await page.locator("#confirmPassword").fill(userSalonData.password);
      await page.locator("#role-select").selectOption("salon");

      await page.getByRole("button", { name: "Create Account" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);

      await expect(page.getByText(/email already exists/)).toBeVisible();

      expect(page.url()).toContain("signup");
    });

    test("Customer signup successful", async ({ page }) => {
      await page.locator("#email").fill(userCustomerData.email);
      await page.locator("#password").fill(userCustomerData.password);
      await page.locator("#confirmPassword").fill(userCustomerData.password);
      await page.locator("#role-select").selectOption("customer");

      await page.getByRole("button", { name: "Create Account" }).click();

      await page.waitForURL(/customer\/dashboard/);
      await page.getByLabel("close").click();

      await expect(
        page.getByRole("link", { name: "View Salons" })
      ).toBeVisible();
    });
  });
});
