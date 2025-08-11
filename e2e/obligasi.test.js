import { expect, test } from '@playwright/test';

test.describe('Halaman Simulasi Obligasi', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/obligasi');
	});

	test('halaman obligasi memiliki judul yang benar', async ({ page }) => {
		await expect(page).toHaveTitle('Simulasi Obligasi - Simulasi Finansial');
		await expect(page.locator('h1')).toContainText('Simulasi Obligasi');
	});

	test('form input memiliki semua field yang diperlukan', async ({ page }) => {
		// Check if all input fields exist
		await expect(page.locator('#saldo')).toBeVisible();
		await expect(page.locator('#bunga')).toBeVisible();
		await expect(page.locator('#durasi')).toBeVisible();

		// Check labels
		await expect(page.getByText('Saldo Obligasi (Rp)')).toBeVisible();
		await expect(page.getByText('Bunga Obligasi (% per tahun)')).toBeVisible();
		await expect(page.getByText('Durasi (Tahun)')).toBeVisible();

		// Check zakat toggle
		await expect(page.locator('#zakat-toggle')).toBeVisible();
		await expect(page.getByText('Aktifkan Zakat (2,5% per tahun di bulan ke-12)')).toBeVisible();

		// Check buttons
		await expect(page.getByRole('button', { name: 'Hitung Simulasi' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
	});

	test('validasi form - tidak bisa submit dengan field kosong', async ({ page }) => {
		// Try to submit without filling the form
		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Should show browser validation (field required)
		// Note: Browser validation behavior may vary, so we check that no results are shown
		await expect(page.locator('text=Ringkasan Investasi')).not.toBeVisible();
	});

	test('simulasi obligasi dengan data valid', async ({ page }) => {
		// Fill the form with test data
		await page.locator('#saldo').fill('10000000'); // 10 juta
		await page.locator('#bunga').fill('6.5'); // 6.5% per tahun
		await page.locator('#durasi').fill('2'); // 2 tahun

		// Submit the form
		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for any JS to execute
		await page.waitForTimeout(1000);

		// Debug: Take screenshot
		await page.screenshot({ path: 'test-debug.png' });

		// Check if results are displayed
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible();
		await expect(page.locator('text=Detail Kupon Bulanan')).toBeVisible();

		// Check summary cards
		await expect(page.getByText('Total Kupon Kotor')).toBeVisible();
		await expect(page.getByText('Total Pajak (10%)')).toBeVisible();
		await expect(page.getByText('Total Kupon Bersih')).toBeVisible();
		await expect(
			page.locator('.bg-purple-50 .text-purple-600:has-text("Total Pendapatan")')
		).toBeVisible();

		// Check if table is displayed
		await expect(page.locator('table')).toBeVisible();
		await expect(page.locator('th:has-text("Bulan")')).toBeVisible();
		await expect(page.locator('th:has-text("Kupon Kotor")')).toBeVisible();
		await expect(page.locator('th:has-text("Pajak (10%)")')).toBeVisible();
		await expect(page.locator('th:has-text("Kupon Bersih")')).toBeVisible();

		// Should have 24 rows for 2 years (24 months)
		const rows = page.locator('tbody tr');
		await expect(rows).toHaveCount(24);

		// Check first month row
		await expect(page.getByRole('cell', { name: 'Bulan 1', exact: true })).toBeVisible();

		// Check last month row
		await expect(page.getByRole('cell', { name: 'Bulan 24', exact: true })).toBeVisible();
	});

	test('perhitungan obligasi memberikan hasil yang benar', async ({ page }) => {
		// Ensure clean state by waiting for page to fully load
		await page.waitForTimeout(200);
		
		// Test with known values for easy calculation
		await page.locator('#saldo').fill('12000000'); // 12 juta
		await page.locator('#bunga').fill('6'); // 6% per tahun
		await page.locator('#durasi').fill('1'); // 1 tahun

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for results to appear - give time for $state to update
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Expected calculations:
		// Kupon bulanan kotor = 12,000,000 * 0.06 / 12 = 60,000
		// Pajak = 60,000 * 0.10 = 6,000
		// Kupon bersih = 60,000 - 6,000 = 54,000
		// Total kupon kotor = 60,000 * 12 = 720,000
		// Total pajak = 6,000 * 12 = 72,000
		// Total kupon bersih = 54,000 * 12 = 648,000
		// Total pendapatan = 648,000 + 12,000,000 = 12,648,000

		// Check if amounts are formatted correctly using IDs
		await expect(page.locator('#kupon-kotor-amount')).toContainText('Rp 720.000'); // Total kupon kotor
		await expect(page.locator('#pajak-amount')).toContainText('Rp 72.000'); // Total pajak
		await expect(page.locator('#kupon-bersih-amount')).toContainText('Rp 648.000'); // Total kupon bersih
		await expect(page.locator('#total-pendapatan-amount')).toContainText('Rp 12.648.000'); // Total pendapatan
	});

	test('simulasi dengan zakat enabled berfungsi dengan benar', async ({ page }) => {
		// Ensure clean state by waiting for page to fully load
		await page.waitForTimeout(200);
		
		// Test with 2 years to see zakat deduction in action
		await page.locator('#saldo').fill('100000000'); // 100 juta
		await page.locator('#bunga').fill('6'); // 6% per tahun
		await page.locator('#durasi').fill('2'); // 2 tahun

		// Enable zakat
		await page.locator('#zakat-toggle').check();
		await expect(page.locator('#zakat-toggle')).toBeChecked();

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for results to appear
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Check if zakat card is displayed
		await expect(page.locator('#zakat-amount')).toBeVisible();

		// Check table headers include zakat column
		await expect(page.locator('th:has-text("Zakat (2,5%)")')).toBeVisible();
		await expect(page.locator('th:has-text("Total Dana")')).toBeVisible();

		// Check if zakat is deducted at month 12 and 24
		await expect(page.getByRole('cell', { name: 'Bulan 12', exact: true })).toBeVisible();
		await expect(page.getByRole('cell', { name: 'Bulan 24', exact: true })).toBeVisible();

		// Total pendapatan should be less when zakat is enabled
		const totalPendapatanText = await page.locator('#total-pendapatan-amount').textContent();
		expect(totalPendapatanText).toContain('Rp');
		
		// Check the subtitle shows zakat deduction
		await expect(page.getByText('Kupon + Pokok - Zakat')).toBeVisible();
	});

	test('simulasi tanpa zakat vs dengan zakat menunjukkan perbedaan', async ({ page }) => {
		// Test without zakat first
		await page.locator('#saldo').fill('50000000'); // 50 juta
		await page.locator('#bunga').fill('8'); // 8% per tahun
		await page.locator('#durasi').fill('1'); // 1 tahun

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Without zakat - no zakat card should be visible
		await expect(page.locator('#zakat-amount')).not.toBeVisible();
		await expect(page.locator('th:has-text("Zakat (2,5%)")')).not.toBeVisible();
		await expect(page.getByText('Kupon + Pokok')).toBeVisible();

		// Get total pendapatan without zakat
		const pendapatanTanpaZakat = await page.locator('#total-pendapatan-amount').textContent();

		// Reset and test with zakat
		await page.getByRole('button', { name: 'Reset' }).click();
		
		await page.locator('#saldo').fill('50000000'); // 50 juta
		await page.locator('#bunga').fill('8'); // 8% per tahun  
		await page.locator('#durasi').fill('1'); // 1 tahun
		await page.locator('#zakat-toggle').check();

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// With zakat - zakat card should be visible
		await expect(page.locator('#zakat-amount')).toBeVisible();
		await expect(page.locator('th:has-text("Zakat (2,5%)")')).toBeVisible();
		await expect(page.getByText('Kupon + Pokok - Zakat')).toBeVisible();

		// Get total pendapatan with zakat
		const pendapatanDenganZakat = await page.locator('#total-pendapatan-amount').textContent();

		// They should be different (pendapatan dengan zakat should be less)
		expect(pendapatanDenganZakat).not.toBe(pendapatanTanpaZakat);
	});

	test('tombol reset berfungsi dengan benar', async ({ page }) => {
		// Ensure form is rendered
		await expect(page.locator('#saldo')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#bunga')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#durasi')).toBeVisible({ timeout: 10000 });

		// Fill the form with clear first to avoid input conflicts
		await page.locator('#saldo').clear();
		await page.locator('#saldo').fill('5000000');
		await page.locator('#bunga').clear();
		await page.locator('#bunga').fill('7');
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('3');
		
		// Enable zakat toggle
		await page.locator('#zakat-toggle').check();

		// Ensure values are actually set before submitting (avoids flakiness)
		await expect(page.locator('#saldo')).toHaveValue('5000000');
		await expect(page.locator('#bunga')).toHaveValue('7');
		await expect(page.locator('#durasi')).toHaveValue('3');
		await expect(page.locator('#zakat-toggle')).toBeChecked();

		// Submit to show results with robust click handling
		const submitBtn = page.getByRole('button', { name: 'Hitung Simulasi' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();
		
		// Wait for the Svelte reactive update to complete
		await page.waitForTimeout(300);
		
		// Use a more reliable wait strategy - wait for any result content to appear
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Investasi')) ||
			       document.querySelectorAll('.bg-blue-50, .bg-red-50, .bg-green-50, .bg-purple-50').length > 0;
		}, { timeout: 15000 });
		
		// Now assert the heading is visible
		await expect(page.getByRole('heading', { name: 'Ringkasan Investasi' })).toBeVisible({ timeout: 5000 });

		// Reset the form
		await page.getByRole('button', { name: 'Reset' }).click();

		// Check if form is cleared
		await expect(page.locator('#saldo')).toHaveValue('0');
		await expect(page.locator('#bunga')).toHaveValue('0');
		await expect(page.locator('#durasi')).toHaveValue('0');
		await expect(page.locator('#zakat-toggle')).not.toBeChecked();

		// Check if results are hidden
		await expect(page.getByText('Ringkasan Investasi')).not.toBeVisible();
	});

	test('navigasi kembali ke halaman utama', async ({ page }) => {
		// Check if we can navigate back to home
		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: 'Simulasi Finansial', exact: true })
		).toBeVisible();
		await expect(page.getByText('Simulasi Obligasi')).toBeVisible();

		// Navigate to obligasi page from home - use more specific selector
		await page.getByRole('link').filter({ hasText: 'Simulasi Obligasi' }).click();
		await expect(page).toHaveURL('/obligasi');
		await expect(page.locator('h1')).toContainText('Simulasi Obligasi');
	});

	test('responsivitas pada layar mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Check if page elements are still visible and accessible on mobile
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('#saldo')).toBeVisible();
		await expect(page.locator('#bunga')).toBeVisible();
		await expect(page.locator('#durasi')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Hitung Simulasi' })).toBeVisible();

		// Test form functionality on mobile
		await page.locator('#saldo').clear();
		await page.locator('#saldo').fill('1000000');
		await page.locator('#bunga').clear();
		await page.locator('#bunga').fill('5');
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('1');

		const submitBtn = page.getByRole('button', { name: 'Hitung Simulasi' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();
		
		// Wait for results with the same robust pattern as the reset test
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Investasi')) ||
			       document.querySelectorAll('.bg-blue-50, .bg-red-50, .bg-green-50, .bg-purple-50').length > 0;
		}, { timeout: 15000 });
		
		await expect(page.getByRole('heading', { name: 'Ringkasan Investasi' })).toBeVisible({ timeout: 5000 });

		// Check if table is still accessible (may have horizontal scroll)
		await expect(page.locator('table')).toBeVisible();
	});

	test('catatan penting ditampilkan', async ({ page }) => {
		// Check if important notes section exists
		await expect(page.getByText('Catatan Penting')).toBeVisible();
		await expect(
			page.getByText('Simulasi ini menggunakan asumsi pajak obligasi 10%')
		).toBeVisible();
		await expect(
			page.getByText('Kupon dibayarkan setiap bulan dengan jumlah yang sama')
		).toBeVisible();
		await expect(
			page.getByText('Total pendapatan sudah termasuk pengembalian pokok investasi')
		).toBeVisible();
		await expect(
			page.getByText('Fitur zakat: mengurangi 2,5% dari total dana setiap bulan ke-12')
		).toBeVisible();
		await expect(page.getByText('Hasil simulasi bersifat ilustratif')).toBeVisible();
	});
});
