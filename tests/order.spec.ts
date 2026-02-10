import { test, expect } from 'playwright-test-coverage';
import { Page } from 'playwright';

async function mockDinerLogin(page: Page) {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 't@jwt.com', password: 'test' };
    const loginRes = {
      user: {
        id: 1,
        name: 't',
        email: 't@jwt.com',
        roles: [{ role: 'diner' }],
      },
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });
}

test('order a pizza', async ({ page }) => {
  
  await page.goto('http://localhost:5173/');
  
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByText('Are you new? Register instead.')).toBeVisible();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('link', { name: 'Order' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
  await expect(page.getByText('Pick your store and pizzas')).toBeVisible();
  await expect(page.getByRole('combobox')).toBeVisible();
  await expect(page.getByText('What are you waiting for?')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Veggie A' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Pepperoni' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Margarita' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Crusty A' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Charred' }).first()).toBeVisible();
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).first().click();
  await expect(page.getByText('Selected pizzas:')).toBeVisible();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(page.getByText('So worth it')).toBeVisible();
  await expect(page.getByText('Send me that pizza right now!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pay now' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Pie' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Veggie' })).toBeVisible();
  await expect(page.locator('tbody').getByRole('cell', { name: '₿' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'pie' })).toBeVisible();
  await expect(page.locator('tfoot').getByRole('cell', { name: '₿' })).toBeVisible();
  await page.getByRole('button', { name: 'Pay now' }).click();

  await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Verify' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Order more' })).toBeVisible();
  await expect(page.getByText('order ID:')).toBeVisible();
  await expect(page.getByText('pie count:')).toBeVisible();
  await expect(page.getByText('1', { exact: true })).toBeVisible();
  await expect(page.getByText('total:')).toBeVisible();
  await expect(page.getByText('₿')).toBeVisible();
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.getByRole('heading', { name: 'JWT Pizza - valid' })).toBeVisible();
  await expect(page.getByText('{ "vendor": { "id": "mrm2003')).toBeVisible();
  await expect(page.getByRole('button').filter({ hasText: /^$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Order more' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
});

test('order many pizzas', async ({ page }) => {
  
  await page.goto('http://localhost:5173/');
  
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByText('Are you new? Register instead.')).toBeVisible();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('link', { name: 'Order' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
  await expect(page.getByText('Pick your store and pizzas')).toBeVisible();
  await expect(page.getByRole('combobox')).toBeVisible();
  await expect(page.getByText('What are you waiting for?')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Veggie A' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Pepperoni' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Margarita' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Crusty A' }).first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Image Description Charred' }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Image Description Veggie A' }).first().click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).first().click();
  await page.getByRole('link', { name: 'Image Description Margarita' }).first().click();
  await page.getByRole('link', { name: 'Image Description Crusty A' }).first().click();
  await page.getByRole('link', { name: 'Image Description Charred' }).first().click();
  await page.getByRole('combobox').selectOption('1');
  await expect(page.getByText('Selected pizzas:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(page.getByText('So worth it')).toBeVisible();
  await expect(page.getByText('Send me those 5 pizzas right')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pay now' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Pie' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Veggie' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₿' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Pepperoni' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₿' }).nth(1)).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Margarita' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₿' }).nth(2)).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Crusty' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0.003 ₿' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Charred Leopard' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0.01 ₿' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'pies' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0.025 ₿' })).toBeVisible();
  await page.getByRole('button', { name: 'Pay now' }).click();

  await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Verify' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Order more' })).toBeVisible();
  await expect(page.getByText('order ID:')).toBeVisible();
  await expect(page.getByText('pie count:')).toBeVisible();
  await expect(page.getByText('5', { exact: true })).toBeVisible();
  await expect(page.getByText('total:')).toBeVisible();
  await expect(page.getByText('₿')).toBeVisible();
  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.getByRole('heading', { name: 'JWT Pizza - valid' })).toBeVisible();
  await expect(page.getByText('{ "vendor": { "id": "mrm2003')).toBeVisible();
  await expect(page.getByRole('button').filter({ hasText: /^$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Order more' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
});

test('cancel order button works', async ({ page }) => {
  
  await page.goto('http://localhost:5173/');
  
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await page.getByRole('link', { name: 'Login' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await expect(page.getByText('Are you new? Register instead.')).toBeVisible();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('link', { name: 'Order' }).click();
  
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).first().click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.getByText('Send me that pizza right now!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
});