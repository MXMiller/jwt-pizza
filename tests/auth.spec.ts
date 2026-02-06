import { test, expect } from 'playwright-test-coverage';
import { Page } from 'playwright';

async function basicLogin(page: Page) {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'test@jwt.com', password: 'testp' };
    const loginRes = {
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@jwt.com',
        roles: [{ role: 'diner' }],
      },
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto('http://localhost:5173/');
  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('test@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('testp');
  await page.getByRole('button', { name: 'Login' }).click();
}

test('register test', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const registerReq = { name: 'Test User', email: 'test@jwt.com', password: 'testp' };
    const registerRes = {
      user: {
        id: 1,
        name: 'Test User',
        email: 'test@jwt.com',
        roles: [{ role: 'diner' }],
      },
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('POST');
    expect(route.request().postDataJSON()).toMatchObject(registerReq);
    await route.fulfill({ json: registerRes });
  });

  await page.goto('http://localhost:5173/');
  
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('Test User');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('test@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('testp');
  await page.getByRole('button', { name: 'Register' }).click();
});

test('login logout test', async ({ page }) => {
  await basicLogin(page);
  await expect(page.getByRole('link', { name: 'TU' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();

  await page.route('*/**/api/auth', async (route) => {
    const logoutReq = { email: 'test@jwt.com', password: 'testp' };
    const logoutRes = {
      message: 'logout successful',
    };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: logoutRes });
  });

  await expect(page.getByRole('link', { name: 'Logout' })).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
});
