import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate(this.baseUrl);
  }
}
