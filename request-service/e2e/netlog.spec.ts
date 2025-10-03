import { test } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
const routes = ['', 'pages/stepper.html']; // adicione mais se quiser

function urlFor(path: string) {
  const b = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';
  return b + path;
}

test('network + console log', async ({ page }) => {
  // Log de respostas 4xx/5xx
  page.on('response', (res) => {
    const s = res.status();
    if (s >= 400) console.log(`[HTTP ${s}] ${res.url()}`);
  });

  // Erros de JS da página
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log(`[CONSOLE ERROR] ${msg.text()}`);
  });
  page.on('pageerror', (err) => {
    console.log(`[PAGE ERROR] ${err.message}`);
  });

  for (const path of routes) {
    const url = urlFor(path);
    console.log(`\n=== Visiting ${url}`);
    await page.goto(url, { waitUntil: 'networkidle' });
    // garante que fontes/JS assíncronos terminem
    await page.evaluate(async () => {
      // fonts.ready pode não estar tipado no lib DOM atual
      const d = document as Document & { fonts?: { ready?: Promise<void> } };
      if (d.fonts?.ready) await d.fonts.ready;
    });
    await page.waitForTimeout(400);
  }
});
