import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BASE_URL = 'http://localhost:5173';

async function goToLogin(page: import('@playwright/test').Page) {
  await page.goto(BASE_URL);
  // Ensure we are on the login screen (no stored token)
  await page.evaluate(() => localStorage.removeItem('token'));
  await page.goto(BASE_URL);
}

// ---------------------------------------------------------------------------
// 1. Login page loads
// ---------------------------------------------------------------------------

test('login page loads', async ({ page }) => {
  await goToLogin(page);
  await expect(page.locator('h2')).toContainText('Login');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
});

// ---------------------------------------------------------------------------
// 2. Register new user
// ---------------------------------------------------------------------------

test('register new user', async ({ page }) => {
  await goToLogin(page);
  await page.click('text=Cadastrar');
  await expect(page.locator('h2')).toContainText('Criar Conta');
  await page.fill('#email', `user${Date.now()}@test.com`);
  await page.fill('#password', 'test123456');
  await page.fill('#name', 'Test User');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Todo')).toBeVisible();
  await expect(page.locator('text=Sair')).toBeVisible();
});

// ---------------------------------------------------------------------------
// 3. Successful login flow — token stored, task list visible
// ---------------------------------------------------------------------------

test('should complete successful login and show task list', async ({ page }) => {
  // Register a unique user first then login
  const email = `login${Date.now()}@test.com`;
  const password = 'password123';

  await goToLogin(page);
  // Register
  await page.click('text=Cadastrar');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Todo')).toBeVisible();

  // Logout
  await page.click('text=Sair');

  // Login
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');

  await expect(page.locator('text=Todo')).toBeVisible();
  await expect(page.locator('text=Sair')).toBeVisible();

  const token = await page.evaluate(() => localStorage.getItem('token'));
  expect(token).toBeTruthy();
});

// ---------------------------------------------------------------------------
// 4. Invalid email format — inline validation error before submit
// ---------------------------------------------------------------------------

test('should show inline validation error for invalid email format', async ({ page }) => {
  await goToLogin(page);
  await page.fill('#email', 'not-an-email');
  await page.fill('#password', 'somepassword');
  await page.click('button[type="submit"]');

  const emailError = page.locator('#email-error');
  await expect(emailError).toBeVisible();
  await expect(emailError).toContainText('Enter a valid email address');
});

// ---------------------------------------------------------------------------
// 5. Email required validation
// ---------------------------------------------------------------------------

test('should show email required error when email is empty', async ({ page }) => {
  await goToLogin(page);
  await page.fill('#password', 'somepassword');
  await page.click('button[type="submit"]');

  const emailError = page.locator('#email-error');
  await expect(emailError).toBeVisible();
  await expect(emailError).toContainText('Email is required');
});

// ---------------------------------------------------------------------------
// 6. Password required validation
// ---------------------------------------------------------------------------

test('should show password required error when password is empty', async ({ page }) => {
  await goToLogin(page);
  await page.fill('#email', 'user@example.com');
  await page.click('button[type="submit"]');

  const passwordError = page.locator('#password-error');
  await expect(passwordError).toBeVisible();
  await expect(passwordError).toContainText('Password is required');
});

// ---------------------------------------------------------------------------
// 7. Wrong password — backend error displayed
// ---------------------------------------------------------------------------

test('should display Incorrect password error from backend', async ({ page }) => {
  const email = `wrongpwd${Date.now()}@test.com`;

  // Register the user first
  await goToLogin(page);
  await page.click('text=Cadastrar');
  await page.fill('#email', email);
  await page.fill('#password', 'correctPassword');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=Todo')).toBeVisible();
  await page.click('text=Sair');

  // Try to login with wrong password
  await page.fill('#email', email);
  await page.fill('#password', 'wrongPassword');
  await page.click('button[type="submit"]');

  const banner = page.locator('[role="alert"]');
  await expect(banner).toContainText('Incorrect password');
});

// ---------------------------------------------------------------------------
// 8. User not found — backend error displayed
// ---------------------------------------------------------------------------

test('should display No account found error when user does not exist', async ({ page }) => {
  await goToLogin(page);
  await page.fill('#email', `nonexistent${Date.now()}@nowhere.com`);
  await page.fill('#password', 'anypassword');
  await page.click('button[type="submit"]');

  const banner = page.locator('[role="alert"]');
  await expect(banner).toContainText('No account found with this email');
});

// ---------------------------------------------------------------------------
// 9. Loading state — submit button disabled and shows loading label
// ---------------------------------------------------------------------------

test('should show loading state on submit button while request is in-flight', async ({ page }) => {
  await goToLogin(page);

  // Delay all network requests so we can observe the loading state
  await page.route('**/auth/login', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.continue();
  });

  await page.fill('#email', 'test@example.com');
  await page.fill('#password', 'password123');
  await page.click('button[type="submit"]');

  const submitBtn = page.locator('button[type="submit"]');
  await expect(submitBtn).toBeDisabled();
  await expect(submitBtn).toContainText('Entrando...');
});

// ---------------------------------------------------------------------------
// 10. Password toggle — eye icon reveals / hides password
// ---------------------------------------------------------------------------

test('should toggle password visibility when eye icon is clicked', async ({ page }) => {
  await goToLogin(page);

  const passwordInput = page.locator('#password');
  await expect(passwordInput).toHaveAttribute('type', 'password');

  // Click the toggle button to show password
  await page.click('button[aria-label="Mostrar senha"]');
  await expect(passwordInput).toHaveAttribute('type', 'text');

  // Click the toggle button to hide password
  await page.click('button[aria-label="Ocultar senha"]');
  await expect(passwordInput).toHaveAttribute('type', 'password');
});

// ---------------------------------------------------------------------------
// 11. Viewport tests — 375px (mobile), 768px (tablet), 1280px (desktop)
// ---------------------------------------------------------------------------

for (const [label, width, height] of [
  ['mobile (375px)', 375, 812],
  ['tablet (768px)', 768, 1024],
  ['desktop (1280px)', 1280, 800],
] as [string, number, number][]) {
  test(`should render login form correctly on ${label}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await goToLogin(page);

    await expect(page.locator('h2')).toContainText('Login');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
}
