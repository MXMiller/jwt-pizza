import { test, expect } from 'playwright-test-coverage';
import { Page } from 'playwright';
import { mock } from 'node:test';

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
    const loginFReq = { email: 'f2@jwt.com', password: 'franchisee2' };
    const loginFRes = {
        "user": {
            "id": 3,
            "name": "pizza franchisee",
            "email": "f2@jwt.com",
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
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzcwNjYzNTYzfQ.TED6eoXCRGSjROklBXE01vKEkgJDS_vKSYAf0xQwgOY"
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginFReq);
    await route.fulfill({ json: loginFRes });
  });
}

async function mockGetStartingFranchises(page: Page) {
  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [
      {
        "id": 1,
        "name": "pizzaPocket",
        "admins": [
            {
                "id": 3,
                "name": "pizza franchisee",
                "email": "f2@jwt.com"
            }
        ],
        "stores": [
            {
                "id": 1,
                "name": "SLC",
                "totalRevenue": 300
            },
            {
                "id": 4,
                "name": "PROVO",
                "totalRevenue": 70
            }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });
}

async function mockCreateTestStore(page: Page) {
  await page.route('*/**/api/franchise/1/store', async (route) => {
    const storeReq = { "id":"","name":"TEST" };
    const storeRes = { "id":100,"franchiseId":100,"name":"TEST" };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: storeRes });
  });
}

async function mockCloseTestStore(page: Page) {
  await page.route('*/**/api/franchise/100/store/100', async (route) => {
    const storeRes = { "message":"store deleted" };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: storeRes });
  });
}

