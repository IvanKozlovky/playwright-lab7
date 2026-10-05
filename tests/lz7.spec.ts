import { test, expect } from '@playwright/test';

/*
 * ТЕСТ-ДИЗАЙН
 * Сценарій: додавання ноутбука в кошик з каталогу та видалення його з кошика.
 * Сайт: https://tutorialsninja.com/demo/ (демонстраційний інтернет-магазин OpenCart).
 * Сайт https://magento.softwaretestingboard.com/ з методичних вказівок на момент
 * виконання роботи був недоступний (помилка Cloudflare 526: Invalid SSL certificate),
 * тому тест написано для іншого навчального магазину.
 *
 * Крок 1. Відкрити головну сторінку магазину.
 *   Очікуваний результат: сторінка відкрита, заголовок вкладки – "Your Store".
 *
 * Крок 2. У головному меню вибрати "Laptops & Notebooks" -> "Show All Laptops & Notebooks".
 *   Очікуваний результат: відкрито категорію, заголовок сторінки – "Laptops & Notebooks",
 *   у списку 5 товарів.
 *
 * Крок 3. Відкрити сторінку товару "HP LP3065".
 *   Очікуваний результат: заголовок товару – "HP LP3065", ціна – $122.00,
 *   наявність – "In Stock".
 *
 * Крок 4. У полі "Qty" вказати кількість 2 і натиснути "Add to Cart".
 *   Очікуваний результат: з'явилось повідомлення
 *   "Success: You have added HP LP3065 to your shopping cart!".
 *
 * Крок 5. Перевірити кнопку кошика у верхній частині сторінки.
 *   Очікуваний результат: на кнопці відображається "2 item(s) - $244.00".
 *
 * Крок 6. Перейти в кошик за посиланням "shopping cart" у повідомленні.
 *   Очікуваний результат: відкрито сторінку кошика; у таблиці товар "HP LP3065",
 *   кількість 2, сума $244.00.
 *
 * Крок 7. Видалити товар з кошика кнопкою "Remove".
 *   Очікуваний результат: відображається повідомлення "Your shopping cart is empty!".
 */

test('додавання ноутбука HP LP3065 в кошик і видалення з кошика', async ({ page }) => {
  // Крок 1
  await page.goto('https://tutorialsninja.com/demo/');
  await expect(page).toHaveTitle('Your Store');

  // Крок 2
  await page.locator('#menu').getByRole('link', { name: 'Laptops & Notebooks', exact: true }).click();
  await page.getByRole('link', { name: /Show All\s*Laptops & Notebooks/ }).click();
  await expect(page.locator('#content h2')).toHaveText('Laptops & Notebooks');
  await expect(page.locator('.product-thumb')).toHaveCount(5);

  // Крок 3
  await page.locator('.product-thumb h4').getByRole('link', { name: 'HP LP3065' }).click();
  await expect(page.locator('#content h1')).toHaveText('HP LP3065');
  await expect(page.locator('#content h2', { hasText: '$122.00' })).toBeVisible();
  await expect(page.getByText(/Availability:\s*In Stock/)).toBeVisible();

  // Крок 4
  await page.locator('#input-quantity').fill('2');
  await page.locator('#button-cart').click();
  await expect(page.locator('.alert-success')).toContainText(
    'Success: You have added HP LP3065 to your shopping cart!'
  );

  // Крок 5
  await expect(page.locator('#cart-total')).toHaveText('2 item(s) - $244.00');

  // Крок 6
  await page.locator('.alert-success').getByRole('link', { name: 'shopping cart' }).click();
  await expect(page).toHaveURL(/route=checkout\/cart/);
  const row = page.locator('#content form table tbody tr');
  await expect(row.getByRole('link', { name: 'HP LP3065' }).last()).toBeVisible();
  await expect(row.locator('input[name^="quantity"]')).toHaveValue('2');
  await expect(row.locator('td').last()).toHaveText('$244.00');

  // Крок 7
  await row.locator('button[data-original-title="Remove"], button[title="Remove"]').click();
  await expect(page.locator('#content').getByText('Your shopping cart is empty!')).toBeVisible();
});
