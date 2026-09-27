import { Page } from '@playwright/test';
import { NaukriPageLocators } from './NaukriPageLocators';
import { runInThisContext } from 'node:vm';

export class NaukriPage {
  readonly locators: NaukriPageLocators;

  constructor(private readonly page: Page) {
    this.locators = new NaukriPageLocators(page);
  }

  async open(url: string) {
    await this.page.goto(url);
  }

  async login(username: string, password: string) {
    await this.locators.username.fill(username);
    await this.locators.password.fill(password);
    await this.locators.loginButton.click();
  }

  async navigateToLandingPage(landingUrl: string) {
    await this.page.goto(landingUrl);
    await this.page.waitForTimeout(3000);
    await this.page.waitForSelector
  }
}