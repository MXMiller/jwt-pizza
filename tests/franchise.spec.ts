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

  await page.goto('http://localhost:5173/');
  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('t@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Login' }).click();
}

async function mockFranchiseeLogin(page: Page) {
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = { email: 'f@jwt.com', password: 'franchisee' };
    const loginRes = {
        "user": {
            "id": 3,
            "name": "pizza franchisee",
            "email": "f@jwt.com",
            "roles": [
                {
                    "role": "diner"
                },
                {
                    "objectId": 1,
                    "role": "franchisee"
                }
            ]
        },
        "token": "abcdef"
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginReq);
    await route.fulfill({ json: loginRes });
  });

  await page.goto('http://localhost:5173/');
  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();
}

test('franchise page for diners test', async ({ page }) => {
  await mockDinerLogin(page);

  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByText('So you want a piece of the')).toBeVisible();
  await expect(page.getByText('If you are already a')).toBeVisible();
  await expect(page.getByText('Call now800-555-')).toBeVisible();
  await expect(page.getByText('Now is the time to get in on')).toBeVisible();
  await expect(page.getByText('Owning a franchise with JWT Pizza can be highly profitable. With our proven')).toBeVisible();
  await expect(page.getByText('In addition to financial')).toBeVisible();
  await expect(page.getByText('But it\'s not just about the')).toBeVisible();
  await expect(page.getByRole('main').locator('img')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Year' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Profit' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Costs' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Franchise Fee' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '2020' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₿' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: '400 ₿' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₿' }).nth(2)).toBeVisible();
  await expect(page.getByRole('cell', { name: '2022' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '300 ₿' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '600 ₿' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '50 ₿' }).nth(4)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Unleash Your Potential' })).toBeVisible();
  await expect(page.getByText('Are you ready to embark on a')).toBeVisible();
  await page.getByText('If you are already a').click();
  await page.getByRole('link', { name: 'login' }).click();
  await expect(page.getByText('Welcome back')).toBeVisible();
});


