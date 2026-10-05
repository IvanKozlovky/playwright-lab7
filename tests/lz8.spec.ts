import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { ProductListPage } from '../pages/productListPage';
import { ProductPage } from '../pages/productPage';
import { CartPage } from '../pages/cartPage';

const PRODUCT = 'HP LP3065';

test.describe('Тести магазину з використанням POM', () => {
  let homePage: HomePage;
  let productListPage: ProductListPage;
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productListPage = new ProductListPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
  });

  // Перероблений тест lz-codegen.spec.ts з лабораторної роботи №7
  test('пошук ноутбука, перевірка ціни та наявності', async ({ page }) => {
    await homePage.open();
    await expect(page).toHaveURL(homePage.baseUrl);

    await homePage.searchFor(PRODUCT);
    await expect(productListPage.searchHeading).toHaveText(`Search - ${PRODUCT}`);
    await expect(productListPage.productLink(PRODUCT)).toBeVisible();

    await productListPage.openProduct(PRODUCT);
    await expect(productPage.productName).toHaveText(PRODUCT);
    await expect(productPage.productPrice).toHaveText('$122.00');
    await expect(productPage.availability).toContainText('In Stock');
  });

  // Перероблений тест lz7.spec.ts з лабораторної роботи №7
  test('додавання ноутбука в кошик і видалення з кошика', async ({ page }) => {
    await homePage.open();
    expect(await homePage.getPageTitle()).toBe('Your Store');

    await homePage.openCategory('Laptops & Notebooks');
    await expect(productListPage.categoryHeading).toHaveText('Laptops & Notebooks');
    await expect(productListPage.productCards).toHaveCount(5);

    await productListPage.openProduct(PRODUCT);
    await expect(productPage.productName).toHaveText(PRODUCT);
    await expect(productPage.productPrice).toHaveText('$122.00');
    await expect(productPage.availability).toContainText('In Stock');

    await productPage.addToCart(2);
    await expect(productPage.successMessage).toContainText(
      `Success: You have added ${PRODUCT} to your shopping cart!`
    );
    await expect(productPage.cartTotal).toHaveText('2 item(s) - $244.00');

    await productPage.goToCartFromMessage();
    await expect(page).toHaveURL(/route=checkout\/cart/);
    await expect(cartPage.row(PRODUCT)).toBeVisible();
    await expect(cartPage.quantityInput(PRODUCT)).toHaveValue('2');
    await expect(cartPage.rowTotal(PRODUCT)).toHaveText('$244.00');

    await cartPage.removeProduct(PRODUCT);
    await expect(cartPage.emptyCartMessage).toBeVisible();
  });

  // Новий тест (розширення): негативний сценарій пошуку
  test('пошук товару, якого немає в каталозі', async () => {
    await homePage.open();

    await homePage.searchFor('qwerty12345');
    await expect(productListPage.searchHeading).toHaveText('Search - qwerty12345');
    await expect(productListPage.productCards).toHaveCount(0);
    await expect(productListPage.noResultsMessage).toBeVisible();
  });

  // Новий тест (розширення): відкриття товару за прямим посиланням
  test('сторінка товару відкривається за прямим посиланням', async () => {
    await productPage.open(47);

    expect(await productPage.getProductName()).toBe(PRODUCT);
    expect(await productPage.getProductPrice()).toBe('$122.00');
    await expect(productPage.addToCartButton).toBeVisible();
    await expect(productPage.cartTotal).toHaveText('0 item(s) - $0.00');
  });
});