async function mockMenu(page: Page) {
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
        {
          "id": 1,
          "title": "Veggie",
          "image": "pizza1.png",
          "price": 0.0038,
          "description": "A garden of delight"
        },
        {
          "id": 2,
          "title": "Pepperoni",
          "image": "pizza2.png",
          "price": 0.0042,
          "description": "Spicy treat"
        },
        {
          "id": 3,
          "title": "Margarita",
          "image": "pizza3.png",
          "price": 0.0042,
          "description": "Essential classic"
        },
        {
          "id": 4,
          "title": "Crusty",
          "image": "pizza4.png",
          "price": 0.0028,
          "description": "A dry mouthed favorite"
        },
        {
          "id": 5,
          "title": "Charred Leopard",
          "image": "pizza5.png",
          "price": 0.0099,
          "description": "For those with a darker side"
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  await page.route('*/**/api/franchise?page=0&limit=20&name=*', async (route) => {
    const storeRes = {
        "franchises": [
          {
            "id": 1,
            "name": "pizzaPocket",
            "stores": [
                {
                    "id": 1,
                    "name": "SLC"
                },
                {
                    "id": 4,
                    "name": "PROVO"
                },
                {
                    "id": 100,
                    "name": "TEST"
                }
            ]
          }
        ],
        "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: storeRes });
  });
}

async function mockAdminLogin(page: Page) {
  await page.route('*/**/api/auth', async (route) => {
    const loginAReq = { email: 'a@jwt.com', password: 'admin' };
    const loginARes = {
      "user": {
        "id": 1,
        "name": "常用名字",
        "email": "a@jwt.com",
        "roles": [
            {
                "role": "admin"
            }
        ]
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzcwNjY5MDgxfQ.xY6t693HsC0fiVJkHuFWjQpgN72AiFfxy-4UlcRcCJs"
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginAReq);
    await route.fulfill({ json: loginARes });
  });
}

async function mockStartingAdminPage(page: Page) {
  await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
    const adminRes = {
      "franchises": [
        {
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
                    "totalRevenue": 300
                },
                {
                    "id": 4,
                    "name": "PROVO",
                    "totalRevenue": 70
                }
            ]
        }
      ],
      "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: adminRes });
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

  await mockFranchiseeLogin(page);
  
  await page.goto('http://localhost:5173/');

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [
      {
        "id": 1,
        "name": "pizzaPocket",
        "admins": [
            {
                "id": 3,
                "name": "pizza franchisee",
                "email": "f2@jwt.com"
            }
        ],
        "stores": [
            {
                "id": 1,
                "name": "SLC",
                "totalRevenue": 300
            },
            {
                "id": 4,
                "name": "PROVO",
                "totalRevenue": 70
            }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

  await expect(page.getByText('pizzaPocket')).toBeVisible();
  await expect(page.getByText('Everything you need to run an')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'SLC' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '300 ₿' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'SLC 300 ₿ Close' }).getByRole('button')).toBeVisible();
  await expect(page.getByRole('cell', { name: 'PROVO' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '70 ₿' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'PROVO 70 ₿ Close' }).getByRole('button')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
});

test('franchisee create and close a store', async ({ page }) => {

  await mockFranchiseeLogin(page);

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await mockGetStartingFranchises(page);

  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).not.toBeVisible();

  await mockCreateTestStore(page);
  await page.unroute('*/**/api/franchise/3');
  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [
      {
        "id": 1,
        "name": "pizzaPocket",
        "admins": [
            {
                "id": 3,
                "name": "pizza franchisee",
                "email": "f2@jwt.com"
            }
        ],
        "stores": [
            {
                "id": 1,
                "name": "SLC",
                "totalRevenue": 300
            },
            {
                "id": 4,
                "name": "PROVO",
                "totalRevenue": 70
            },
            {
                "id": 2,
                "name": "TEST",
                "totalRevenue": 0
            }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });
  
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
  await page.getByRole('button', { name: 'Create store' }).click();
  await expect(page.getByText('Create store')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'store name' })).toBeVisible();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('TEST');
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0 ₿', exact: true })).toBeVisible();
  await expect(page.getByRole('row', { name: 'TEST 0 ₿ Close' }).getByRole('button')).toBeVisible();

  await mockCloseTestStore(page);

  await page.getByRole('row', { name: 'TEST 0 ₿ Close' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByText('Are you sure you want to')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();

  await page.unroute('*/**/api/franchise/3');
  await mockGetStartingFranchises(page);

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).not.toBeVisible();
});

test('franchisee page shows revenue increase after ordering a pizza', async ({ page }) => {

  await mockFranchiseeLogin(page);

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await mockGetStartingFranchises(page);

  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).not.toBeVisible();

  await mockCreateTestStore(page);
  await page.unroute('*/**/api/franchise/3');
  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [
      {
        "id": 1,
        "name": "pizzaPocket",
        "admins": [
            {
                "id": 3,
                "name": "pizza franchisee",
                "email": "f2@jwt.com"
            }
        ],
        "stores": [
            {
                "id": 1,
                "name": "SLC",
                "totalRevenue": 300
            },
            {
                "id": 4,
                "name": "PROVO",
                "totalRevenue": 70
            },
            {
                "id": 2,
                "name": "TEST",
                "totalRevenue": 0
            }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });
  
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
  await page.getByRole('button', { name: 'Create store' }).click();
  await expect(page.getByText('Create store')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'store name' })).toBeVisible();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('TEST');
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0 ₿', exact: true })).toBeVisible();
  await expect(page.getByRole('row', { name: 'TEST 0 ₿ Close' }).getByRole('button')).toBeVisible();

  //order at TEST
  //order at TEST store
  await page.unroute('*/**/api/order/menu');
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
        {
          "id": 1,
          "title": "Veggie",
          "image": "pizza1.png",
          "price": 0.0038,
          "description": "A garden of delight"
        },
        {
          "id": 2,
          "title": "Pepperoni",
          "image": "pizza2.png",
          "price": 0.0042,
          "description": "Spicy treat"
        },
        {
          "id": 3,
          "title": "Margarita",
          "image": "pizza3.png",
          "price": 0.0042,
          "description": "Essential classic"
        },
        {
          "id": 4,
          "title": "Crusty",
          "image": "pizza4.png",
          "price": 0.0028,
          "description": "A dry mouthed favorite"
        },
        {
          "id": 5,
          "title": "Charred Leopard",
          "image": "pizza5.png",
          "price": 0.0099,
          "description": "For those with a darker side"
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });
  await page.unroute('*/**/api/franchise?page=0&limit=20&name=*');
  await page.route('*/**/api/franchise?page=0&limit=20&name=*', async (route) => {
    const storeRes = {
      "franchises": [
        {
            "id": 1,
            "name": "pizzaPocket",
            "stores": [
                {
                    "id": 1,
                    "name": "SLC"
                },
                {
                    "id": 4,
                    "name": "PROVO"
                }
            ]
        },
        {
            "id": 2,
            "name": "TEST",
            "stores": [
                {
                    "id": 2,
                    "name": "TEST"
                }
            ]
        }
      ],
      "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: storeRes });
  });
  await page.unroute('*/**/api/user/me');
  await page.route('*/**/api/user/me', async (route) => {
    const userRes = {
      "id": 3,
      "name": "f2",
      "email": "f2@jwt.com",
      "roles": [
        {
            "role": "diner"
        },
        {
            "objectId": 2,
            "role": "franchisee"
        }
      ],
      "iat": 1770762477
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: userRes });
  });

  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('combobox').selectOption({ label: 'TEST' });
  await page.getByRole('link', { name: 'Image Description Veggie A' }).first().click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.unroute('*/**/api/order');
  await page.route('*/**/api/order', async (route) => {
    const orderRes = {
      "order": {
        "items": [
            {
                "menuId": 1,
                "description": "Veggie",
                "price": 0.0038
            }
        ],
        "storeId": "2",
        "franchiseId": 2,
        "id": 1
      },
      "jwt": "eyJpYXQiOjE3NzA3NDU1OTAsImV4cCI6MTc3MDgzMTk5MCwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9TcF94VzhlM3kwNk1KS3ZIeW9sRFZMaXZXX2hnTWxhcFZSUVFQVndiY0UifQ.eyJ2ZW5kb3IiOnsiaWQiOiJtcm0yMDAzIiwibmFtZSI6Ik1heCBNaWxsZXIifSwiZGluZXIiOnsiaWQiOjMsIm5hbWUiOiJwaXp6YSBmcmFuY2hpc2VlIiwiZW1haWwiOiJmQGp3dC5jb20ifSwib3JkZXIiOnsiaXRlbXMiOlt7Im1lbnVJZCI6MSwiZGVzY3JpcHRpb24iOiJWZWdnaWUiLCJwcmljZSI6MC4wMDM4fV0sInN0b3JlSWQiOiIxIiwiZnJhbmNoaXNlSWQiOjEsImlkIjoxNjR9fQ.l6FLXxvWULRVkaHQsZHIXJW-ymAv6HXb1S-j1-0Z0OsSqYxiCKa_Zb_6722fQuzIrzjECthgXoBIKcTPOxcVQ53Q0xMojxSAzV-uzpY90AT-7_A9DNGiEyvW2vIsQkgoAPIJlxSqD0pusfgjQc24pMgpgdJEQWjdKY6OX0NB2uhkFeoYpl3GU1xSr_9n14hezhJVcypSVI4kRCq631PeT6pod8onBqKJ0zYjoQFlhQocCuQExe0n6soNbmH8QHNDtZLcZB5f-GWldQRxd6PbJA40hhtPrEZqdpPWJ4FaWbsWBPZ4yHxa80lGfAGqqX5PLDMtaGNo95rYNFtZws-ptzf0K0pAYEU0GpIwQek7rBMn4M1ohL74IFexc4h4PX2RKI55tOmd7xLhcSfoHAITLAHc7YFn9GZCSAYTTLrEZ1yfSP_bb4rzCrsuF8ISg3mamEvPmkpWql25EUPGWSxs3vwVQHG9_L7heuLug5FmPPVHH1rjO9oArqfMvW7v7BMOm40ZVPW2cUzPloM1Ni3vxO_rYciOcXcnPRstyU6bKMM5UrcptJY3NT4HdQ0Or-6-vZ4ZT-kJHjr6E1VO2a1l3icBQpVhOB5QjofwqzymFZRZ2NP7yYdxJjSn8PB3H7d5p3xmg5pikyBsxmm5_ptx8hanOhsBmYQvU4xRShthyfA"
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: orderRes });
  });

  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();
  await expect(page.getByText('total:')).toBeVisible();
  await expect(page.getByText('0.004 ₿')).toBeVisible();

  await page.route('*/**/api/order/verify', async (route) => {
    const verifyRes = {
      "message": "valid",
      "payload": {
        "vendor": {
            "id": "mrm2003",
            "name": "Max Miller"
        },
        "diner": {
            "id": 3,
            "name": "pizza franchisee",
            "email": "f@jwt.com"
        },
        "order": {
            "items": [
                {
                    "menuId": 1,
                    "description": "Veggie",
                    "price": 0.0038
                }
            ],
            "storeId": "1",
            "franchiseId": 1,
            "id": 166
        }
      }
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: verifyRes });
  });

  await page.getByRole('button', { name: 'Verify' }).click();
  await expect(page.getByRole('heading', { name: 'JWT Pizza - valid' })).toBeVisible();
  await expect(page.getByText('{ "vendor": { "id": "mrm2003')).toBeVisible();
  await expect(page.getByRole('button').filter({ hasText: /^$/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await page.getByRole('button', { name: 'Close' }).click();

  //check that TEST store revenue increased
  await page.unroute('*/**/api/franchise/3');
  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [
      {
        "id": 1,
        "name": "pizzaPocket",
        "admins": [
            {
                "id": 3,
                "name": "pizza franchisee",
                "email": "f2@jwt.com"
            }
        ],
        "stores": [
            {
                "id": 1,
                "name": "SLC",
                "totalRevenue": 300
            },
            {
                "id": 4,
                "name": "PROVO",
                "totalRevenue": 70
            },
            {
                "id": 100,
                "name": "TEST",
                "totalRevenue": 0.004
            }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0.004 ₿', exact: true })).toBeVisible();
  await expect(page.getByRole('row', { name: 'TEST 0.004 ₿ Close' }).getByRole('button')).toBeVisible();

  await mockCloseTestStore(page);

  await page.getByRole('row', { name: 'TEST 0.004 ₿ Close' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByText('Are you sure you want to')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();

  await page.unroute('*/**/api/franchise/3');
  await mockGetStartingFranchises(page);

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).not.toBeVisible();
});

test('admin view user page', async ({ page }) => {

  await mockAdminLogin(page);
  await page.route('*/**/api/order', async (route) => {
    const userRes = {
      "dinerId": 1,
      "orders": [
        {
            "id": 6,
            "franchiseId": 1,
            "storeId": 4,
            "date": "2026-01-15T19:45:00.000Z",
            "items": [
                {
                    "id": 9,
                    "menuId": 1,
                    "description": "Veggie",
                    "price": 0.0038
                }
            ]
        }
      ],
      "page": 1
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: userRes });
  });

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: '常' })).toBeVisible();
  await page.getByRole('link', { name: '常' }).click();
  await expect(page.getByText('Your pizza kitchen')).toBeVisible();
  await expect(page.getByText('name:').first()).toBeVisible();
  await expect(page.getByText('常用名字')).toBeVisible();
  await expect(page.getByText('email:').first()).toBeVisible();
  await expect(page.getByText('a@jwt.com')).toBeVisible();
  await expect(page.getByText('role:')).toBeVisible();
  await expect(page.getByText('admin', { exact: true })).toBeVisible();
  await expect(page.getByText('Here is your history of all')).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'ID' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Date' })).toBeVisible();
});

test('admin view admin page', async ({ page }) => {

  await mockAdminLogin(page);

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await mockStartingAdminPage(page);

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

  await mockAdminLogin(page);

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await mockStartingAdminPage(page);

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('button', { name: 'Add Franchise' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();

  await page.route('*/**/api/franchise', async (route) => {
    const createReq = {"stores":[],"id":"","name":"TEST","admins":[{"email":"f2@jwt.com"}]};
    const createRes = {
      "stores": [],
      "id": 1,
      "name": "TEST",
      "admins": [
        {
            "email": "f2@jwt.com",
            "id": 3,
            "name": "f2"
        }
      ]
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({json: createRes});
  });
  await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
    const createRes = {
      "franchises": [
        {
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
                    "totalRevenue": 300
                },
                {
                    "id": 4,
                    "name": "PROVO",
                    "totalRevenue": 70
                }
            ]
        },
        {
            "id": 100,
            "name": "TEST",
            "admins": [
                {
                    "id": 3,
                    "name": "f2",
                    "email": "f2@jwt.com"
                }
            ],
            "stores": []
        }
      ],
      "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({json: createRes});
  });

  await expect(page.getByText('Create franchise', { exact: true })).toBeVisible();
  await expect(page.getByText('Want to create franchise?')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'franchise name' })).toBeVisible();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('TEST');
  await expect(page.getByRole('textbox', { name: 'franchisee admin email' })).toBeVisible();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f2@jwt.com');
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await page.getByRole('button', { name: 'Create' }).click();
  
  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'f2' })).toBeVisible();
  await expect(page.getByRole('row', { name: 'TEST f2 Close' }).getByRole('button')).toBeVisible();
  await page.getByRole('row', { name: 'TEST f2 Close' }).getByRole('button').click();
  await expect(page.getByText('Sorry to see you go')).toBeVisible();
  await expect(page.getByText('Are you sure you want to')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

  await page.route('*/**/api/franchise/100', async (route) => {
    const closeRes = {"message":"franchise deleted"};
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({json: closeRes});
  });
  await page.unroute('*/**/api/franchise?page=0&limit=3&name=*');
  await mockStartingAdminPage(page);

  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).not.toBeVisible();
});

