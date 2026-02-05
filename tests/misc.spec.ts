import { test, expect } from 'playwright-test-coverage';

test('home page test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  await expect(page.getByRole('navigation', { name: 'Global' }).getByRole('img')).toBeVisible();
  await expect(page.getByText('JWT Pizza', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Order' })).toBeVisible();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
  await expect(page.locator('.w-screen')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Order now' })).toBeVisible();
  await expect(page.getByText('Pizza is an absolute delight')).toBeVisible();
  await expect(page.getByText('Pizza has come a long way')).toBeVisible();
  await expect(page.getByText('Pizza is not just a food; it\'')).toBeVisible();
  await expect(page.getByText('Pizza is a universal language')).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
});

test('about page test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  
  await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByText('The secret sauce')).toBeVisible();
  await expect(page.getByText('At JWT Pizza, our amazing')).toBeVisible();
  await expect(page.getByText('Our talented employees at JWT')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Our employees' })).toBeVisible();
  await expect(page.getByText('JWT Pizza is home to a team')).toBeVisible();
  await expect(page.getByText('JWT Pizza is home to a team')).toBeVisible();
  await expect(page.getByRole('img', { name: 'Employee stock photo' }).first()).toBeVisible();
  await expect(page.getByRole('img', { name: 'Employee stock photo' }).nth(1)).toBeVisible();
  await expect(page.getByRole('img', { name: 'Employee stock photo' }).nth(2)).toBeVisible();
  await expect(page.getByRole('img', { name: 'Employee stock photo' }).nth(3)).toBeVisible();
  await expect(page.getByRole('img').nth(3)).toBeVisible();
  await expect(page.getByText('At JWT Pizza, our employees')).toBeVisible();
  await page.getByRole('link', { name: 'About', exact: true }).click();
  await page.getByRole('link', { name: 'home' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
});

test('history page test', async ({ page }) => {
  await page.goto('http://localhost:5173/');
  
  
  await expect(page.getByRole('link', { name: 'History' })).toBeVisible();
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByText('Mama Rucci, my my')).toBeVisible();
  await expect(page.getByText('It all started in Mama Ricci\'')).toBeVisible();
  await expect(page.getByRole('main').getByRole('img')).toBeVisible();
  await expect(page.getByText('Pizza has a long and rich')).toBeVisible();
  await expect(page.getByText('However, it was the Romans')).toBeVisible();
  await expect(page.getByText('Fast forward to the 18th')).toBeVisible();
  await expect(page.getByText('It gained popularity in')).toBeVisible();
  await expect(page.getByRole('link', { name: 'home' })).toBeVisible();
  await page.getByRole('link', { name: 'home' }).click();
  await expect(page.getByText('The web\'s best pizza', { exact: true })).toBeVisible();
});
