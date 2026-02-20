import { test, expect } from 'playwright-test-coverage';

test('edit user button pops up and edits the users data', async ({ page }) => {

    await page.goto('http://localhost:5173/');

    await page.route('*/**/api/auth', async (route) => {
        const loginReq = { email: 't@jwt.com', password: 'test' };
        const loginRes = {
            user: {
            id: 10,
            name: 'test',
            email: 't@jwt.com',
            roles: [{ role: 'diner' }],
            },
            token: 'abcdef',
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginReq);
        await route.fulfill({ json: loginRes });
    });

    await page.route('*/**/api/order', async (route) => {
        const orderRes = {
            "dinerId": 10,
            "orders": [],
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: orderRes });
    });

    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('t@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('test');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByRole('link', { name: 't', exact: true })).toBeVisible();
    await page.getByRole('link', { name: 't', exact: true }).click();
    await expect(page.getByText('name:').first()).toBeVisible();
    await expect(page.getByText('test')).toBeVisible();
    await expect(page.getByText('email:').first()).toBeVisible();
    await expect(page.getByText('t@jwt.com')).toBeVisible();

    await page.route('*/**/api/user/10', async (route) => {
        const userReq = {"id":10,"name":"test edited","email":"t_edited@jwt.com","roles":[{"role":"diner"}]};
        const userRes = {
            "user": {
                "id": 10,
                "name": "test edited",
                "email": "t_edited@jwt.com",
                "roles": [
                    {
                        "role": "diner"
                    }
                ]
            },
        "token": "abcdef"
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(userReq);
        await route.fulfill({ json: userRes });
    });

    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.getByRole('heading', { name: 'Edit user' })).toBeVisible();
    await expect(page.getByRole('textbox').first()).toBeVisible();
    await page.getByRole('textbox').first().click();
    await page.getByRole('textbox').first().fill('test edited');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').fill('t_edited@jwt.com');
    await expect(page.getByRole('button', { name: 'Update' })).toBeVisible();
    await page.getByRole('button', { name: 'Update' }).click();
    await expect(page.getByRole('button', { name: 'Update' })).not.toBeVisible();

    await expect(page.getByText('name:').first()).toBeVisible();
    await expect(page.getByText('test edited')).toBeVisible();
    await expect(page.getByText('email:').first()).toBeVisible();
    await expect(page.getByText('t_edited@jwt.com')).toBeVisible();
    await expect(page.getByRole('link', { name: 'home' })).toBeVisible();
    await page.getByRole('link', { name: 'home' }).click();
    await expect(page.getByRole('link', { name: 'te' })).toBeVisible();
    await page.getByRole('link', { name: 'te' }).click();
    await expect(page.getByText('name:').first()).toBeVisible();
    await expect(page.getByText('test edited')).toBeVisible();
    await expect(page.getByText('email:').first()).toBeVisible();
    await expect(page.getByText('t_edited@jwt.com')).toBeVisible();
});

