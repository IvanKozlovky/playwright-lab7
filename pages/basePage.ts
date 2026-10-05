import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly baseUrl = 'https://tutorialsninja.com/demo/';

  // Елементи, спільні для всіх сторінок магазину: пошук, головне меню, кнопка кошика
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly mainMenu: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.locator('#search input[name="search"]');
    this.searchButton = page.locator('#search button');
    this.mainMenu = page.locator('#menu');
    this.cartTotal = page.locator('#cart-total');
  }

  async navigate(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /** Шукає товар через поле пошуку у верхній частині сторінки. */
  async searchFor(productName: string): Promise<void> {
    await this.searchInput.fill(productName);
    await this.searchButton.click();
  }

  /** Відкриває всі товари категорії через головне меню. */
  async openCategory(categoryName: string): Promise<void> {
    await this.mainMenu.getByRole('link', { name: categoryName, exact: true }).click();
    await this.mainMenu.getByRole('link', { name: new RegExp(`Show All\\s*${categoryName}`) }).click();
  }
}
