import { test, expect } from '@playwright/test';

test.describe('Visual Catalog QA', () => {

  const colors = ['red', 'green', 'blue'];

  for (const color of colors) {
    test(`Debe renderizar correctamente el color ${color}`, async ({ page }) => {
      console.log(`🎨 Verificando catálogo: ${color}`);

      // 1. Forzamos el color específico en la URL
      await page.goto(`/?testing=true&color=${color}`);

      // 2. Esperamos carga de fuentes y geometría 3D
      await page.waitForTimeout(3000); 

      // 3. Snapshot específico para este color
      // Se generarán: daily-check-red.png, daily-check-green.png, daily-check-blue.png
      await expect(page).toHaveScreenshot(`daily-check-${color}.png`, {
        maxDiffPixels: 100
      });
    });
  }
});
