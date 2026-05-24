import { expect, Page } from '@playwright/test';

export const pageUtils = {
  async navigateTo(page: Page, url: string) {
    await page.goto(url);
  },

  async click(page: Page, selector: string) {
    await page.click(selector);
  },

  async fill(page: Page, selector: string, value: string) {
    await page.fill(selector, value);
  },

  async getText(page: Page, selector: string) {
    return await page.textContent(selector);
  },

  async waitForVisible(page: Page, selector: string, timeout = 10000) {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  },

  async waitForHidden(page: Page, selector: string, timeout = 10000) {
    await page.waitForSelector(selector, { state: 'hidden', timeout });
  },

  async selectOption(page: Page, selector: string, value: string | { value?: string; label?: string; index?: number }) {
    await page.selectOption(selector, value);
  },

  async hover(page: Page, selector: string) {
    await page.hover(selector);
  },

  async getTitle(page: Page) {
    return await page.title();
  },

  async expectTitle(page: Page, expected: string | RegExp) {
    await expect(page).toHaveTitle(expected);
  },

  async isVisible(page: Page, selector: string) {
    const element = await page.$(selector);
    return element ? await element.isVisible() : false;
  }
};
