import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:5193' },
  webServer: {
    command: 'npm run start -- --hostname 127.0.0.1 --port 5193',
    url: 'http://127.0.0.1:5193',
    reuseExistingServer: false,
  },
});
