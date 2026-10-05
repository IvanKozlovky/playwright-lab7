import { test, expect } from '@playwright/test';

test('пошук ноутбука HP LP3065, перевірка ціни та наявності', async ({ page }) => {
  // 1.1 Відкрити сайт магазину комп'ютерної техніки та перевірити URL-адресу
  await page.goto('https://tutorialsninja.com/demo/');
  await expect(page).toHaveURL('https://tutorialsninja.com/demo/');

  // 1.2 Знайти товар і перевірити, що товар з указаною назвою знайдено
  await page.getByRole('textbox', { name: 'Search' }).click();
  await page.getByRole('textbox', { name: 'Search' }).fill('HP LP3065');
  await page.locator('#search').getByRole('button').click();
  await expect(page.getByRole('heading', { name: 'Search - HP LP3065' })).toBeVisible();
  await expect(page.locator('h4').getByRole('link', { name: 'HP LP3065' })).toBeVisible();

  // 1.3 Відкрити сторінку товару, перевірити ціну та наявність
  await page.locator('h4').getByRole('link', { name: 'HP LP3065' }).click();
  await expect(page.getByRole('heading', { name: 'HP LP3065' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '$122.00' })).toBeVisible();
  await expect(page.getByText(/Availability:\s*In Stock/)).toBeVisible();
});
