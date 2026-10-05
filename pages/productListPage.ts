import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

/** Сторінка зі списком товарів: категорія або результати пошуку. */
export class ProductListPage extends BasePage {
  readonly searchHeading = this.page.locator('#content h1');
  readonly categoryHeading = this.page.locator('#content h2');
  readonly productCards = this.page.locator('.product-thumb');
  readonly noResultsMessage = this.page
    .locator('#content')
    .getByText('There is no product that matches the search criteria.');

  constructor(page: Page) {
    super(page);
  }

  productLink(productName: string): Locator {
    return this.productCards.locator('h4').getByRole('link', { name: productName, exact: true });
  }

  async openProduct(productName: string): Promise<void> {
    await this.productLink(productName).click();
  }
}
