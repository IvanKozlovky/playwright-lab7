import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class CartPage extends BasePage {
  readonly rows = this.page.locator('#content form table tbody tr');
  readonly emptyCartMessage = this.page.locator('#content').getByText('Your shopping cart is empty!');

  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate(`${this.baseUrl}index.php?route=checkout/cart`);
  }

  row(productName: string): Locator {
    return this.rows.filter({ hasText: productName });
  }

  quantityInput(productName: string): Locator {
    return this.row(productName).locator('input[name^="quantity"]');
  }

  rowTotal(productName: string): Locator {
    return this.row(productName).locator('td').last();
  }

  async removeProduct(productName: string): Promise<void> {
    await this.row(productName)
      .locator('button[data-original-title="Remove"], button[title="Remove"]')
      .click();
  }
}
