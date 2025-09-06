import { test, expect } from "@playwright/test";

test.describe("Auth page buttons", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/" + "auth");
  });
  test("Signup with email/phone exists'", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Use phone or email" })
    ).toBeVisible();
  });

  test("Continue with Google exists", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: "Continue with Google" })
    ).toBeVisible();
  });
  test("Sign in exists", async ({ page }) => {
    await expect(page.getByRole("link", { name: /Sign in/ })).toBeVisible();
  });
});

test.describe("Auth page buttons navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/" + "auth");
  });

  test("Signup with email/phone button navigate to the signup page'", async ({
    page,
  }) => {
    page.getByRole("link", { name: "Use phone or email" }).click();
    await page.waitForURL(/signup/);

    await expect(
      page.getByRole("button", { name: /Create Account/ })
    ).toBeVisible();
  });

  test("Sign in button navigate to the Signin page", async ({ page }) => {
    await page.getByRole("link", { name: /Sign in/ }).click();
    await page.waitForURL(/signin/);

    await expect(page.getByRole("button", { name: /Sign in/ })).toBeVisible();
  });
});
