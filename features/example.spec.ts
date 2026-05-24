import { test } from '@playwright/test';
import { BasePage } from '../models/basePage';

test('should load google and verify title contains Google', async ({ page }) => {
  const basePage = new BasePage(page, 'https://google.com');
  await basePage.visit();
  await basePage.expectTitle(/Google/);
});
