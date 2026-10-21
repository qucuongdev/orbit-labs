import { test, expect } from '@playwright/test';

test('countdown can be cancelled; POV, cutaway and three stages survive switching to the map', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.stack || error.message));
  page.on('console', message => { if (message.type() === 'error' && /THREE|shader|WebGL/i.test(message.text())) errors.push(message.text()); });
  await page.goto('/?mode=lab');
  await page.getByRole('combobox', { name: 'Số tầng động cơ' }).selectOption('3');
  // A short, higher-power fixture reaches both separation events quickly.
  await page.getByRole('spinbutton', { name: 'Tầng 1 Lực đẩy (N)' }).fill('2800');
  await page.getByRole('spinbutton', { name: 'Tầng 1 Thời gian cháy (s)' }).fill('7');
  await expect(page.getByRole('spinbutton', { name: 'Tầng 3 Lực đẩy (N)' })).toHaveValue('228');
  await page.getByRole('button', { name: 'Xem bên trong' }).click();
  await expect(page.getByText('Tải trọng', { exact: true })).toBeVisible();
  await page.locator('main').screenshot({ path: testInfo.outputPath('cutaway.png') });
  await page.getByRole('combobox', { name: 'Chế độ camera' }).selectOption('pov');
  await page.getByRole('button', { name: 'Phóng Tên Lửa', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Đếm ngược phóng' })).toContainText('3');
  await page.getByRole('button', { name: 'Đặt Lại', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Đếm ngược phóng' })).toHaveCount(0);
  await page.waitForTimeout(3200);
  await expect(page.getByRole('button', { name: 'Phóng Tên Lửa', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Phóng Tên Lửa', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Đếm ngược phóng' }).locator('strong')).toHaveText('3');
  await expect(page.getByRole('status', { name: 'Đếm ngược phóng' }).locator('strong')).toHaveText('2');
  await expect(page.getByRole('status', { name: 'Đếm ngược phóng' }).locator('strong')).toHaveText('1');
  await expect(page.getByRole('button', { name: 'Tạm Dừng', exact: true })).toBeVisible();
  await page.locator('main').screenshot({ path: testInfo.outputPath('pov.png') });
  await page.getByRole('button', { name: '8x', exact: true }).click();
  await page.getByRole('button', { name: 'Thực tế · Bản đồ', exact: true }).click();
  await expect(page.getByLabel('Bản đồ chuyến bay')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Lấy thời tiết', exact: true })).toBeDisabled();
  const time = page.getByText(/T\+ \d/);
  const before = await time.textContent();
  await page.waitForTimeout(1800);
  expect(await time.textContent()).not.toBe(before);
  await page.getByRole('button', { name: 'Khung lưới 3D', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Chế độ camera' })).toHaveValue('pov');
  await expect(page.getByText('Tách tầng 1', { exact: false })).toBeVisible();
  await page.getByRole('combobox', { name: 'Chế độ camera' }).selectOption('follow');
  await page.getByRole('button', { name: 'Tạm Dừng', exact: true }).click();
  await page.locator('main').screenshot({ path: testInfo.outputPath('separated.png') });
  await page.getByRole('button', { name: 'Đặt Lại', exact: true }).click();
  expect(errors).toEqual([]);
});

test('map accepts coordinates, applies weather, and handles network failure', async ({ page }, testInfo) => {
  let fail = false;
  await page.route('https://api.open-meteo.com/**', route => fail ? route.abort() : route.fulfill({
    contentType: 'application/json', body: JSON.stringify({ timezone: 'Asia/Ho_Chi_Minh', elevation: 6,
      current: { temperature_2m: 30, surface_pressure: 1005, wind_speed_10m: 4, wind_direction_10m: 90, time: '2026-10-21T15:00' } }),
  }));
  await page.goto('/?mode=lab');
  await page.getByRole('button', { name: 'Thực tế · Bản đồ', exact: true }).click();
  await page.getByLabel('Vĩ độ bệ phóng').fill('10.8');
  await page.getByLabel('Kinh độ bệ phóng').fill('106.6');
  await page.getByRole('button', { name: 'Đặt bệ phóng', exact: true }).click();
  await page.getByRole('button', { name: 'Lấy thời tiết', exact: true }).click();
  await expect(page.getByText(/30 °C · 1005 hPa/)).toBeVisible();
  await expect(page.getByRole('slider', { name: 'Gió ngang', exact: true })).toHaveValue('-4');
  await page.locator('main').screenshot({ path: testInfo.outputPath('map.png') });
  fail = true;
  await page.getByRole('button', { name: 'Lấy thời tiết', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await page.getByRole('button', { name: 'Khung lưới 3D', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Chế độ camera' })).toBeVisible();
});
