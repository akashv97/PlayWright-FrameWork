import { After, Before, Given, setDefaultTimeout, Status, Then, World } from '@cucumber/cucumber';
import { chromium, Browser, Page } from '@playwright/test';
import { getScenarioData } from '../fixtures';
import { NaukriPage } from '../models/NaukriPage';

setDefaultTimeout(30_000);

interface CustomWorld extends World {
  browser?: Browser;
  page: Page;
  naukriPage: NaukriPage;
  scenarioData: ReturnType<typeof getScenarioData>;
}

Before(async function (this: CustomWorld, { pickle }) {
  this.browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
    args: ['--start-maximized']
  });
  this.page = await this.browser.newPage({ viewport: null });
  this.naukriPage = new NaukriPage(this.page);
  this.scenarioData = getScenarioData(pickle.name);
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page && !this.page.isClosed()) {
    const screenshot = await this.page.screenshot({ fullPage: true });
    await this.attach(screenshot, 'image/png');
  }

  if (this.page) await this.page.close();
  if (this.browser) await this.browser.close();
});

Given('I navigate to the naukri site', async function (this: CustomWorld) {
  await this.naukriPage.open(this.scenarioData.url);
});

Given('I gave my username and password', async function (this: CustomWorld) {
  const { username, password } = this.scenarioData;

  if (!username || !password || username.startsWith('your-') || password.startsWith('your-')) {
    throw new Error('Set valid Naukri credentials in the fixture for the selected TEST_ENV.');
  }

  await this.naukriPage.login(username, password);
});

Given('I get navigate to naukri landing page', async function (this: CustomWorld) {
  const { landingUrl } = this.scenarioData;

  if (!landingUrl) {
    throw new Error('Set a Naukri landingUrl in the fixture for the selected TEST_ENV.');
  }

  await this.naukriPage.navigateToLandingPage(landingUrl);
});
