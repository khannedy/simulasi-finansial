import { defineConfig } from '@playwright/test';

export default defineConfig({
	retries: 3,
	workers: 1,
	// Tambahkan timeout yang lebih besar
	timeout: 30000, // 30 detik per test
	expect: {
		timeout: 10000 // 10 detik untuk assertions
	},
	webServer: {
		command: 'bun run dev',
		port: 5173,
		reuseExistingServer: !process.env.CI,
		// Tambahkan timeout untuk web server
		timeout: 120000, // 2 menit
	},
	testDir: 'e2e',
	use: {
		baseURL: 'http://localhost:5173',
		// Tambahkan action timeout
		actionTimeout: 10000,
		// Tambahkan navigation timeout
		navigationTimeout: 30000,
		// Screenshot on failure
		screenshot: 'only-on-failure',
		// Video on failure
		video: 'retain-on-failure',
		// Trace on failure
		trace: 'retain-on-failure'
	}
});
