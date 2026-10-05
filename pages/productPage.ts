import { Page } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductPage extends BasePage {
  readonly productName = this.page.locator('#content h1');
  readonly productPrice = this.page.locator('#content .col-sm-4 h2');
  readonly availability = this.page.locator('#content li', { hasText: 'Availability:' });
  readonly quantityInput = this.page.locator('#input-quantity');
  readonly addToCartButton = this.page.locator('#button-cart');
  readonly successMessage = this.page.locator('.alert-success');

  constructor(page: Page) {
    super(page);
  }

  async open(productId: number): Promise<void> {
    await this.navigate(`${this.baseUrl}index.php?route=product/product&product_id=${productId}`);
  }

  async getProductName(): Promise<string | null> {
    return await this.productName.textContent();
  }

  async getProductPrice(): Promise<string | null> {
    return await this.productPrice.textContent();
  }

  async addToCart(quantity = 1): Promise<void> {
    // Обробник кнопки підключається скриптом сторінки, тому чекаємо повного завантаження
    await this.page.waitForLoadState('load');
    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();
  }

  /** Переходить у кошик за посиланням у повідомленні про успішне додавання. */
  async goToCartFromMessage(): Promise<void> {
    await this.successMessage.getByRole('link', { name: 'shopping cart' }).click();
  }
}
