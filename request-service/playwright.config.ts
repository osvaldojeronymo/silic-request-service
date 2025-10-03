import { defineConfig, devices } from '@playwright/test';

// Derive desired server/base URLs from env to support both 5173 (Vite) and 8000 (python http.server)
const envBase = process.env.E2E_BASE_URL || process.env.BASE_URL;
const wantsVite =
  (!!envBase && /:\\s*5173\/?$|5173\/$/.test(envBase)) ||
  envBase === 'http://localhost:5173' ||
  envBase === 'http://localhost:5173/';
const port = wantsVite ? 5173 : 8000;

export default defineConfig({
  testDir: './e2e',
  reporter: 'line',
  use: {
    // Use E2E_BASE_URL when provided, else align with selected webServer port
    baseURL: process.env.E2E_BASE_URL || `http://localhost:${port}`,
    trace: 'on-first-retry',
  },
  webServer: {
    command: wantsVite ? 'npx vite --port 5173 --strictPort' : 'python3 -m http.server 8000',
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
