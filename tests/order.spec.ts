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
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzcwNjYzNTYzfQ.TED6eoXCRGSjROklBXE01vKEkgJDS_vKSYAf0xQwgOY"
    };
    expect(route.request().method()).toBe('PUT');
    expect(route.request().postDataJSON()).toMatchObject(loginFReq);
    await route.fulfill({ json: loginFRes });
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

test('order a pizza', async ({ page }) => {
  
  await page.goto('http://localhost:5173/');

  await mockFranchiseeLogin(page);
  
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  await mockMenu(page);

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
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();

  await page.unroute('*/**/api/user/me');
  await page.route('*/**/api/user/me', async (route) => {
    const meRes = {
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
      ],
      "iat": 1770663563
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: meRes });
  });

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
        "storeId": "1",
        "franchiseId": 1,
        "id": 166
      },
      "jwt": "eyJpYXQiOjE3NzA3NDYzMjcsImV4cCI6MTc3MDgzMjcyNywiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9TcF94VzhlM3kwNk1KS3ZIeW9sRFZMaXZXX2hnTWxhcFZSUVFQVndiY0UifQ.eyJ2ZW5kb3IiOnsiaWQiOiJtcm0yMDAzIiwibmFtZSI6Ik1heCBNaWxsZXIifSwiZGluZXIiOnsiaWQiOjMsIm5hbWUiOiJwaXp6YSBmcmFuY2hpc2VlIiwiZW1haWwiOiJmQGp3dC5jb20ifSwib3JkZXIiOnsiaXRlbXMiOlt7Im1lbnVJZCI6MSwiZGVzY3JpcHRpb24iOiJWZWdnaWUiLCJwcmljZSI6MC4wMDM4fSx7Im1lbnVJZCI6MiwiZGVzY3JpcHRpb24iOiJQZXBwZXJvbmkiLCJwcmljZSI6MC4wMDQyfSx7Im1lbnVJZCI6MywiZGVzY3JpcHRpb24iOiJNYXJnYXJpdGEiLCJwcmljZSI6MC4wMDQyfSx7Im1lbnVJZCI6NCwiZGVzY3JpcHRpb24iOiJDcnVzdHkiLCJwcmljZSI6MC4wMDI4fSx7Im1lbnVJZCI6NSwiZGVzY3JpcHRpb24iOiJDaGFycmVkIExlb3BhcmQiLCJwcmljZSI6MC4wMDk5fV0sInN0b3JlSWQiOiIxIiwiZnJhbmNoaXNlSWQiOjEsImlkIjoxNjZ9fQ.fJwoU0Qym-W43a-pkqg_JTGTB3p5G4HWAGb67hiaFP5ka3aRqoA-lzQXWtg-wmLvYjOq8gcugAEQ9T1iwF8Bo_IUtCV1xa5wb1Z8_vyCOU8JV4YCPWnRn1_Kt4CjJ261wzbX5dNcMYwdHHsgvwqA9K2pP--UlCPQqbPV-Tno2jgHyTjpmsk_mvBB4HawYUqYrqH8NpWmpXIKKnf8aBqMkwtib0Cel1nOhqsgAYOMmlmgcWX8xWKL1gVmdGhNC6nM3bptnebfR2cEdLrYh73-S6doQp2Q_0t_EYm6uLNCBoU361nj-TapgArBkwnJiRrNuF5PXf5ZSdjYz92f1Vpgw8xc_25PjWBSmIyas8S14f7haTtFFMWBYSzE1DXv7hG-eduvCH0I1y4UiiPDVAvqJ4z6KMIFk1F04MeDJ-vGKopHmwGSTpKIMk_QfqkXi1f6_4VNr3QYgRx3GW897QkxmAsWYg-CkAao5yMH7pW29OPjx83hz-V1BF0qPnctlIScRoAjEo6WCxZp0BrvzipmB1kTqC9SCbiDIAtQLEFKTMusu1P2DlH5T2eZ10wc0CVAPRDfcKZ2clZWw1-woFkursF5PVtAbGIogcyUHMIUq7x5xdDRugRCKU8rlNATmPbyYuWJsmqNROgmVw_VarAg0bRfSv02YjjM97E-r05yqr0"
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: orderRes });
  });

  await page.getByRole('button', { name: 'Checkout' }).click();
  
  await expect(page.getByText('So worth it')).toBeVisible();
  await expect(page.getByText('Send me that pizza right')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Pay now' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Pie' })).toBeVisible();
  await expect(page.getByRole('columnheader', { name: 'Price' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Veggie' })).toBeVisible();
  await expect(page.getByRole('cell', { name: '₿' }).first()).toBeVisible();
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

  await page.getByRole('button', { name: 'Order more' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
});

test('order many pizzas', async ({ page }) => {
  
  await page.goto('http://localhost:5173/');
  
  await mockFranchiseeLogin(page);
  
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
  await page.getByRole('button', { name: 'Login' }).click();

  await mockMenu(page);

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
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).first().click();
  await page.getByRole('link', { name: 'Image Description Margarita' }).first().click();
  await page.getByRole('link', { name: 'Image Description Crusty A' }).first().click();
  await page.getByRole('link', { name: 'Image Description Charred' }).first().click();
  await expect(page.getByText('Selected pizzas:')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();

  await page.unroute('*/**/api/user/me');
  await page.route('*/**/api/user/me', async (route) => {
    const meRes = {
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
      ],
      "iat": 1770663563
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: meRes });
  });

  await page.route('*/**/api/order', async (route) => {
    const orderRes = {
      "order": {
        "items": [
            {
                "menuId": 1,
                "description": "Veggie",
                "price": 0.0038
            },
            {
                "menuId": 2,
                "description": "Pepperoni",
                "price": 0.0042
            },
            {
                "menuId": 3,
                "description": "Margarita",
                "price": 0.0042
            },
            {
                "menuId": 4,
                "description": "Crusty",
                "price": 0.0028
            },
            {
                "menuId": 5,
                "description": "Charred Leopard",
                "price": 0.0099
            }
        ],
        "storeId": "1",
        "franchiseId": 1,
        "id": 166
      },
      "jwt": "eyJpYXQiOjE3NzA3NDYzMjcsImV4cCI6MTc3MDgzMjcyNywiaXNzIjoiY3MzMjkuY2xpY2siLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9TcF94VzhlM3kwNk1KS3ZIeW9sRFZMaXZXX2hnTWxhcFZSUVFQVndiY0UifQ.eyJ2ZW5kb3IiOnsiaWQiOiJtcm0yMDAzIiwibmFtZSI6Ik1heCBNaWxsZXIifSwiZGluZXIiOnsiaWQiOjMsIm5hbWUiOiJwaXp6YSBmcmFuY2hpc2VlIiwiZW1haWwiOiJmQGp3dC5jb20ifSwib3JkZXIiOnsiaXRlbXMiOlt7Im1lbnVJZCI6MSwiZGVzY3JpcHRpb24iOiJWZWdnaWUiLCJwcmljZSI6MC4wMDM4fSx7Im1lbnVJZCI6MiwiZGVzY3JpcHRpb24iOiJQZXBwZXJvbmkiLCJwcmljZSI6MC4wMDQyfSx7Im1lbnVJZCI6MywiZGVzY3JpcHRpb24iOiJNYXJnYXJpdGEiLCJwcmljZSI6MC4wMDQyfSx7Im1lbnVJZCI6NCwiZGVzY3JpcHRpb24iOiJDcnVzdHkiLCJwcmljZSI6MC4wMDI4fSx7Im1lbnVJZCI6NSwiZGVzY3JpcHRpb24iOiJDaGFycmVkIExlb3BhcmQiLCJwcmljZSI6MC4wMDk5fV0sInN0b3JlSWQiOiIxIiwiZnJhbmNoaXNlSWQiOjEsImlkIjoxNjZ9fQ.fJwoU0Qym-W43a-pkqg_JTGTB3p5G4HWAGb67hiaFP5ka3aRqoA-lzQXWtg-wmLvYjOq8gcugAEQ9T1iwF8Bo_IUtCV1xa5wb1Z8_vyCOU8JV4YCPWnRn1_Kt4CjJ261wzbX5dNcMYwdHHsgvwqA9K2pP--UlCPQqbPV-Tno2jgHyTjpmsk_mvBB4HawYUqYrqH8NpWmpXIKKnf8aBqMkwtib0Cel1nOhqsgAYOMmlmgcWX8xWKL1gVmdGhNC6nM3bptnebfR2cEdLrYh73-S6doQp2Q_0t_EYm6uLNCBoU361nj-TapgArBkwnJiRrNuF5PXf5ZSdjYz92f1Vpgw8xc_25PjWBSmIyas8S14f7haTtFFMWBYSzE1DXv7hG-eduvCH0I1y4UiiPDVAvqJ4z6KMIFk1F04MeDJ-vGKopHmwGSTpKIMk_QfqkXi1f6_4VNr3QYgRx3GW897QkxmAsWYg-CkAao5yMH7pW29OPjx83hz-V1BF0qPnctlIScRoAjEo6WCxZp0BrvzipmB1kTqC9SCbiDIAtQLEFKTMusu1P2DlH5T2eZ10wc0CVAPRDfcKZ2clZWw1-woFkursF5PVtAbGIogcyUHMIUq7x5xdDRugRCKU8rlNATmPbyYuWJsmqNROgmVw_VarAg0bRfSv02YjjM97E-r05yqr0"
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: orderRes });
  });

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
                },
                {
                    "menuId": 2,
                    "description": "Pepperoni",
                    "price": 0.0042
                },
                {
                    "menuId": 3,
                    "description": "Margarita",
                    "price": 0.0042
                },
                {
                    "menuId": 4,
                    "description": "Crusty",
                    "price": 0.0028
                },
                {
                    "menuId": 5,
                    "description": "Charred Leopard",
                    "price": 0.0099
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

  await page.getByRole('button', { name: 'Order more' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
});

test('cancel order button works', async ({ page }) => {
  
  await page.goto('http://localhost:5173/');
  
  await mockFranchiseeLogin(page);
  
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

  await mockMenu(page);

  await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
  await page.getByRole('link', { name: 'Order' }).click();

  await page.unroute('*/**/api/user/me');
  await page.route('*/**/api/user/me', async (route) => {
    const meRes = {
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
      ],
      "iat": 1770663563
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: meRes });
  });
  
  await page.getByRole('combobox').selectOption('1');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).first().click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.getByText('Send me that pizza right now!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByText('Awesome is a click away')).toBeVisible();
});