import { test, expect } from '@playwright/test';

// Ajustado para apontar ao servidor local atual (python -m http.server 8000)
const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:8000';

function withDevParam(u: string): string {
  try {
    const url = new URL(u);
    url.searchParams.set('dev', '1');
    return url.toString();
  } catch {
    if (u.includes('?')) return u + '&dev=1';
    return (u.endsWith('/') ? u : u + '/') + '?dev=1';
  }
}

test('fluxo básico do wizard', async ({ page }) => {
  await page.goto(withDevParam(BASE_URL));
  // Garante que nenhum overlay residual bloqueie o clique inicial
  await page.evaluate(() => {
    const overlay = document.getElementById('wizard-modal-overlay') as HTMLElement | null;
    if (overlay) {
      overlay.style.display = 'none';
      overlay.style.visibility = 'hidden';
      overlay.style.opacity = '0';
      overlay.setAttribute('aria-hidden', 'true');
    }
  });
  await page.getByRole('button', { name: /abrir wizard/i }).click();

  const header = page.getByTestId('wizard-header');
  await expect(header).toContainText('Etapa 1 de 6');
  const headerText = await header.textContent();
  expect((headerText || '').match(/Etapa 1 de 6/g)?.length ?? 0).toBe(1);

  await page.getByRole('button', { name: /avançar/i }).click();
  await expect(header).toContainText('Etapa 2 de 6');

  await page.getByRole('button', { name: /cancelar/i }).click();
  await expect(page.getByTestId('wizard-overlay')).toBeHidden();
});
