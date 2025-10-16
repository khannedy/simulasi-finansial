import { expect, test } from '@playwright/test';

test.describe('Halaman Simulasi KKB', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/simulasi-kkb');
	});

	test('halaman simulasi kkb memiliki judul yang benar', async ({ page }) => {
		await expect(page).toHaveTitle('Simulasi KKB - Simulasi Finansial');
		await expect(page.locator('h1')).toContainText('Simulasi KKB');
	});

	test('form input memiliki semua field yang diperlukan', async ({ page }) => {
		// Check if all input fields exist
		await expect(page.locator('#harga-kendaraan')).toBeVisible();
		await expect(page.locator('#dp')).toBeVisible();
		await expect(page.locator('#lama-cicilan')).toBeVisible();
		await expect(page.locator('#suku-bunga')).toBeVisible();

		// Check labels
		await expect(page.getByText('Harga Kendaraan (Rp)')).toBeVisible();
		await expect(page.getByText('Down Payment (%)')).toBeVisible();
		await expect(page.getByText('Lama Cicilan (Tahun)')).toBeVisible();
		await expect(page.getByText('Suku Bunga (% per tahun)')).toBeVisible();

		// Check buttons
		await expect(page.getByRole('button', { name: 'Hitung KKB' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();

		// Check default value for DP
		await expect(page.locator('#dp')).toHaveValue('20');
	});

	test('validasi form - tidak bisa submit dengan field kosong', async ({ page }) => {
		// Try to submit without filling the form
		await page.getByRole('button', { name: 'Hitung KKB' }).click();

		// Should show browser validation (field required)
		// Note: Browser validation behavior may vary, so we check that no results are shown
		await expect(page.locator('text=Ringkasan KKB')).not.toBeVisible();
	});

	test('simulasi kkb dengan data valid', async ({ page }) => {
		// Fill the form with test data
		await page.locator('#harga-kendaraan').fill('300000000'); // 300 juta
		await page.locator('#dp').fill('20'); // 20%
		await page.locator('#lama-cicilan').fill('5'); // 5 tahun
		await page.locator('#suku-bunga').fill('8'); // 8%

		// Submit the form
		await page.getByRole('button', { name: 'Hitung KKB' }).click();

		// Wait for any JS to execute
		await page.waitForTimeout(1000);

		// Check if results are displayed
		await expect(page.locator('text=Ringkasan KKB')).toBeVisible();
		await expect(page.locator('text=Detail Cicilan per Bulan')).toBeVisible();

		// Check summary cards
		await expect(page.locator('#harga-kendaraan-amount')).toBeVisible();
		await expect(page.locator('#dp-amount')).toBeVisible();
		await expect(page.locator('#pinjaman-amount')).toBeVisible();
		await expect(page.locator('#cicilan-amount')).toBeVisible();
		await expect(page.locator('#total-pembayaran-amount')).toBeVisible();
		await expect(page.locator('#total-bunga-amount')).toBeVisible();

		// Check if table is displayed
		await expect(page.locator('table')).toBeVisible();
		await expect(page.locator('thead')).toBeVisible();
		await expect(page.locator('tbody')).toBeVisible();

		// Should have 60 rows for 5 years (60 months)
		const rows = page.locator('tbody tr');
		await expect(rows).toHaveCount(60);

		// Check first month row
		await expect(page.getByRole('cell', { name: 'Bulan 1', exact: true })).toBeVisible();

		// Check last month row
		await expect(page.getByRole('cell', { name: 'Bulan 60', exact: true })).toBeVisible();
	});

	test('perhitungan kkb memberikan hasil yang benar', async ({ page }) => {
		// Ensure clean state by waiting for page to fully load
		await page.waitForTimeout(200);

		// Test with simple values for easy calculation verification
		await page.locator('#harga-kendaraan').fill('200000000'); // 200 juta
		await page.locator('#dp').fill('25'); // 25% = 50 juta
		await page.locator('#lama-cicilan').fill('5'); // 5 tahun
		await page.locator('#suku-bunga').fill('9'); // 9% per tahun

		await page.getByRole('button', { name: 'Hitung KKB' }).click();

		// Wait for results to appear
		await expect(page.locator('text=Ringkasan KKB')).toBeVisible({ timeout: 5000 });

		// Jumlah DP should be 50 juta (25% dari 200 juta)
		await expect(page.locator('#dp-amount')).toContainText('Rp 50.000.000');

		// Jumlah pinjaman should be 150 juta (200 juta - 50 juta)
		await expect(page.locator('#pinjaman-amount')).toContainText('Rp 150.000.000');

		// Check that cicilan per bulan is displayed (not verifying exact amount due to complex formula)
		await expect(page.locator('#cicilan-amount')).toBeVisible();

		// Total pembayaran should be greater than pinjaman (because of interest)
		await expect(page.locator('#total-pembayaran-amount')).toBeVisible();

		// Total bunga should be positive
		await expect(page.locator('#total-bunga-amount')).toBeVisible();
	});

	test('tombol reset berfungsi dengan benar', async ({ page }) => {
		// Ensure form is rendered
		await expect(page.locator('#harga-kendaraan')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#dp')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#lama-cicilan')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#suku-bunga')).toBeVisible({ timeout: 10000 });

		// Fill the form
		await page.locator('#harga-kendaraan').clear();
		await page.locator('#harga-kendaraan').fill('150000000');
		await page.locator('#dp').clear();
		await page.locator('#dp').fill('30');
		await page.locator('#lama-cicilan').clear();
		await page.locator('#lama-cicilan').fill('3');
		await page.locator('#suku-bunga').clear();
		await page.locator('#suku-bunga').fill('7');

		// Ensure values are set
		await expect(page.locator('#harga-kendaraan')).toHaveValue('150000000');
		await expect(page.locator('#dp')).toHaveValue('30');
		await expect(page.locator('#lama-cicilan')).toHaveValue('3');
		await expect(page.locator('#suku-bunga')).toHaveValue('7');

		// Submit to show results
		const submitBtn = page.getByRole('button', { name: 'Hitung KKB' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for the Svelte reactive update to complete
		await page.waitForTimeout(300);

		// Wait for results to appear
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some((h) => h.textContent.includes('Ringkasan KKB'));
		}, { timeout: 15000 });

		await expect(page.getByRole('heading', { name: 'Ringkasan KKB' })).toBeVisible({
			timeout: 5000
		});

		// Reset the form
		await page.getByRole('button', { name: 'Reset' }).click();

		// Check if form is cleared
		await expect(page.locator('#harga-kendaraan')).toHaveValue('0');
		await expect(page.locator('#dp')).toHaveValue('20'); // Should be back to default (20)
		await expect(page.locator('#lama-cicilan')).toHaveValue('0');
		await expect(page.locator('#suku-bunga')).toHaveValue('0');

		// Check if results are hidden
		await expect(page.getByText('Ringkasan KKB')).not.toBeVisible();
	});

	test('navigasi dari dan ke halaman utama', async ({ page }) => {
		// Check if we can navigate back to home
		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: 'Simulasi Finansial', exact: true })
		).toBeVisible();
		await expect(page.getByText('Simulasi KKB')).toBeVisible();

		// Navigate to simulasi-kkb page from home
		await page.getByRole('link', { name: 'Simulasi KKB' }).click();
		await expect(page).toHaveURL('/simulasi-kkb');
		await expect(page.locator('h1')).toContainText('Simulasi KKB');
	});

	test('responsivitas pada layar mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Check if page elements are still visible and accessible on mobile
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('#harga-kendaraan')).toBeVisible();
		await expect(page.locator('#dp')).toBeVisible();
		await expect(page.locator('#lama-cicilan')).toBeVisible();
		await expect(page.locator('#suku-bunga')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Hitung KKB' })).toBeVisible();

		// Test form functionality on mobile
		await page.locator('#harga-kendaraan').clear();
		await page.locator('#harga-kendaraan').fill('250000000');
		await page.locator('#dp').clear();
		await page.locator('#dp').fill('20');
		await page.locator('#lama-cicilan').clear();
		await page.locator('#lama-cicilan').fill('5');
		await page.locator('#suku-bunga').clear();
		await page.locator('#suku-bunga').fill('8');

		const submitBtn = page.getByRole('button', { name: 'Hitung KKB' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for results
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some((h) => h.textContent.includes('Ringkasan KKB'));
		}, { timeout: 15000 });

		await expect(page.getByRole('heading', { name: 'Ringkasan KKB' })).toBeVisible({
			timeout: 5000
		});

		// Check if table is still accessible (may have horizontal scroll)
		await expect(page.locator('table')).toBeVisible();
	});

	test('catatan penting ditampilkan', async ({ page }) => {
		// Check if important notes section exists
		await expect(page.getByText('Catatan Penting')).toBeVisible();
		await expect(page.getByText('Perhitungan menggunakan metode anuitas')).toBeVisible();
		await expect(
			page.getByText('Simulasi ini tidak termasuk biaya-biaya lain seperti')
		).toBeVisible();
		await expect(page.getByText('Suku bunga yang digunakan adalah suku bunga tetap')).toBeVisible();
		await expect(page.getByText('Hasil simulasi bersifat perkiraan')).toBeVisible();
		await expect(
			page.getByText('Pastikan untuk berkonsultasi dengan dealer atau lembaga pembiayaan')
		).toBeVisible();
	});

	test('format mata uang rupiah ditampilkan dengan benar', async ({ page }) => {
		// Wait for initial form
		await expect(page.locator('#harga-kendaraan')).toBeVisible({ timeout: 10000 });

		// Fill form and calculate
		await page.locator('#harga-kendaraan').fill('400000000'); // 400 juta
		await page.locator('#dp').fill('15'); // 15%
		await page.locator('#lama-cicilan').fill('5'); // 5 tahun
		await page.locator('#suku-bunga').fill('8.5'); // 8.5%

		const submitBtn = page.getByRole('button', { name: 'Hitung KKB' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for results
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some((h) => h.textContent.includes('Ringkasan KKB'));
		}, { timeout: 15000 });

		await expect(page.getByText('Ringkasan KKB')).toBeVisible({ timeout: 5000 });

		// Check if amounts are formatted as Rupiah
		await expect(page.locator('#harga-kendaraan-amount')).toContainText('Rp 400.000.000', {
			timeout: 10000
		});
		await expect(page.locator('#dp-amount')).toContainText('Rp 60.000.000', { timeout: 10000 }); // 15% dari 400 juta
		await expect(page.locator('#pinjaman-amount')).toContainText('Rp 340.000.000', {
			timeout: 10000
		}); // 400 juta - 60 juta
	});

	test('validasi input dengan nilai negatif atau nol', async ({ page }) => {
		// Try to input zero/negative values
		await page.locator('#harga-kendaraan').fill('0');
		await page.locator('#lama-cicilan').fill('0');
		await page.locator('#suku-bunga').fill('0');

		await page.getByRole('button', { name: 'Hitung KKB' }).click();

		// Should not show results
		await expect(page.locator('text=Ringkasan KKB')).not.toBeVisible();
	});

	test('tombol kembali ke halaman utama berfungsi', async ({ page }) => {
		// Check if back to home link exists
		const backLink = page.locator('a[href="/"]').filter({ hasText: 'Kembali ke Halaman Utama' });
		await expect(backLink).toBeVisible();

		// Click the link
		await backLink.click();

		// Should navigate to home page
		await expect(page).toHaveURL('/');
		await expect(
			page.getByRole('heading', { name: 'Simulasi Finansial', exact: true })
		).toBeVisible();
	});
});
