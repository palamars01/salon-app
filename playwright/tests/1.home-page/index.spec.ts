import { test, expect } from "@playwright/test";

const slidesData = [
  {
    title: "Join the Queue",
    description: "Easily join a queue from your phone and track your progress.",
  },
  {
    title: "Track Your Wait Time",
    description: "See real-time updates of your position and wait time.",
  },
  {
    title: "Receive Notifications",
    description: "Get alerts about your queue status and arrival time.",
  },
];

test.describe("Images slider", async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });
  test(`Slide Title and Description`, async ({ page }) => {
    const slides = await page.locator("li").all();

    for await (const [i, _] of slides.entries()) {
      const titleRegExp = new RegExp(slidesData[i].title);
      const descriptionRegExp = new RegExp(slidesData[i].description);
      await expect(page.getByText(titleRegExp).nth(1)).toBeVisible();
      await expect(page.getByText(descriptionRegExp).nth(1)).toBeVisible();

      if (i < 2) await slides[i + 1].click();
    }
  });
});

test.describe("Continue button", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Continue button", async ({ page }) => {
    const button = page.getByRole("button", { name: "Continue" });

    await expect(button).toBeVisible();
  });

  test("Continue button navigate to the auth page", async ({ page }) => {
    const button = page.getByRole("button", { name: "Continue" });

    await button.click();
    await page.waitForURL(/auth/);

    await expect(page.getByRole("link", { name: /Sign in/ })).toBeVisible();
  });
});