test('admin page shows franchise revenue increase after ordering a pizza', async ({ page }) => {

  await mockAdminLogin(page);

  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  //create TEST franchise under f2
  await mockStartingAdminPage(page);

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();

  await page.unroute('*/**/api/franchise');
  await page.route('*/**/api/franchise', async (route) => {
    const createReq = {"stores":[],"id":"","name":"TEST","admins":[{"email":"f2@jwt.com"}]};
    const createRes = {
      "stores": [],
      "id": 100,
      "name": "TEST",
      "admins": [
        {
            "email": "f2@jwt.com",
            "id": 100,
            "name": "f2"
        }
      ]
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({json: createRes});
  });
  await page.unroute('*/**/api/franchise?page=0&limit=3&name=*');
  await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
    const createRes = {
      "franchises": [
        {
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
                    "totalRevenue": 300
                },
                {
                    "id": 4,
                    "name": "PROVO",
                    "totalRevenue": 70
                }
            ]
        },
        {
            "id": 2,
            "name": "TEST",
            "admins": [
                {
                    "id": 3,
                    "name": "f2",
                    "email": "f2@jwt.com"
                }
            ],
            "stores": []
        }
      ],
      "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({json: createRes});
  });

  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('TEST');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f2@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

  await page.unroute('*/**/api/auth');
  await page.route('*/**/api/auth', async (route) => {
    const logoutRes = {
      message: 'logout successful',
    };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: logoutRes });
  });

  await page.getByRole('link', { name: 'Logout' }).click();

  //f2 creates TEST store under TEST franchise
  await page.unroute('*/**/api/auth');
  await page.route('*/**/api/auth', async (route) => {
    const loginFReq = { email: 'f2@jwt.com', password: 'franchisee2' };
    const loginFRes = {
        "user": {
            "id": 3,
            "name": "pizza franchisee",
            "email": "f2@jwt.com",
            "roles": [
                {
                    "role": "diner"
                },
                {
                    "objectId": 2,
                    "role": "franchisee"
                }
            ]
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzcwNjYzNTYzfQ.TED6eoXCRGSjROklBXE01vKEkgJDS_vKSYAf0xQwgOY"
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginFReq);
    await route.fulfill({ json: loginFRes });
  });
  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.unroute('*/**/api/franchise/3');
  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [
      {
        "id": 2,
        "name": "TEST",
        "admins": [
            {
                "id": 3,
                "name": "f2",
                "email": "f2@jwt.com"
            }
        ],
        "stores": []
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('button', { name: 'Create store' })).toBeVisible();
  
  await mockCreateTestStore(page);
  await page.unroute('*/**/api/franchise/3');
  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [
      {
        "id": 2,
        "name": "TEST",
        "admins": [
            {
                "id": 3,
                "name": "f2",
                "email": "f2@jwt.com"
            }
        ],
        "stores": [
          {
              "id": 2,
              "name": "TEST",
              "totalRevenue": 0
          }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await page.getByRole('button', { name: 'Create store' }).click();
  await expect(page.getByText('Create store')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'store name' })).toBeVisible();
  await page.getByRole('textbox', { name: 'store name' }).click();
  await page.getByRole('textbox', { name: 'store name' }).fill('TEST');
  await expect(page.getByRole('button', { name: 'Create' })).toBeVisible();
  await page.getByRole('button', { name: 'Create' }).click();

  //order at TEST store
  await page.unroute('*/**/api/order/menu');
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
        {
          "id": 1,
          "title": "Veggie",
          "image": "pizza1.png",
          "price": 0.0038,
          "description": "A garden of delight"
        },
        {
          "id": 2,
          "title": "Pepperoni",
          "image": "pizza2.png",
          "price": 0.0042,
          "description": "Spicy treat"
        },
        {
          "id": 3,
          "title": "Margarita",
          "image": "pizza3.png",
          "price": 0.0042,
          "description": "Essential classic"
        },
        {
          "id": 4,
          "title": "Crusty",
          "image": "pizza4.png",
          "price": 0.0028,
          "description": "A dry mouthed favorite"
        },
        {
          "id": 5,
          "title": "Charred Leopard",
          "image": "pizza5.png",
          "price": 0.0099,
          "description": "For those with a darker side"
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });
  await page.unroute('*/**/api/franchise?page=0&limit=20&name=*');
  await page.route('*/**/api/franchise?page=0&limit=20&name=*', async (route) => {
    const storeRes = {
      "franchises": [
        {
            "id": 1,
            "name": "pizzaPocket",
            "stores": [
                {
                    "id": 1,
                    "name": "SLC"
                },
                {
                    "id": 4,
                    "name": "PROVO"
                }
            ]
        },
        {
            "id": 2,
            "name": "TEST",
            "stores": [
                {
                    "id": 2,
                    "name": "TEST"
                }
            ]
        }
      ],
      "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: storeRes });
  });
  await page.unroute('*/**/api/user/me');
  await page.route('*/**/api/user/me', async (route) => {
    const userRes = {
      "id": 3,
      "name": "f2",
      "email": "f2@jwt.com",
      "roles": [
        {
            "role": "diner"
        },
        {
            "objectId": 2,
            "role": "franchisee"
        }
      ],
      "iat": 1770762477
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: userRes });
  });

  await page.getByRole('link', { name: 'Order' }).click();
  await page.getByRole('combobox').selectOption({ label: 'TEST' });
  await page.getByRole('link', { name: 'Image Description Veggie A' }).first().click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await page.unroute('*/**/api/order');
  await page.route('*/**/api/order', async (route) => {
    const orderRes = {
      "order": {
        "items": [
            {
                "menuId": 1,
                "description": "Veggie",
                "price": 0.0038
            }
        ],
        "storeId": "2",
        "franchiseId": 2,
        "id": 1
      },
      "jwt": "eyJpYXQiOjE3NzA3NDU1OTAsImV4cCI6MTc3MDgzMTk5MCwiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9TcF94VzhlM3kwNk1KS3ZIeW9sRFZMaXZXX2hnTWxhcFZSUVFQVndiY0UifQ.eyJ2ZW5kb3IiOnsiaWQiOiJtcm0yMDAzIiwibmFtZSI6Ik1heCBNaWxsZXIifSwiZGluZXIiOnsiaWQiOjMsIm5hbWUiOiJwaXp6YSBmcmFuY2hpc2VlIiwiZW1haWwiOiJmQGp3dC5jb20ifSwib3JkZXIiOnsiaXRlbXMiOlt7Im1lbnVJZCI6MSwiZGVzY3JpcHRpb24iOiJWZWdnaWUiLCJwcmljZSI6MC4wMDM4fV0sInN0b3JlSWQiOiIxIiwiZnJhbmNoaXNlSWQiOjEsImlkIjoxNjR9fQ.l6FLXxvWULRVkaHQsZHIXJW-ymAv6HXb1S-j1-0Z0OsSqYxiCKa_Zb_6722fQuzIrzjECthgXoBIKcTPOxcVQ53Q0xMojxSAzV-uzpY90AT-7_A9DNGiEyvW2vIsQkgoAPIJlxSqD0pusfgjQc24pMgpgdJEQWjdKY6OX0NB2uhkFeoYpl3GU1xSr_9n14hezhJVcypSVI4kRCq631PeT6pod8onBqKJ0zYjoQFlhQocCuQExe0n6soNbmH8QHNDtZLcZB5f-GWldQRxd6PbJA40hhtPrEZqdpPWJ4FaWbsWBPZ4yHxa80lGfAGqqX5PLDMtaGNo95rYNFtZws-ptzf0K0pAYEU0GpIwQek7rBMn4M1ohL74IFexc4h4PX2RKI55tOmd7xLhcSfoHAITLAHc7YFn9GZCSAYTTLrEZ1yfSP_bb4rzCrsuF8ISg3mamEvPmkpWql25EUPGWSxs3vwVQHG9_L7heuLug5FmPPVHH1rjO9oArqfMvW7v7BMOm40ZVPW2cUzPloM1Ni3vxO_rYciOcXcnPRstyU6bKMM5UrcptJY3NT4HdQ0Or-6-vZ4ZT-kJHjr6E1VO2a1l3icBQpVhOB5QjofwqzymFZRZ2NP7yYdxJjSn8PB3H7d5p3xmg5pikyBsxmm5_ptx8hanOhsBmYQvU4xRShthyfA"
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: orderRes });
  });

  await page.getByRole('button', { name: 'Pay now' }).click();
  await expect(page.getByText('Here is your JWT Pizza!')).toBeVisible();
  await expect(page.getByText('total:')).toBeVisible();
  await expect(page.getByText('0.004 ₿')).toBeVisible();

  //check TEST revenue changed for f2
  await page.unroute('*/**/api/franchise/3');
  await page.route('*/**/api/franchise/3', async (route) => {
    const franchiseRes = [
      {
        "id": 2,
        "name": "TEST",
        "admins": [
            {
                "id": 3,
                "name": "f2",
                "email": "f2@jwt.com"
            }
        ],
        "stores": [
          {
              "id": 2,
              "name": "TEST",
              "totalRevenue": 0.004
          }
        ]
      }
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
  await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();

  await expect(page.getByRole('cell', { name: 'TEST' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '0.004 ₿' })).toBeVisible();

  await page.unroute('*/**/api/auth');
  await page.route('*/**/api/auth', async (route) => {
    const logoutReq = { email: 't@jwt.com', password: 'test' };
    const logoutRes = {
      message: 'logout successful',
    };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: logoutRes });
  });

  await page.getByRole('link', { name: 'Logout' }).click();
  
  //check TEST revenue changed for admin
  await page.unroute('*/**/api/auth');
  await mockAdminLogin(page);

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.unroute('*/**/api/franchise?page=0&limit=3&name=*');
  await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
    const adminRes = {
      "franchises": [
        {
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
                    "totalRevenue": 300
                },
                {
                    "id": 4,
                    "name": "PROVO",
                    "totalRevenue": 70
                }
            ]
        },
        {
            "id": 2,
            "name": "TEST",
            "admins": [
                {
                    "id": 3,
                    "name": "f2",
                    "email": "f2@jwt.com"
                }
            ],
            "stores": [
                {
                    "id": 2,
                    "name": "TEST",
                    "totalRevenue": 0.004
                }
            ]
        }
      ],
      "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: adminRes });
  });

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'f2' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'TEST' }).nth(1)).toBeVisible();
  await expect(page.getByRole('cell', { name: '0.004 ₿' })).toBeVisible();

  //close TEST store and franchise
  await mockCloseTestStore(page);
  await page.unroute('*/**/api/franchise?page=0&limit=3&name=*');
  await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
    const adminRes = {
      "franchises": [
        {
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
                    "totalRevenue": 300
                },
                {
                    "id": 4,
                    "name": "PROVO",
                    "totalRevenue": 70
                }
            ]
        },
        {
            "id": 2,
            "name": "TEST",
            "admins": [
                {
                    "id": 3,
                    "name": "f2",
                    "email": "f2@jwt.com"
                }
            ],
            "stores": []
        }
      ],
      "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: adminRes });
  });

  await page.getByRole('row', { name: 'TEST 0.004 ₿ Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();

  await page.route('*/**/api/franchise/100', async (route) => {
    const storeRes = { "message":"franchise deleted" };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: storeRes });
  });
  await page.unroute('*/**/api/franchise?page=0&limit=3&name=*');
  await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
    const adminRes = {
      "franchises": [
        {
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
                    "totalRevenue": 300
                },
                {
                    "id": 4,
                    "name": "PROVO",
                    "totalRevenue": 70
                }
            ]
        }
      ],
      "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: adminRes });
  });

  //await page.getByRole('row', { name: 'TEST f2 Close' }).getByRole('button').click();
  //await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('cell', { name: 'TEST' })).not.toBeVisible();
});

