import { Page } from '@playwright/test';

export class ExamplePageLocators {
  readonly heading = this.page.getByRole('heading', { name: 'Example Domain' });

  constructor(private readonly page: Page) {}
}