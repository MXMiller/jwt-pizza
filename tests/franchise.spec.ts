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
    const loginFReq = { email: 'f@jwt.com', password: 'franchisee' };
    const loginFRes = {
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
    expect(route.request().postDataJSON()).toMatchObject(loginFReq);
    await route.fulfill({ json: loginFRes });
  });

  await page.goto('http://localhost:5173/');
  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();
}

async function createTestStore(page: Page) {
  await page.getByRole('button', { name: 'Create store' }).click();
  await expect(page.getByText('Create store')).toBeVisible();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('TEST');
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0 ₿' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'TEST 0 ₿ Close' }).getByRole('button')).toBeVisible();
}

async function closeTestStore(page: Page) {
  await page.getByRole('row', { name: 'TEST 0 ₿ Close' }).getByRole('button').click();
  await page.getByText('Are you sure you want to').click();
  await page.getByRole('button', { name: 'Close' }).click();
}

async function mockGetFranchises(page: Page) {
  await page.route('*/**/api/franchise&page=0&limit=10&name=pizzaPocket', async (route) => {
    //const franchiseReq = { };
    const franchiseRes = {
        "id": 1,
        "name": "pizzaPocket",
        "admins": [
            {
                "id": 3,
                "name": "pizza franchisee",
                "email": "f@jwt.com"
            }
        ],
        "stores": [
            {
                "id": 1,
                "name": "SLC",
                "totalRevenue": 358.0525
            },
            {
                "id": 4,
                "name": "PROVO",
                "totalRevenue": 0.0761
            }
        ]
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });
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

test('franchisee view franchise page', async ({ page }) => {
  //await mockGetFranchises(page);
  //await mockFranchiseeLogin(page);
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  //page.waitForTimeout(100);
  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  //await page.goto('http://localhost:5173/franchise-dashboard');
  //page.waitForTimeout(100);

  await expect(page.getByText('pizzaPocket')).toBeVisible();
  await expect(page.getByText('Everything you need to run an')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'SLC' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '358.053 ₿' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'SLC 358.053 ₿ Close' }).getByRole('button')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'PROVO' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0.076 ₿' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'PROVO 0.076 ₿ Close' }).getByRole('button')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
});

test('franchisee create and close a store', async ({ page }) => {
  //await mockFranchiseeLogin(page);
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  //page.waitForTimeout(100);
  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  //await page.goto('http://localhost:5173/franchise-dashboard');
  //page.waitForTimeout(100);
  
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
  await page.getByRole('button', { name: 'Create store' }).click();
  await expect(page.getByText('Create store')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'store name' })).toBeVisible();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('TEST');
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0 ₿' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'TEST 0 ₿ Close' }).getByRole('button')).toBeVisible();
  await page.getByRole('row', { name: 'TEST 0 ₿ Close' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByText('Are you sure you want to')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('franchisee page shows revenue increase after ordering a pizza', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  
  //create TEST store
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
  await page.getByRole('button', { name: 'Create store' }).click();
  await expect(page.getByText('Create store')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'store name' })).toBeVisible();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('TEST');
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0 ₿' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'TEST 0 ₿ Close' }).getByRole('button')).toBeVisible();

  //order at TEST
  await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
  await page.getByRole('link', { name: 'Order' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
  await expect(page.getByText('Pick your store and pizzas')).toBeVisible();
  await expect(page.getByRole('combobox')).toBeVisible();
  await page.getByRole('combobox').selectOption({ label: 'TEST' });
  await expect(page.getByRole('link', { name: 'Image Description Veggie A' }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Image Description Veggie A' }).first().click();
  await expect(page.getByText('Selected pizzas:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.getByText('So worth it')).toBeVisible();
  await expect(page.getByText('Send me that pizza right now!')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Pie' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Veggie' })).toBeVisible();
  await expect(page.locator('tbody').getByRole('cell', { name: '₿' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'pie' })).toBeVisible();
  await expect(page.locator('tfoot').getByRole('cell', { name: '₿' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pay now' })).toBeVisible();
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
  await page.getByRole('button', { name: 'Close' }).click();

  //check that TEST store revenue increased
  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0.004 ₿' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'TEST 0.004 ₿ Close' }).getByRole('button')).toBeVisible();
  await page.getByRole('row', { name: 'TEST 0.004 ₿ Close' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByText('Are you sure you want to')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('admin view user page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: '常' })).toBeVisible();
  await page.getByRole('link', { name: '常' }).click();
  await expect(page.getByText('Your pizza kitchen')).toBeVisible();
  await expect(page.getByText('name:')).toBeVisible();
  await expect(page.getByText('常用名字')).toBeVisible();
  await expect(page.getByText('email:')).toBeVisible();
  await expect(page.getByText('a@jwt.com')).toBeVisible();
  await expect(page.getByText('role:')).toBeVisible();
  await expect(page.getByText('admin', { exact: true })).toBeVisible();
  await expect(page.getByText('Here is your history of all')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'ID' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Date' })).toBeVisible();
});

test('admin view admin page', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByText('Mama Ricci\'s kitchen')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Franchise', exact: true })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'pizzaPocket' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Franchisee' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'pizza franchisee' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Store' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'SLC' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'PROVO' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'pizzaPocket pizza franchisee' }).getByRole('button')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Filter franchises' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'admin-dashboard' })).toBeVisible();
});

test('admin create and close a franchise', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByText('Create franchise', { exact: true })).toBeVisible();
  await expect(page.getByText('Want to create franchise?')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'franchise name' })).toBeVisible();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('TEST');
  await expect(page.getByRole('textbox', { name: 'franchisee admin email' })).toBeVisible();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f@jwt.com');
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'pizza franchisee' }).nth(1)).toBeVisible();
  await expect(page.getByRole('row', { name: 'TEST pizza franchisee Close' }).getByRole('button')).toBeVisible();
  await page.getByRole('row', { name: 'TEST pizza franchisee Close' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByText('Are you sure you want to')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('admin page shows franchise revenue increase after ordering a pizza', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  //create TEST franchise under f2
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('TEST');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f2@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

  //f2 creates TEST store under TEST franchise
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('TEST');
  await page.getByRole('button', { name: 'Create' }).click();

  //order at TEST store
  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('combobox').selectOption({ label: 'TEST' });
  await page.getByRole('link', { name: 'Image Description Veggie A' }).first().click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();
  await expect(page.getByText('total:')).toBeVisible();
  await expect(page.getByText('0.004 ₿')).toBeVisible();

  //check TEST revenue changed for f2
  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0.004 ₿' })).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
  
  //check TEST revenue changed for admin
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'f2' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'TEST' }).nth(1)).toBeVisible();
  await expect(page.getByRole('cell', { name: '0.004 ₿' })).toBeVisible();

  //close TEST store and franchise
  await page.getByRole('row', { name: 'TEST 0.004 ₿ Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('row', { name: 'TEST f2 Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
});

test('franchise user role updates when an admin makes them a franchisee', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  //check f2 is just a diner
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'f', exact: true }).click();
  await expect(page.getByText('name:')).toBeVisible();
  await expect(page.getByText('f2', { exact: true })).toBeVisible();
  await expect(page.getByText('email:')).toBeVisible();
  await expect(page.getByText('f2@jwt.com')).toBeVisible();
  await expect(page.getByText('role:')).toBeVisible();
  await expect(page.getByText('diner', { exact: true })).toBeVisible();
  await expect(page.getByText(', Franchisee on')).not.toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();

  //make f2 a franchisee under TEST franchise
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('TEST');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f2@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

  //check f2 is now a franchisee
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

  await page.getByRole('button', { name: 'Create store' }).click();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('TEST');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₿' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'f', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'f', exact: true }).click();
  await expect(page.getByText(', Franchisee on')).toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();

  //admin close TEST store and franchise
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('textbox', { name: 'Password' }).press('Enter');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('row', { name: 'TEST 0 ₿ Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('row', { name: 'TEST f2 Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('link', { name: 'Logout' }).click();

  //check f2 is no longer a franchisee
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'f', exact: true }).click();
  await expect(page.getByText('name:')).toBeVisible();
  await expect(page.getByText('f2', { exact: true })).toBeVisible();
  await expect(page.getByText('email:')).toBeVisible();
  await expect(page.getByText('f2@jwt.com')).toBeVisible();
  await expect(page.getByText('role:')).toBeVisible();
  await expect(page.getByText('diner', { exact: true })).toBeVisible();
  await expect(page.getByText(', Franchisee on')).not.toBeVisible();
  await page.getByRole('link', { name: 'Logout' }).click();
});
