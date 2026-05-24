import { Page } from '@playwright/test';
import { pageUtils } from './utilities';

export class BasePage {
  readonly page: Page;
  readonly url: string;

  constructor(page: Page, url: string) {
    this.page = page;
    this.url = url;
  }

  async visit() {
    await pageUtils.navigateTo(this.page, this.url);
  }

  async click(selector: string) {
    await pageUtils.click(this.page, selector);
  }

  async fill(selector: string, value: string) {
    await pageUtils.fill(this.page, selector, value);
  }

  async getText(selector: string) {
    return await pageUtils.getText(this.page, selector);
  }

  async waitForVisible(selector: string, timeout = 10000) {
    await pageUtils.waitForVisible(this.page, selector, timeout);
  }

  async waitForHidden(selector: string, timeout = 10000) {
    await pageUtils.waitForHidden(this.page, selector, timeout);
  }

  async selectOption(selector: string, value: string | { value?: string; label?: string; index?: number }) {
    await pageUtils.selectOption(this.page, selector, value);
  }

  async hover(selector: string) {
    await pageUtils.hover(this.page, selector);
  }

  async getTitle() {
    return await pageUtils.getTitle(this.page);
  }

  async expectTitle(expected: string | RegExp) {
    await pageUtils.expectTitle(this.page, expected);
  }

  async isVisible(selector: string) {
    return await pageUtils.isVisible(this.page, selector);
  }
}
