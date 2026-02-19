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
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('t@jwt.com');
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('test');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
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

    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page.getByRole('textbox', { name: 'Email address' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('link', { name: 'Admin' })).toBeVisible();
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Role' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Filter users' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' }).nth(1)).toBeVisible();


});