test('franchise user role updates when an admin makes them a franchisee', async ({ page }) => {

  await page.goto('http://localhost:5173/');

  //check f2 is just a diner
  await page.route('*/**/api/auth', async (route) => {
    const loginFReq = { email: 'f2@jwt.com', password: 'franchisee2' };
    const loginFRes = {
        "user": {
            "id": 3,
            "name": "pizza franchisee",
            "email": "f2@jwt.com",
            "roles": [
                {
                    "role": "diner"
                }
            ]
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzcwNjYzNTYzfQ.TED6eoXCRGSjROklBXE01vKEkgJDS_vKSYAf0xQwgOY"
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginFReq);
    await route.fulfill({ json: loginFRes });
  });
  
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pf' }).click();
  await expect(page.getByText('name:').first()).toBeVisible();
  await expect(page.getByText('pizza franchisee')).toBeVisible();
  await expect(page.getByText('email:').first()).toBeVisible();
  await expect(page.getByText('f2@jwt.com')).toBeVisible();
  await expect(page.getByText('role:')).toBeVisible();
  await expect(page.getByText('diner', { exact: true })).toBeVisible();
  await expect(page.getByText(', Franchisee on')).not.toBeVisible();

  await page.unroute('*/**/api/auth');
  await page.route('*/**/api/auth', async (route) => {
    const logoutRes = {
      message: 'logout successful',
    };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: logoutRes });
  });

  await page.getByRole('link', { name: 'Logout' }).click();

  //make f2 a franchisee under TEST franchise
  await page.unroute('*/**/api/auth');
  await mockAdminLogin(page);

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await mockStartingAdminPage(page);

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await expect(page.getByRole('heading', { name: 'Franchises' })).toBeVisible();
  await page.getByRole('button', { name: 'Add Franchise' }).click();

  await page.unroute('*/**/api/franchise');
  await page.route('*/**/api/franchise', async (route) => {
    const createReq = {"stores":[],"id":"","name":"TEST","admins":[{"email":"f2@jwt.com"}]};
    const createRes = {
      "stores": [],
      "id": 100,
      "name": "TEST",
      "admins": [
        {
            "email": "f2@jwt.com",
            "id": 100,
            "name": "f2"
        }
      ]
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({json: createRes});
  });
  await page.unroute('*/**/api/franchise?page=0&limit=3&name=*');
  await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
    const createRes = {
      "franchises": [
        {
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
                    "totalRevenue": 300
                },
                {
                    "id": 4,
                    "name": "PROVO",
                    "totalRevenue": 70
                }
            ]
        },
        {
            "id": 2,
            "name": "TEST",
            "admins": [
                {
                    "id": 3,
                    "name": "f2",
                    "email": "f2@jwt.com"
                }
            ],
            "stores": []
        }
      ],
      "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({json: createRes});
  });

  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('TEST');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('f2@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

  await page.unroute('*/**/api/auth');
  await page.route('*/**/api/auth', async (route) => {
    const logoutRes = {
      message: 'logout successful',
    };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: logoutRes });
  });

  await page.getByRole('link', { name: 'Logout' }).click();

  //check f2 is now a franchisee
  await page.route('*/**/api/auth', async (route) => {
    const loginFReq = { email: 'f2@jwt.com', password: 'franchisee2' };
    const loginFRes = {
        "user": {
            "id": 3,
            "name": "pizza franchisee",
            "email": "f2@jwt.com",
            "roles": [
                {
                    "role": "diner"
                },
                {
                    "objectId": 2,
                    "role": "franchisee"
                }
            ]
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzcwNjYzNTYzfQ.TED6eoXCRGSjROklBXE01vKEkgJDS_vKSYAf0xQwgOY"
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginFReq);
    await route.fulfill({ json: loginFRes });
  });

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pf' }).click();
  await expect(page.getByText(', Franchisee on')).toBeVisible();

  await page.unroute('*/**/api/auth');
  await page.route('*/**/api/auth', async (route) => {
    const logoutRes = {
      message: 'logout successful',
    };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: logoutRes });
  });

  await page.getByRole('link', { name: 'Logout' }).click();

  //admin close TEST store and franchise
  await page.unroute('*/**/api/auth');
  await mockAdminLogin(page);

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.unroute('*/**/api/franchise?page=0&limit=3&name=*');
  await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
    const createRes = {
      "franchises": [
        {
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
                    "totalRevenue": 300
                },
                {
                    "id": 4,
                    "name": "PROVO",
                    "totalRevenue": 70
                }
            ]
        },
        {
            "id": 2,
            "name": "TEST",
            "admins": [
                {
                    "id": 3,
                    "name": "f2",
                    "email": "f2@jwt.com"
                }
            ],
            "stores": []
        }
      ],
      "more": false
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({json: createRes});
  });

  await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
  await page.getByRole('link', { name: 'Admin' }).click();
  await page.getByRole('row', { name: 'TEST f2 Close' }).getByRole('button').click();
  await page.getByRole('button', { name: 'Close' }).click();

  await page.unroute('*/**/api/auth');
  await page.route('*/**/api/auth', async (route) => {
    const logoutRes = {
      message: 'logout successful',
    };
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: logoutRes });
  });

  await page.getByRole('link', { name: 'Logout' }).click();

  //check f2 is no longer a franchisee
  await page.route('*/**/api/auth', async (route) => {
    const loginFReq = { email: 'f2@jwt.com', password: 'franchisee2' };
    const loginFRes = {
        "user": {
            "id": 3,
            "name": "pizza franchisee",
            "email": "f2@jwt.com",
            "roles": [
                {
                    "role": "diner"
                }
            ]
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzcwNjYzNTYzfQ.TED6eoXCRGSjROklBXE01vKEkgJDS_vKSYAf0xQwgOY"
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginFReq);
    await route.fulfill({ json: loginFRes });
  });

  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f2@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee2');
  await page.getByRole('button', { name: 'Login' }).click();

  await page.getByRole('link', { name: 'pf' }).click();
  await expect(page.getByText('name:').first()).toBeVisible();
  await expect(page.getByText('pizza franchisee')).toBeVisible();
  await expect(page.getByText('email:').first()).toBeVisible();
  await expect(page.getByText('f2@jwt.com')).toBeVisible();
  await expect(page.getByText('role:')).toBeVisible();
  await expect(page.getByText('diner', { exact: true })).toBeVisible();
  await expect(page.getByText(', Franchisee on')).not.toBeVisible();
});
