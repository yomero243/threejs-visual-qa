import { test, expect } from '@playwright/test';

test.describe('Visual Catalog QA', () => {

  const colors = ['red', 'green', 'blue'];

  for (const color of colors) {
    test(`Debe renderizar correctamente el color ${color}`, async ({ page }) => {
      console.log(`Verificando catálogo: ${color}`);


      await page.goto(`/?testing=true&color=${color}`);


      await page.waitForTimeout(3000);


      await expect(page).toHaveScreenshot(`daily-check-${color}.png`, {
        maxDiffPixelRatio: 0.05,
      });
    });
  }
});
