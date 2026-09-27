import { Page } from '@playwright/test';

export class NaukriPageLocators {
  readonly username = this.page.getByPlaceholder('Enter Email ID / Username');
  readonly password = this.page.getByPlaceholder('Enter Password');
  readonly loginButton = this.page.getByRole('button', { name: 'Login', exact: true });

  constructor(private readonly page: Page) {}
}