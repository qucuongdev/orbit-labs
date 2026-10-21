import { test,expect } from '@playwright/test';

test('global mission catalogue, replay, cameras and exclusive renderer switching',async({page},testInfo)=>{
  test.setTimeout(180000); // Includes two GIS contexts and legacy WebGL on SwiftShader.
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByLabel('Trái Đất 3D WGS84')).toBeVisible({timeout:30000});
  await expect(page.getByRole('button',{name:'KHỞI ĐỘNG CHUYẾN BAY',exact:true})).toBeEnabled();
  await expect(page.locator('.earth-scene canvas')).toHaveCount(1);
  await expect(page.locator('.cesium-widget-errorPanel')).toHaveCount(0);
  await page.getByLabel('Tốc độ mô phỏng').selectOption('0.25');
  await page.getByLabel('Tìm phương tiện').fill('Saturn');
  await page.locator('.vehicle-select').filter({hasText:'Saturn V'}).click();
  await expect(page.locator('.mission-right .panel-heading').filter({hasText:'Saturn V'})).toBeVisible();
  await page.getByLabel('Tìm phương tiện').fill('');
  await page.getByRole('button',{name:'So sánh Falcon 9',exact:true}).click();
  await page.getByRole('button',{name:'So sánh Saturn V',exact:true}).click();
  await page.getByRole('button',{name:/So sánh phương tiện/}).click();
  await expect(page.getByRole('dialog')).toContainText('111');
  await page.getByLabel('Đóng so sánh').click();
  await page.getByLabel('Timeline chuyến bay').fill('700.5');
  await expect(page.locator('.data-badge')).toHaveText('TÍNH TỪ MÔ HÌNH VẬT LÝ');
  await expect(page.locator('.mission-clock strong')).toHaveText('T+ 00:11:40');
  await expect(page.locator('.cesium-widget-errorPanel')).toHaveCount(0);
  await page.getByRole('button',{name:'Follow Rocket',exact:true}).click();
  await page.waitForTimeout(1200);
  await page.screenshot({path:testInfo.outputPath('orbit-follow.png')});
  await page.getByRole('button',{name:'Onboard View',exact:true}).click();
  await page.waitForTimeout(500);
  await page.getByRole('button',{name:'Free Camera',exact:true}).click();
  await page.getByLabel('Đặt lại chuyến bay').click();
  await page.getByRole('button',{name:'KHỞI ĐỘNG CHUYẾN BAY',exact:true}).click();
  await expect(page.getByRole('status',{name:'Đếm ngược toàn cầu'})).toBeVisible();
  await page.getByLabel('Đặt lại chuyến bay').click();
  await expect(page.getByRole('status',{name:'Đếm ngược toàn cầu'})).toHaveCount(0);
  await page.getByRole('button',{name:'Lưới 3D / Phòng thí nghiệm'}).click();
  await expect(page.getByRole('button',{name:'Phóng Tên Lửa',exact:true})).toBeVisible({timeout:30000});
  await expect(page.locator('.earth-scene')).toHaveCount(0);
  await page.getByRole('button',{name:'◉ Trái Đất 3D',exact:true}).click();
  await expect(page.getByLabel('Trái Đất 3D WGS84')).toBeVisible({timeout:30000});
  expect(errors).toEqual([]);
});

test('military mode remains conceptual and mobile panels fit viewport',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:390,height:844});
  await page.goto('/');
  await page.getByRole('button',{name:'Phương tiện',exact:true}).click();
  await page.getByLabel('Tìm phương tiện').fill('Minuteman');
  await page.locator('.vehicle-select').filter({hasText:'Minuteman III'}).click();
  await expect(page.getByRole('button',{name:'Vùng quan sát',exact:true})).toBeDisabled();
  await expect(page.getByText('Không chọn mục tiêu hoặc tính điểm rơi.',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Trái Đất',exact:true}).click();
  await page.getByLabel('Timeline chuyến bay').fill('200');
  await page.getByRole('button',{name:'Telemetry',exact:true}).click();
  await expect(page.locator('.data-badge')).toHaveText('MINH HỌA CHUYỂN ĐỘNG');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
