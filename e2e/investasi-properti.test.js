import { expect, test } from '@playwright/test';

test.describe('Halaman Investasi Properti', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/investasi-properti');
	});

	test('halaman investasi properti memiliki judul yang benar', async ({ page }) => {
		await expect(page).toHaveTitle('Investasi Properti - Simulasi Finansial');
		await expect(page.locator('h1')).toContainText('Investasi Properti');
	});

	test('form input memiliki semua field yang diperlukan', async ({ page }) => {
		// Check if all input fields exist
		await expect(page.locator('#harga-properti')).toBeVisible();
		await expect(page.locator('#kenaikan-harga')).toBeVisible();
		await expect(page.locator('#sewa-tahunan')).toBeVisible();
		await expect(page.locator('#durasi-simulasi')).toBeVisible();

		// Check labels
		await expect(page.getByText('Harga Properti (Rp)')).toBeVisible();
		await expect(page.getByText('Kenaikan Harga per Tahun (%)')).toBeVisible();
		await expect(page.getByText('Harga Sewa per Tahun (Rp)')).toBeVisible();
		await expect(page.getByText('Durasi Simulasi (Tahun)')).toBeVisible();

		// Check buttons
		await expect(page.getByRole('button', { name: 'Hitung Investasi' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
	});

	test('validasi form - tidak bisa submit dengan field kosong', async ({ page }) => {
		// Try to submit without filling the form
		await page.getByRole('button', { name: 'Hitung Investasi' }).click();

		// Should show browser validation (field required)
		// Note: Browser validation behavior may vary, so we check that no results are shown
		await expect(page.locator('text=Ringkasan Investasi')).not.toBeVisible();
	});

	test('simulasi investasi properti dengan data valid', async ({ page }) => {
		// Fill the form with test data
		await page.locator('#harga-properti').fill('1000000000'); // 1 miliar
		await page.locator('#kenaikan-harga').fill('5'); // 5% per tahun
		await page.locator('#sewa-tahunan').fill('50000000'); // 50 juta per tahun
		await page.locator('#durasi-simulasi').fill('10'); // 10 tahun

		// Submit the form
		await page.getByRole('button', { name: 'Hitung Investasi' }).click();

		// Wait for any JS to execute
		await page.waitForTimeout(1000);

		// Check if results are displayed
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible();
		await expect(page.locator('text=Detail Investasi per Tahun')).toBeVisible();

		// Check summary cards
		await expect(page.locator('#harga-beli-amount')).toBeVisible();
		await expect(page.locator('#nilai-akhir-amount')).toBeVisible();
		await expect(page.locator('#capital-gain-amount')).toBeVisible();
		await expect(page.locator('#total-sewa-amount')).toBeVisible();
		await expect(page.locator('#total-keuntungan-amount')).toBeVisible();
		await expect(page.locator('#roi-amount')).toBeVisible();

		// Check if table is displayed
		await expect(page.locator('table')).toBeVisible();
		await expect(page.locator('thead')).toBeVisible();
		await expect(page.locator('tbody')).toBeVisible();

		// Should have 10 rows for 10 years
		const rows = page.locator('tbody tr');
		await expect(rows).toHaveCount(10);

		// Check first year row
		await expect(page.getByRole('cell', { name: 'Tahun 1', exact: true })).toBeVisible();

		// Check last year row
		await expect(page.getByRole('cell', { name: 'Tahun 10', exact: true })).toBeVisible();
	});

	test('perhitungan investasi properti memberikan hasil yang benar', async ({ page }) => {
		// Ensure clean state by waiting for page to fully load
		await page.waitForTimeout(200);

		// Test with simple values for easy calculation verification
		await page.locator('#harga-properti').fill('1000000000'); // 1 miliar
		await page.locator('#kenaikan-harga').fill('5'); // 5% per tahun
		await page.locator('#sewa-tahunan').fill('50000000'); // 50 juta per tahun
		await page.locator('#durasi-simulasi').fill('10'); // 10 tahun

		await page.getByRole('button', { name: 'Hitung Investasi' }).click();

		// Wait for results to appear
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Harga beli should be 1 miliar
		await expect(page.locator('#harga-beli-amount')).toContainText('Rp 1.000.000.000');

		// Total sewa should be 500 juta (50 juta × 10 tahun)
		await expect(page.locator('#total-sewa-amount')).toContainText('Rp 500.000.000');

		// Check that capital gain and total keuntungan are displayed
		await expect(page.locator('#capital-gain-amount')).toBeVisible();
		await expect(page.locator('#total-keuntungan-amount')).toBeVisible();
		await expect(page.locator('#roi-amount')).toBeVisible();
	});

	test('tombol reset berfungsi dengan benar', async ({ page }) => {
		// Ensure form is rendered
		await expect(page.locator('#harga-properti')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#kenaikan-harga')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#sewa-tahunan')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#durasi-simulasi')).toBeVisible({ timeout: 10000 });

		// Fill the form
		await page.locator('#harga-properti').clear();
		await page.locator('#harga-properti').fill('1000000000');
		await page.locator('#kenaikan-harga').clear();
		await page.locator('#kenaikan-harga').fill('5');
		await page.locator('#sewa-tahunan').clear();
		await page.locator('#sewa-tahunan').fill('50000000');
		await page.locator('#durasi-simulasi').clear();
		await page.locator('#durasi-simulasi').fill('10');

		// Ensure values are set
		await expect(page.locator('#harga-properti')).toHaveValue('1000000000');
		await expect(page.locator('#kenaikan-harga')).toHaveValue('5');
		await expect(page.locator('#sewa-tahunan')).toHaveValue('50000000');
		await expect(page.locator('#durasi-simulasi')).toHaveValue('10');

		// Submit to show results
		const submitBtn = page.getByRole('button', { name: 'Hitung Investasi' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for the Svelte reactive update to complete
		await page.waitForTimeout(300);

		// Wait for results to appear
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some((h) => h.textContent.includes('Ringkasan Investasi'));
		}, { timeout: 15000 });

		await expect(page.getByRole('heading', { name: 'Ringkasan Investasi' })).toBeVisible({
			timeout: 5000
		});

		// Reset the form
		await page.getByRole('button', { name: 'Reset' }).click();

		// Check if form is cleared
		await expect(page.locator('#harga-properti')).toHaveValue('0');
		await expect(page.locator('#kenaikan-harga')).toHaveValue('0');
		await expect(page.locator('#sewa-tahunan')).toHaveValue('0');
		await expect(page.locator('#durasi-simulasi')).toHaveValue('0');

		// Check if results are hidden
		await expect(page.getByText('Ringkasan Investasi')).not.toBeVisible();
	});

	test('navigasi dari dan ke halaman utama', async ({ page }) => {
		// Check if we can navigate back to home
		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: 'Simulasi Finansial', exact: true })
		).toBeVisible();
		await expect(page.getByRole('heading', { name: 'Investasi Properti' })).toBeVisible();

		// Navigate to investasi-properti page from home
		await page.getByRole('link', { name: 'Investasi Properti' }).click();
		await expect(page).toHaveURL('/investasi-properti');
		await expect(page.locator('h1')).toContainText('Investasi Properti');
	});

	test('responsivitas pada layar mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Check if page elements are still visible and accessible on mobile
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('#harga-properti')).toBeVisible();
		await expect(page.locator('#kenaikan-harga')).toBeVisible();
		await expect(page.locator('#sewa-tahunan')).toBeVisible();
		await expect(page.locator('#durasi-simulasi')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Hitung Investasi' })).toBeVisible();

		// Test form functionality on mobile
		await page.locator('#harga-properti').clear();
		await page.locator('#harga-properti').fill('500000000');
		await page.locator('#kenaikan-harga').clear();
		await page.locator('#kenaikan-harga').fill('5');
		await page.locator('#sewa-tahunan').clear();
		await page.locator('#sewa-tahunan').fill('30000000');
		await page.locator('#durasi-simulasi').clear();
		await page.locator('#durasi-simulasi').fill('5');

		const submitBtn = page.getByRole('button', { name: 'Hitung Investasi' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for results
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some((h) => h.textContent.includes('Ringkasan Investasi'));
		}, { timeout: 15000 });

		await expect(page.getByRole('heading', { name: 'Ringkasan Investasi' })).toBeVisible({
			timeout: 5000
		});

		// Check if table is still accessible (may have horizontal scroll)
		await expect(page.locator('table')).toBeVisible();
	});

	test('catatan penting ditampilkan', async ({ page }) => {
		// Check if important notes section exists
		await expect(page.getByText('Catatan Penting')).toBeVisible();
		await expect(
			page.getByText('Simulasi ini tidak termasuk biaya-biaya lain seperti')
		).toBeVisible();
		await expect(
			page.getByText('Asumsi: Properti terisi penyewa sepanjang tahun')
		).toBeVisible();
		await expect(page.getByText('Harga sewa dianggap tetap')).toBeVisible();
		await expect(page.getByText('Hasil simulasi bersifat perkiraan')).toBeVisible();
	});

	test('format mata uang rupiah ditampilkan dengan benar', async ({ page }) => {
		// Wait for initial form
		await expect(page.locator('#harga-properti')).toBeVisible({ timeout: 10000 });

		// Fill form and calculate
		await page.locator('#harga-properti').fill('800000000'); // 800 juta
		await page.locator('#kenaikan-harga').fill('6'); // 6% per tahun
		await page.locator('#sewa-tahunan').fill('40000000'); // 40 juta per tahun
		await page.locator('#durasi-simulasi').fill('8'); // 8 tahun

		const submitBtn = page.getByRole('button', { name: 'Hitung Investasi' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for results
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some((h) => h.textContent.includes('Ringkasan Investasi'));
		}, { timeout: 15000 });

		await expect(page.getByText('Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Check if amounts are formatted as Rupiah
		await expect(page.locator('#harga-beli-amount')).toContainText('Rp 800.000.000', {
			timeout: 10000
		});
		// Total sewa should be 320 juta (40 juta × 8 tahun)
		await expect(page.locator('#total-sewa-amount')).toContainText('Rp 320.000.000', {
			timeout: 10000
		});
	});

	test('validasi input dengan nilai negatif atau nol', async ({ page }) => {
		// Try to input zero/negative values
		await page.locator('#harga-properti').fill('0');
		await page.locator('#kenaikan-harga').fill('0');
		await page.locator('#sewa-tahunan').fill('0');
		await page.locator('#durasi-simulasi').fill('0');

		await page.getByRole('button', { name: 'Hitung Investasi' }).click();

		// Should not show results
		await expect(page.locator('text=Ringkasan Investasi')).not.toBeVisible();
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
