import { Before, After, Given, Then } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';
import { getScenarioData } from '../fixtures';
import { ExamplePage } from '../models/ExamplePage';

interface CustomWorld {
  browser?: Browser;
  page: Page;
  examplePage: ExamplePage;
  scenarioData: ReturnType<typeof getScenarioData>;
}

Before(async function (this: CustomWorld, { pickle }) {
  this.browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  this.page = await this.browser.newPage({ viewport: null });
  this.examplePage = new ExamplePage(this.page);
  this.scenarioData = getScenarioData(pickle.name);
});

After(async function (this: CustomWorld) {
  if (this.page) await this.page.close();
  if (this.browser) await this.browser.close();
});

Given('I navigate to the example site', async function (this: CustomWorld) {
  await this.examplePage.open(this.scenarioData.url);
});

Then('the page title should contain {string}', async function (this: CustomWorld, expected: string) {
  await this.examplePage.expectTitle(expected || this.scenarioData.title || '');
});