test('admin dashboard shows user table', async ({ page }) => {

    await page.goto('http://localhost:5173/');

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
          "token": "abcdef"
        };
        expect(route.request().method()).toBe('PUT');
        expect(route.request().postDataJSON()).toMatchObject(loginAReq);
        await route.fulfill({ json: loginARes });
    });
    
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
        const adminDashRes = {
            "franchises": [
                {
                    "id": 155,
                    "name": "Delete Store Franchise 0.5771646834308488",
                    "stores": []
                },
                {
                    "id": 156,
                    "name": "Get Franchise Test 0.14974382269585973",
                    "stores": [
                        {
                            "id": 135,
                            "name": "Store 1"
                        },
                        {
                            "id": 136,
                            "name": "Store 2"
                        }
                    ]
                },
                {
                    "id": 150,
                    "name": "Multi Admin Franchise 0.008701185151275936",
                    "stores": []
                }
            ],
            "more": true
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: adminDashRes });
    });

    await page.unroute('*/**/api/user?page=0&limit=3&name=*');
    await page.route('*/**/api/user?page=0&limit=3&name=*', async (route) => {
        const adminDashuserRes = {
            "users": [
                {
                    "id": 1,
                    "name": "常用名字",
                    "email": "a@jwt.com",
                    "roles": [
                        {
                            "role": "admin"
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "pizza diner",
                    "email": "d@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "pizza franchisee",
                    "email": "f@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        },
                        {
                            "role": "franchisee"
                        }
                    ]
                }
            ],
           "more": true
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: adminDashuserRes });
    });

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '常用名字' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'a@jwt.com' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'admin', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete User' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'pizza diner' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'd@jwt.com' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'diner', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete User' }).nth(1)).toBeVisible();
    await expect(page.getByRole('cell', { name: 'pizza franchisee' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'f@jwt.com' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'diner, franchisee' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete User' }).nth(2)).toBeVisible();

    await page.unroute('*/**/api/user?page=1&limit=3&name=*');
    await page.route('*/**/api/user?page=1&limit=3&name=*', async (route) => {
        const adminDashuserRes = {
            "users": [
                {
                    "id": 4,
                    "name": "pizza diner",
                    "email": "d@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "pizza diner",
                    "email": "d@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        }
                    ]
                },
                {
                    "id": 6,
                    "name": "pizza franchisee",
                    "email": "f@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        }
                    ]
                }
            ],
            "more": true
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: adminDashuserRes });
    });

    await expect(page.getByRole('button', { name: '»' }).nth(1)).toBeVisible();
    await page.getByRole('button', { name: '»' }).nth(1).click();
    await expect(page.getByRole('cell', { name: 'pizza diner' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'd@jwt.com' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'diner' }).nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete User' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'pizza franchisee' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'f@jwt.com' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'diner' }).nth(4)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete User' }).nth(2)).toBeVisible();

    await page.unroute('*/**/api/user?page=0&limit=3&name=*');
    await page.route('*/**/api/user?page=0&limit=3&name=*', async (route) => {
        const adminDashuserRes = {
            "users": [
                {
                    "id": 1,
                    "name": "常用名字",
                    "email": "a@jwt.com",
                    "roles": [
                        {
                            "role": "admin"
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "pizza diner",
                    "email": "d@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "pizza franchisee",
                    "email": "f@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        },
                        {
                            "role": "franchisee"
                        }
                    ]
                }
            ],
           "more": true
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: adminDashuserRes });
    });

    await expect(page.getByRole('button', { name: '«' }).nth(1)).toBeVisible();
    await page.getByRole('button', { name: '«' }).nth(1).click();

    await page.route('*/**/api/user?page=0&limit=10&name=*diner*', async (route) => {
        const adminDashuserRes = {
            "users": [
                {
                    "id": 2,
                    "name": "pizza diner",
                    "email": "d@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        }
                    ]
                },
                {
                    "id": 4,
                    "name": "pizza diner",
                    "email": "d@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        }
                    ]
                },
                {
                    "id": 5,
                    "name": "pizza diner",
                    "email": "d@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        }
                    ]
                }
            ],
           "more": true
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: adminDashuserRes });
    });

    await page.getByRole('textbox', { name: 'Filter users' }).click();
    await page.getByRole('textbox', { name: 'Filter users' }).fill('diner');
    await page.getByRole('button', { name: 'Submit' }).nth(1).click();
    await expect(page.getByRole('cell', { name: 'pizza diner' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'd@jwt.com' }).first()).toBeVisible();
    await expect(page.getByRole('cell', { name: 'diner' }).nth(1)).toBeVisible();
    await expect(page.getByRole('cell', { name: '常用名字' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'a@jwt.com' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'admin', exact: true })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'pizza franchisee' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'f@jwt.com' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'diner, franchisee' })).not.toBeVisible();

    await page.route('*/**/api/user?page=0&limit=10&name=*aaaaaaaaaa*', async (route) => {
        const adminDashuserRes = {
            "users": [],
           "more": false
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: adminDashuserRes });
    });

    await page.getByRole('textbox', { name: 'Filter users' }).click();
    await page.getByRole('textbox', { name: 'Filter users' }).fill('aaaaaaaaaa');
    await page.getByRole('button', { name: 'Submit' }).nth(1).click();
    await expect(page.getByRole('cell', { name: '常用名字' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'a@jwt.com' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'admin', exact: true })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete User' }).first()).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'pizza diner' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'd@jwt.com' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'diner', exact: true })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete User' }).nth(1)).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'pizza franchisee' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'f@jwt.com' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'diner, franchisee' })).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete User' }).nth(2)).not.toBeVisible();
});

test('admin dashboard delete user', async ({ page }) => {

    await page.goto('http://localhost:5173/');

    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
        const adminDashRes = {
            "franchises": [
                {
                    "id": 155,
                    "name": "Delete Store Franchise 0.5771646834308488",
                    "stores": []
                },
                {
                    "id": 156,
                    "name": "Get Franchise Test 0.14974382269585973",
                    "stores": [
                        {
                            "id": 135,
                            "name": "Store 1"
                        },
                        {
                            "id": 136,
                            "name": "Store 2"
                        }
                    ]
                },
                {
                    "id": 150,
                    "name": "Multi Admin Franchise 0.008701185151275936",
                    "stores": []
                }
            ],
            "more": true
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: adminDashRes });
    });

    await page.route('*/**/api/user?page=0&limit=3&name=*', async (route) => {
        const adminDashuserRes = {
            "users": [
                {
                    "id": 1,
                    "name": "常用名字",
                    "email": "a@jwt.com",
                    "roles": [
                        {
                            "role": "admin"
                        }
                    ]
                },
                {
                    "id": 2,
                    "name": "pizza diner",
                    "email": "d@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "pizza franchisee",
                    "email": "f@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        },
                        {
                            "role": "franchisee"
                        }
                    ]
                }
            ],
           "more": true
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: adminDashuserRes });
    });

    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'pizza diner' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'd@jwt.com' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'diner', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete User' }).nth(1)).toBeVisible();
    
    await page.route('*/**/api/user?page=0&limit=3&name=*', async (route) => {
        const adminDashuserRes = {
            "users": [
                {
                    "id": 1,
                    "name": "常用名字",
                    "email": "a@jwt.com",
                    "roles": [
                        {
                            "role": "admin"
                        }
                    ]
                },
                {
                    "id": 3,
                    "name": "pizza franchisee",
                    "email": "f@jwt.com",
                    "roles": [
                        {
                            "role": "diner"
                        },
                        {
                            "role": "franchisee"
                        }
                    ]
                }
            ],
           "more": true
        };
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: adminDashuserRes });
    });
    await page.route('*/**/api/user/2', async (route) => {
        const adminDashuserRes = { message: 'user deleted' };
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ json: adminDashuserRes });
    });

    await page.getByRole('button', { name: 'Delete User' }).nth(1).click();
    await expect(page.getByText('Delete user', { exact: true })).toBeVisible();
    await expect(page.getByText('Are you sure you want to')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('cell', { name: 'pizza diner' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'd@jwt.com' })).not.toBeVisible();
    await expect(page.getByRole('cell', { name: 'diner', exact: true })).not.toBeVisible();
});