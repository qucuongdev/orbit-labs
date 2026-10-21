import { test, expect } from '@playwright/test';

test('countdown leaves the rocket visible and thrust builds on the pad before lift-off', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/?mode=lab');
  await page.getByRole('button', { name: '0.5x', exact: true }).click();
  await page.getByRole('button', { name: 'Phóng Tên Lửa', exact: true }).click();
  const countdown = page.getByRole('status', { name: 'Đếm ngược phóng' });
  await expect(countdown).toBeVisible();
  const badge = await countdown.boundingBox(), scene = await page.locator('main').boundingBox();
  expect(badge.width * badge.height).toBeLessThan(scene.width * scene.height * 0.15);
  await expect(countdown).toHaveCSS('backdrop-filter', 'none');
  await page.locator('main').screenshot({ path: testInfo.outputPath('countdown-visible.png') });
  await expect(page.getByText('KHỞI ĐỘNG · GIỮ TRÊN BỆ', { exact: true })).toBeVisible();
  const throttle = page.getByText('Mức lực đẩy', { exact: true }).locator('..').locator('strong');
  await expect.poll(async () => parseFloat(await throttle.textContent())).toBeGreaterThan(20);
  expect(parseFloat(await throttle.textContent())).toBeLessThan(100);
  await expect(page.getByText('Độ Cao (Altitude)', { exact: true }).locator('..')).toContainText('0 m');
  await expect(page.getByText('Vận Tốc (Speed)', { exact: true }).locator('..')).toContainText('0 m/s');
  await page.locator('main').screenshot({ path: testInfo.outputPath('ignition-on-pad.png') });
  await expect(page.getByText('ĐỐT ĐỘNG CƠ (BOOST)', { exact: false })).toBeVisible({ timeout: 20000 });
  await expect.poll(async () => parseFloat((await page.getByText(/T\+ \d/).textContent()).replace('T+ ', '')), { timeout: 15000 }).toBeGreaterThan(2.8);
  const velocity = await page.getByText('Vận Tốc (Speed)', { exact: true }).locator('..').textContent();
  expect(parseFloat(velocity.match(/([\d.]+) m\/s/)[1])).toBeLessThan(10);
  await page.locator('main').screenshot({ path: testInfo.outputPath('gradual-liftoff.png') });
  expect(errors).toEqual([]);
});

test('desktop CSS renders three columns with a usable 3D viewport', async ({ page }, testInfo) => {
  await page.goto('/?mode=lab');
  const root = page.locator('#root > div');
  await expect(root).toHaveCSS('display', 'flex');
  await expect(root).toHaveCSS('flex-direction', 'column');
  const main = page.locator('main');
  await expect(main).toHaveCSS('position', 'relative');
  const left = await page.locator('aside').first().boundingBox();
  const center = await main.boundingBox();
  const right = await page.locator('aside').last().boundingBox();
  expect(left.width).toBe(300);
  expect(right.width).toBe(370);
  expect(center.width).toBeGreaterThan(400);
  expect(center.height).toBeGreaterThan(400);
  expect(center.x).toBeGreaterThanOrEqual(left.x + left.width);
  expect(right.x).toBeGreaterThanOrEqual(center.x + center.width - 1);
  await page.screenshot({ path: testInfo.outputPath('desktop.png') });
});

test('launch, pause, complete once, close report, replay and reset', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error' && /THREE|shader|WebGL/i.test(message.text())) errors.push(message.text());
  });
  await page.goto('/?mode=lab');
  await page.getByRole('button', { name: 'Phóng Tên Lửa', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Tạm Dừng', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '8x', exact: true }).click();
  await expect(page.getByText('ĐANG PHUN', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Tạm Dừng', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Tiếp Tục', exact: true })).toBeVisible();
  await page.waitForTimeout(150);
  const clock = page.getByText(/T\+ \d/);
  const pausedTime = await clock.textContent();
  await page.waitForTimeout(300);
  expect(await clock.textContent()).toBe(pausedTime);
  await page.getByRole('button', { name: 'Tiếp Tục', exact: true }).click();
  for (const chute of ['Dù con đang mở', 'Dù chính đang mở']) {
    await expect(page.getByText(chute, { exact: false })).toBeVisible({ timeout: 65000 });
    await page.waitForTimeout(350);
    await page.getByRole('button', { name: 'Tạm Dừng', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Tiếp Tục', exact: true })).toBeVisible();
    const tilt = await page.getByText('Nghiêng thân', { exact: true }).locator('..').locator('strong').textContent();
    expect(parseFloat(tilt)).toBeLessThan(15);
    await page.locator('main').screenshot({ path: testInfo.outputPath(chute.startsWith('Dù con') ? 'drogue.png' : 'main-chute.png') });
    await page.getByRole('button', { name: 'Tiếp Tục', exact: true }).click();
  }
  await expect(page.getByRole('dialog')).toBeVisible({ timeout: 75000 });
  await page.getByRole('button', { name: 'Đóng & Phân Tích', exact: false }).click();
  await page.waitForTimeout(500);
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByText('ĐÃ TIẾP ĐẤT', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Phóng Tên Lửa', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Tạm Dừng', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Đặt Lại', exact: true }).click();
  await expect(page.getByText('SẴN SÀNG TRÊN BỆ', { exact: true })).toBeVisible();
  expect(errors).toEqual([]);
});

test('mobile panels fit viewport and expose telemetry and plume legend', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?mode=lab');
  await expect(page.locator('#root > div')).toHaveCSS('display', 'flex');
  await expect(page.locator('aside').first()).toBeHidden();
  await expect(page.locator('main')).toBeVisible();
  await page.getByRole('button', { name: 'Chỉ số & đồ thị', exact: true }).click();
  await expect(page.getByText('Tốc độ & tải khí động', { exact: true })).toBeVisible();
  await expect(page.getByText('Lõi trắng xanh', { exact: true })).toBeVisible();
  await expect(page.locator('main')).toBeHidden();
  await page.screenshot({ path: testInfo.outputPath('mobile.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('button', { name: 'Thiết kế', exact: true }).click();
  await expect(page.getByText('Bảng Thiết Kế & Chế Tạo', { exact: true })).toBeVisible();
});
