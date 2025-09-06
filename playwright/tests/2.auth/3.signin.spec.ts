import { test, expect } from "@playwright/test";
import { userSalonData } from "../test-data";

test.describe("Signin process", () => {
  test.describe.configure({ mode: "serial" });

  test("Signin with wrong password", async ({ page }) => {
    await page.goto("/" + "auth/signin");
    await page.locator("#phone").fill(userSalonData.phone);
    await page
      .locator("#password")
      .fill(userSalonData.password.substring(0, 5));

    await page.getByRole("button", { name: "Sign in" }).click();

    await page.waitForResponse(async (resp) => {
      const responseBody = (await resp.body()).toString();
      expect(responseBody).toContain("Invalid credentials");

      return resp.status() === 200;
    });

    expect(page.url()).toContain("signin");
  });

  test.describe("Signin with phone", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/" + "auth/signin");
    });
    test.describe.configure({ mode: "serial" });

    test("Signin with wrong phone number", async ({ page }) => {
      await page.locator("#phone").fill(userSalonData.phone + "2525");
      await page.locator("#password").fill(userSalonData.password);

      await page.getByRole("button", { name: "Sign in" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);

      await expect(page.getByText(/Invalid credentials/)).toBeVisible();
      expect(page.url()).toContain("signin");
    });

    test("Signin successful", async ({ page }) => {
      await page.locator("#phone").fill(userSalonData.phone);
      await page.locator("#password").fill(userSalonData.password);

      await page.getByRole("button", { name: "Sign in" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);

      await page.waitForURL(/dashboard/);

      await expect(page.getByText(/Total Customers/)).toBeVisible();
    });
  });

  test.describe("Signin with email", () => {
    test.describe.configure({ mode: "serial" });
    test.beforeEach(async ({ page }) => {
      await page.goto("/" + "auth/signin");

      await page.locator("#tab-1").click();
    });

    test("Signup witn invalid email", async ({ page }) => {
      await page.locator("#email").fill(userSalonData.email.substring(0, 3));
      await page.locator("#password").fill(userSalonData.password);

      await page.getByRole("button", { name: "Sign in" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);

      await expect(page.getByText(/Invalid credentials/)).toBeVisible();
      expect(page.url()).toContain("signin");
    });

    test("Signin successful", async ({ page }) => {
      await page.locator("#email").fill(userSalonData.email);
      await page.locator("#password").fill(userSalonData.password);
      await page.getByRole("button", { name: "Sign in" }).click();

      await page.waitForResponse((resp) => resp.status() === 200);

      await page.waitForURL(/dashboard/);

      await expect(page.getByText(/Total Customers/)).toBeVisible();
    });
  });
});
