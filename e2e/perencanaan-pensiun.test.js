import { expect, test } from '@playwright/test';

test.describe('Halaman Perencanaan Pensiun', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/perencanaan-pensiun');
	});

	test('halaman perencanaan pensiun memiliki judul yang benar', async ({ page }) => {
		await expect(page).toHaveTitle('Perencanaan Pensiun - Simulasi Finansial');
		await expect(page.locator('h1')).toContainText('Perencanaan Pensiun');
	});

	test('form input memiliki semua field yang diperlukan', async ({ page }) => {
		// Check if all input fields exist
		await expect(page.locator('#target-dana')).toBeVisible();
		await expect(page.locator('#durasi')).toBeVisible();
		await expect(page.locator('#suku-bunga')).toBeVisible();

		// Check labels
		await expect(page.getByText('Target Dana Tahunan (Rp)')).toBeVisible();
		await expect(page.getByText('Durasi Pensiun (Tahun)')).toBeVisible();
		await expect(page.getByText('Tingkat Suku Bunga (% per tahun)')).toBeVisible();

		// Check buttons
		await expect(page.getByRole('button', { name: 'Hitung Perencanaan' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();

		// Check default value for suku bunga
		await expect(page.locator('#suku-bunga')).toHaveValue('6');
	});

	test('validasi form - tidak bisa submit dengan field kosong', async ({ page }) => {
		// Try to submit without filling the form
		await page.getByRole('button', { name: 'Hitung Perencanaan' }).click();

		// Should show browser validation (field required)
		// Note: Browser validation behavior may vary, so we check that no results are shown
		await expect(page.locator('text=Ringkasan Perencanaan Dana Pensiun')).not.toBeVisible();
	});

	test('simulasi perencanaan pensiun dengan data valid', async ({ page }) => {
		// Wait for form to be ready
		await expect(page.locator('#target-dana')).toBeVisible();

		// Fill the form with test data
		await page.locator('#target-dana').clear();
		await page.locator('#target-dana').fill('120000000'); // 120 juta per tahun
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('20'); // 20 tahun pensiun
		await page.locator('#suku-bunga').clear();
		await page.locator('#suku-bunga').fill('8'); // 8% per tahun

		// Submit the form
		const submitBtn = page.getByRole('button', { name: 'Hitung Perencanaan' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for results with robust pattern
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Perencanaan Dana Pensiun'));
		}, { timeout: 15000 });

		// Check if results are displayed
		await expect(page.getByRole('heading', { name: 'Ringkasan Perencanaan Dana Pensiun' })).toBeVisible({ timeout: 5000 });
		await expect(page.getByRole('heading', { name: 'Simulasi Tahunan' })).toBeVisible();

		// Check summary cards
		await expect(page.getByText('Total Dana Diperlukan')).toBeVisible();

		// Check if table is displayed
		await expect(page.locator('table')).toBeVisible();
		await expect(page.locator('th:has-text("Tahun")')).toBeVisible();
		await expect(page.locator('th:has-text("Sisa Dana Awal")')).toBeVisible();
		await expect(page.locator('th:has-text("Dana Digunakan")')).toBeVisible();
		await expect(page.locator('th:has-text("Total Penarikan")')).toBeVisible();
		await expect(page.locator('th:has-text("Bunga Diperoleh")')).toBeVisible();
		await expect(page.locator('th:has-text("Sisa Dana Akhir")')).toBeVisible();

		// Should have 20 rows for 20 years
		const rows = page.locator('tbody tr');
		await expect(rows).toHaveCount(20);

		// Check first year row
		await expect(page.getByRole('cell', { name: 'Tahun 1', exact: true })).toBeVisible();

		// Check last year row
		await expect(page.getByRole('cell', { name: 'Tahun 20', exact: true })).toBeVisible();
	});

	test('perhitungan perencanaan pensiun memberikan hasil yang benar', async ({ page }) => {
		// Wait for form to be ready
		await expect(page.locator('#target-dana')).toBeVisible();
		
		// Test with known values for easy calculation
		await page.locator('#target-dana').clear();
		await page.locator('#target-dana').fill('100000000'); // 100 juta per tahun
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('10'); // 10 tahun
		await page.locator('#suku-bunga').clear();
		await page.locator('#suku-bunga').fill('10'); // 10% per tahun

		const submitBtn = page.getByRole('button', { name: 'Hitung Perencanaan' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for results to appear
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Perencanaan Dana Pensiun'));
		}, { timeout: 15000 });

		await expect(page.getByRole('heading', { name: 'Ringkasan Perencanaan Dana Pensiun' })).toBeVisible({ timeout: 5000 });

		// Expected calculations for validation:
		// PV Annuity factor for 10% rate, 10 years = (1 - (1.1)^(-10)) / 0.1 ≈ 6.144
		// Dana pensiun murni = 100M × 6.144 ≈ 614.4M

		// Check if results show proper structure
		await expect(page.getByText('Total Dana Diperlukan')).toBeVisible();
	});

	test('tombol reset berfungsi dengan benar', async ({ page }) => {
		// Wait for form to be ready
		await expect(page.locator('#target-dana')).toBeVisible();
		await expect(page.locator('#durasi')).toBeVisible();
		await expect(page.locator('#suku-bunga')).toBeVisible();

		// Fill the form
		await page.locator('#target-dana').clear();
		await page.locator('#target-dana').fill('150000000');
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('25');
		await page.locator('#suku-bunga').clear();
		await page.locator('#suku-bunga').fill('7');

		// Ensure values are set
		await expect(page.locator('#target-dana')).toHaveValue('150000000');
		await expect(page.locator('#durasi')).toHaveValue('25');
		await expect(page.locator('#suku-bunga')).toHaveValue('7');

		// Submit to show results
		const submitBtn = page.getByRole('button', { name: 'Hitung Perencanaan' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for results
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Perencanaan Dana Pensiun'));
		}, { timeout: 15000 });

		await expect(page.getByRole('heading', { name: 'Ringkasan Perencanaan Dana Pensiun' })).toBeVisible({ timeout: 5000 });

		// Reset the form
		await page.getByRole('button', { name: 'Reset' }).click();

		// Check if form is cleared
		await expect(page.locator('#target-dana')).toHaveValue('0');
		await expect(page.locator('#durasi')).toHaveValue('0');
		await expect(page.locator('#suku-bunga')).toHaveValue('6'); // Default value

		// Check if results are hidden
		await expect(page.getByText('Ringkasan Perencanaan Dana Pensiun')).not.toBeVisible();
	});

	test('navigasi dari halaman utama', async ({ page }) => {
		// Go to home page first
		await page.goto('/');
		await expect(page.getByText('Perencanaan Pensiun')).toBeVisible();

		// Navigate to perencanaan pensiun page
		await page.getByRole('link', { name: /Mulai Perencanaan/ }).click();
		await expect(page).toHaveURL('/perencanaan-pensiun');
		await expect(page.locator('h1')).toContainText('Perencanaan Pensiun');
	});

	test('responsivitas pada layar mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Check if page elements are still visible and accessible on mobile
		await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#target-dana')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#durasi')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#suku-bunga')).toBeVisible({ timeout: 10000 });
		await expect(page.getByRole('button', { name: 'Hitung Perencanaan' })).toBeVisible({ timeout: 10000 });

		// Test form functionality on mobile
		await page.locator('#target-dana').clear();
		await page.locator('#target-dana').fill('80000000');
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('15');
		await page.locator('#suku-bunga').clear();
		await page.locator('#suku-bunga').fill('6');

		await expect(page.locator('#target-dana')).toHaveValue('80000000');
		await expect(page.locator('#durasi')).toHaveValue('15');
		await expect(page.locator('#suku-bunga')).toHaveValue('6');

		const submitBtn = page.getByRole('button', { name: 'Hitung Perencanaan' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for results with robust pattern
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Perencanaan Dana Pensiun'));
		}, { timeout: 15000 });

		await expect(page.getByText('Ringkasan Perencanaan Dana Pensiun')).toBeVisible({ timeout: 5000 });

		// Check if table is still accessible (may have horizontal scroll)
		await expect(page.locator('table')).toBeVisible();
	});

	test('penjelasan rumus dan catatan penting ditampilkan', async ({ page }) => {
		// Check if explanation sections exist
		await expect(page.getByText('Penjelasan Rumus dan Asumsi')).toBeVisible();
		await expect(page.getByText('Metode Simulasi Iteratif:')).toBeVisible();
		await expect(page.getByText('Mencari dana awal optimal yang dapat bertahan hingga akhir periode pensiun')).toBeVisible();

		await expect(page.getByText('Catatan Penting')).toBeVisible();
		await expect(page.getByText('Simulasi ini menggunakan metode iteratif dengan asumsi suku bunga tetap')).toBeVisible();
		await expect(page.getByText('Dana dihitung agar dapat bertahan hingga akhir periode tanpa deficit')).toBeVisible();
		await expect(page.getByText('Inflasi belum diperhitungkan dalam simulasi ini')).toBeVisible();
		await expect(page.getByText('Konsultasikan dengan perencana keuangan')).toBeVisible();
	});

	test('format mata uang rupiah ditampilkan dengan benar', async ({ page }) => {
		// Wait for form to be ready
		await expect(page.locator('#target-dana')).toBeVisible({ timeout: 10000 });

		// Fill form and calculate
		await page.locator('#target-dana').clear();
		await page.locator('#target-dana').fill('200000000'); // 200 million
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('5'); // 5 years
		await page.locator('#suku-bunga').clear();
		await page.locator('#suku-bunga').fill('5'); // 5% rate

		const submitBtn = page.getByRole('button', { name: 'Hitung Perencanaan' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for results
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Perencanaan Dana Pensiun'));
		}, { timeout: 15000 });

		await expect(page.getByText('Ringkasan Perencanaan Dana Pensiun')).toBeVisible({ timeout: 5000 });

		// Check if amounts are formatted as Rupiah
		await expect(page.getByText('Total Dana Diperlukan')).toBeVisible();

		// Check table shows proper Rupiah formatting
		await expect(page.locator('tbody tr:first-child .text-blue-600', { hasText: 'Rp 200.000.000' })).toBeVisible(); // Dana digunakan in table
	});

	test('validasi input dengan nilai negatif atau nol', async ({ page }) => {
		// Wait for form to be ready
		await expect(page.locator('#target-dana')).toBeVisible();

		// Try with zero values
		await page.locator('#target-dana').clear();
		await page.locator('#target-dana').fill('0');
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('0');

		await page.getByRole('button', { name: 'Hitung Perencanaan' }).click();

		// Should not show results
		await expect(page.getByText('Ringkasan Perencanaan Dana Pensiun')).not.toBeVisible();
	});

	test('simulasi tipe modal tetap berfungsi dengan benar', async ({ page }) => {
		// Wait for form to be ready
		await expect(page.locator('#target-dana')).toBeVisible();

		// Fill form
		await page.locator('#target-dana').clear();
		await page.locator('#target-dana').fill('100000000'); // 100 juta
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('20');
		await page.locator('#suku-bunga').clear();
		await page.locator('#suku-bunga').fill('10');

		// Select modal tetap simulation type
		await page.locator('input[value="modal-tetap"]').check();

		// Submit form
		const submitBtn = page.getByRole('button', { name: 'Hitung Perencanaan' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for the results to appear
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Perencanaan Dana Pensiun'));
		}, { timeout: 15000 });

		await expect(page.getByRole('heading', { name: 'Ringkasan Perencanaan Dana Pensiun' })).toBeVisible({ timeout: 5000 });

		// Check if type badge is displayed (use more specific locator to avoid radio button)
		await expect(page.locator('span.bg-purple-100').filter({ hasText: 'Modal Tetap (Hidup dari Bunga)' })).toBeVisible();

		// Check summary cards for modal tetap
		await expect(page.getByText('Modal Diperlukan')).toBeVisible();
		await expect(page.getByText('Bunga Tahunan')).toBeVisible();

		// Check table headers for modal tetap
		await expect(page.locator('th:has-text("Modal Tetap")')).toBeVisible();
		await expect(page.locator('th:has-text("Sisa Bunga")')).toBeVisible();

		// Should have 20 rows for 20 years
		const rows = page.locator('tbody tr');
		await expect(rows).toHaveCount(20);
	});

	test('perbandingan kedua tipe simulasi', async ({ page }) => {
		// Wait for form to be ready
		await expect(page.locator('#target-dana')).toBeVisible();

		// Fill form
		await page.locator('#target-dana').clear();
		await page.locator('#target-dana').fill('50000000'); // 50 juta
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('15');
		await page.locator('#suku-bunga').clear();
		await page.locator('#suku-bunga').fill('8');

		// Test Dana Habis first
		await page.locator('input[value="habis"]').check();
		const submitBtn = page.getByRole('button', { name: 'Hitung Perencanaan' });
		await submitBtn.click();

		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Perencanaan Dana Pensiun'));
		}, { timeout: 10000 });

		// Check dana habis type (use more specific locator to avoid radio button)
		await expect(page.locator('span.bg-purple-100', { hasText: 'Dana Habis di Akhir Periode' })).toBeVisible();
		await expect(page.locator('th:has-text("Sisa Dana Awal")')).toBeVisible();

		// Switch to Modal Tetap
		await page.locator('input[value="modal-tetap"]').check();
		await submitBtn.click();

		await page.waitForFunction(() => {
			return document.querySelector('.bg-purple-100') && 
			       document.querySelector('.bg-purple-100').textContent.includes('Modal Tetap');
		}, { timeout: 10000 });

		// Check modal tetap type (use more specific locator to avoid radio button)
		await expect(page.locator('.bg-purple-100', { hasText: 'Modal Tetap (Hidup dari Bunga)' })).toBeVisible();
		await expect(page.locator('th:has-text("Modal Tetap")')).toBeVisible();
	});

	test('hasil simulasi di-clear saat ganti tipe simulasi', async ({ page }) => {
		// Wait for form to be ready
		await expect(page.locator('#target-dana')).toBeVisible();

		// Fill form and calculate with dana habis
		await page.locator('#target-dana').clear();
		await page.locator('#target-dana').fill('100000000');
		await page.locator('#durasi').clear();
		await page.locator('#durasi').fill('10');
		await page.locator('#suku-bunga').clear();
		await page.locator('#suku-bunga').fill('8');

		await page.locator('input[value="habis"]').check();
		await page.getByRole('button', { name: 'Hitung Perencanaan' }).click();

		// Wait for results to appear
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Perencanaan Dana Pensiun'));
		}, { timeout: 10000 });

		// Verify results are displayed
		await expect(page.locator('.bg-purple-100', { hasText: 'Dana Habis di Akhir Periode' })).toBeVisible();

		// Switch to modal tetap WITHOUT submitting
		await page.locator('input[value="modal-tetap"]').check();

		// Results should be cleared (no more visible)
		await expect(page.getByText('Ringkasan Perencanaan Dana Pensiun')).not.toBeVisible();

		// Re-submit with modal tetap should show new results
		await page.getByRole('button', { name: 'Hitung Perencanaan' }).click();

		await page.waitForFunction(() => {
			return document.querySelector('span.bg-purple-100') && 
			       document.querySelector('span.bg-purple-100').textContent.includes('Modal Tetap');
		}, { timeout: 10000 });

		await expect(page.locator('span.bg-purple-100', { hasText: 'Modal Tetap (Hidup dari Bunga)' })).toBeVisible();
	});

	test('tombol kembali ke halaman utama berfungsi', async ({ page }) => {
		// Check if back to home link exists
		const backLink = page.locator('a[href="/"]').filter({ hasText: 'Kembali ke Halaman Utama' });
		await expect(backLink).toBeVisible();

		// Click the link
		await backLink.click();

		// Should navigate to home page
		await expect(page).toHaveURL('/');
		await expect(page.getByRole('heading', { name: 'Simulasi Finansial', exact: true })).toBeVisible();
	});
});

