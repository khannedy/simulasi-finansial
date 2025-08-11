import { defineConfig } from '@playwright/test';

export default defineConfig({
	retries: 3,
	webServer: {
		command: 'bun run dev',
		port: 5173,
		reuseExistingServer: !process.env.CI
	},
	testDir: 'e2e',
	use: {
		baseURL: 'http://localhost:5173'
	}
});
