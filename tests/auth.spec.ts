import { test, expect } from 'playwright-test-coverage';

test('register test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  await expect(page.getByRole('link', { name: 'Register' })).toBeVisible();
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('bobby');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('b@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('bp');
  await page.getByRole('button', { name: 'Register' }).click();

});

test('login test', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'test@jwt.com', password: 'testp' };
    const loginRes = {
      user: {
        id: 3,
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
});
