import { test, expect } from '@playwright/test';

test('login page loads', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await expect(page.locator('h2')).toContainText('Login');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

test('register new user', async ({ page }) => {
  await page.goto('http://localhost:5173');
  await page.click('text=Cadastrar');
  await expect(page.locator('h2')).toContainText('Criar Conta');
  await page.fill('input[type="email"]', `user${Date.now()}@test.com`);
  await page.fill('input[type="password"]', 'test123456');
  await page.fill('input[type="text"]', 'Test User');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Todo')).toBeVisible();
  await expect(page.locator('text=Sair')).toBeVisible();
});
