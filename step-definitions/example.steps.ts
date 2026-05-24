import { Before, After, Given, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page, expect } from '@playwright/test';

interface CustomWorld {
  browser?: Browser;
  page: Page;
}

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  this.page = await this.browser.newPage({ viewport: null });
});

After(async function (this: CustomWorld) {
  if (this.page) await this.page.close();
  if (this.browser) await this.browser.close();
});

Given('I navigate to the example site', async function (this: CustomWorld) {
  await this.page.goto('https://google.com');
  await this.page.waitForTimeout(3000);
});

Then('the page title should contain {string}', async function (this: CustomWorld, expected: string) {
  await expect(this.page).toHaveTitle(expected);
});
