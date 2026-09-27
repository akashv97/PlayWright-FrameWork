import { expect, Page } from '@playwright/test';
import { ExamplePageLocators } from './ExamplePageLocators';

export class ExamplePage {
  readonly locators: ExamplePageLocators;

  constructor(private readonly page: Page) {
    this.locators = new ExamplePageLocators(page);
  }

  async open(url: string) {
    await this.page.goto(url);
  }

  async expectTitle(title: string) {
    await expect(this.page).toHaveTitle(title);
  }
}