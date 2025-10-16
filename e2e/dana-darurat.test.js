import { expect, test } from '@playwright/test';

test.describe('Halaman Dana Darurat', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/dana-darurat');
	});

	test('halaman dana darurat memiliki judul yang benar', async ({ page }) => {
		await expect(page).toHaveTitle('Dana Darurat - Simulasi Finansial');
		await expect(page.locator('h1')).toContainText('Dana Darurat');
	});

	test('form input memiliki semua field yang diperlukan', async ({ page }) => {
		// Check if all input fields exist
		await expect(page.locator('#pengeluaran-bulanan')).toBeVisible();
		await expect(page.locator('#jumlah-tanggungan')).toBeVisible();
		await expect(page.locator('#dana-saat-ini')).toBeVisible();
		await expect(page.locator('#tabungan-bulanan')).toBeVisible();

		// Check labels
		await expect(page.getByText('Pengeluaran Bulanan (Rp)')).toBeVisible();
		await expect(page.getByLabel('Jumlah Tanggungan Keluarga')).toBeVisible();
		await expect(page.getByText('Dana Darurat Saat Ini (Rp)')).toBeVisible();
		await expect(page.getByLabel('Tabungan Bulanan untuk Dana Darurat (Rp)')).toBeVisible();

		// Check jenis pekerjaan radio buttons
		await expect(page.getByText('Pegawai Tetap')).toBeVisible();
		await expect(page.getByText('Freelance')).toBeVisible();
		await expect(page.getByText('Wiraswasta')).toBeVisible();

		// Check buttons
		await expect(page.getByRole('button', { name: 'Hitung Dana Darurat' })).toBeVisible();
		await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
	});

	test('validasi form - tidak bisa submit dengan field kosong', async ({ page }) => {
		// Try to submit without filling the form
		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();

		// Should show browser validation (field required)
		await expect(page.locator('text=Rekomendasi Dana Darurat')).not.toBeVisible();
	});

	test('perhitungan dana darurat untuk pegawai tetap tanpa tanggungan', async ({ page }) => {
		// Fill the form for pegawai tetap
		await page.locator('#pengeluaran-bulanan').fill('5000000'); // 5 juta/bulan
		await page.locator('#jumlah-tanggungan').fill('0');
		// Pegawai tetap is default selected

		// Submit the form
		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();

		// Wait for results
		await page.waitForTimeout(500);

		// Check if results are displayed
		await expect(page.locator('text=Rekomendasi Dana Darurat')).toBeVisible();
		await expect(page.locator('text=Status Dana Darurat Anda')).toBeVisible();

		// For pegawai tetap with 0 tanggungan:
		// Minimum = 3 bulan = 15 juta
		// Ideal = 6 bulan = 30 juta
		// Maksimal = 6 bulan = 30 juta
		await expect(page.locator('#minimum-amount')).toContainText('Rp 15.000.000');
		await expect(page.locator('#ideal-amount')).toContainText('Rp 30.000.000');
		await expect(page.locator('#maksimal-amount')).toContainText('Rp 30.000.000');
	});

	test('perhitungan dana darurat untuk freelance dengan tanggungan', async ({ page }) => {
		// Fill the form for freelance with tanggungan
		await page.locator('#pengeluaran-bulanan').fill('10000000'); // 10 juta/bulan
		await page.locator('#jumlah-tanggungan').fill('2');

		// Select freelance
		await page.locator('input[value="freelance"]').click();

		// Submit the form
		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();

		// Wait for results
		await page.waitForTimeout(500);

		// Check if results are displayed
		await expect(page.locator('text=Rekomendasi Dana Darurat')).toBeVisible();

		// For freelance with 2 tanggungan:
		// Minimum = (6 + 2) bulan = 80 juta
		// Ideal = (9 + 2) bulan = 110 juta
		// Maksimal = (12 + 2) bulan = 140 juta
		await expect(page.locator('#minimum-amount')).toContainText('Rp 80.000.000');
		await expect(page.locator('#ideal-amount')).toContainText('Rp 110.000.000');
		await expect(page.locator('#maksimal-amount')).toContainText('Rp 140.000.000');
	});

	test('perhitungan dana darurat untuk wiraswasta dengan tanggungan', async ({ page }) => {
		// Fill the form for wiraswasta with tanggungan
		await page.locator('#pengeluaran-bulanan').fill('8000000'); // 8 juta/bulan
		await page.locator('#jumlah-tanggungan').fill('3');

		// Select wiraswasta
		await page.locator('input[value="wiraswasta"]').click();

		// Submit the form
		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();

		// Wait for results
		await page.waitForTimeout(500);

		// Check if results are displayed
		await expect(page.locator('text=Rekomendasi Dana Darurat')).toBeVisible();

		// For wiraswasta with 3 tanggungan:
		// Minimum = (6 + 3) bulan = 72 juta
		// Ideal = (9 + 3) bulan = 96 juta
		// Maksimal = (12 + 3) bulan = 120 juta
		await expect(page.locator('#minimum-amount')).toContainText('Rp 72.000.000');
		await expect(page.locator('#ideal-amount')).toContainText('Rp 96.000.000');
		await expect(page.locator('#maksimal-amount')).toContainText('Rp 120.000.000');
	});

	test('progress tracker dan status dengan dana saat ini', async ({ page }) => {
		// Fill the form
		await page.locator('#pengeluaran-bulanan').fill('5000000'); // 5 juta/bulan
		await page.locator('#jumlah-tanggungan').fill('0');
		await page.locator('#dana-saat-ini').fill('15000000'); // 15 juta (50% dari ideal 30 juta)

		// Submit the form
		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();

		// Wait for results
		await page.waitForTimeout(500);

		// Check status section
		await expect(page.locator('text=Status Dana Darurat Anda')).toBeVisible();
		await expect(page.locator('text=Progress ke Target Ideal')).toBeVisible();

		// Should show Good status (above minimum but below ideal)
		await expect(
			page.locator('text=Good! Dana darurat Anda sudah mencapai target minimum')
		).toBeVisible();

		// Progress should be around 50%
		await expect(page.locator('text=50.0%')).toBeVisible();
	});

	test('simulasi waktu pencapaian dengan tabungan bulanan', async ({ page }) => {
		// Fill the form including tabungan bulanan
		await page.locator('#pengeluaran-bulanan').fill('5000000'); // 5 juta/bulan
		await page.locator('#jumlah-tanggungan').fill('0');
		await page.locator('#dana-saat-ini').fill('10000000'); // 10 juta
		await page.locator('#tabungan-bulanan').fill('2000000'); // 2 juta/bulan

		// Submit the form
		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();

		// Wait for results
		await page.waitForTimeout(500);

		// Check if time simulation appears
		await expect(page.locator('text=Simulasi Waktu Pencapaian')).toBeVisible();

		// Should show time to reach targets
		await expect(page.locator('#waktu-minimum')).toBeVisible();
		await expect(page.locator('#waktu-ideal')).toBeVisible();
		await expect(page.locator('#waktu-maksimal')).toBeVisible();
	});

	test('tombol reset berfungsi dengan benar', async ({ page }) => {
		// Fill the form
		await page.locator('#pengeluaran-bulanan').fill('5000000');
		await page.locator('#jumlah-tanggungan').fill('2');
		await page.locator('#dana-saat-ini').fill('10000000');
		await page.locator('#tabungan-bulanan').fill('1000000');

		// Submit
		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();

		// Wait for results
		await page.waitForTimeout(500);
		await expect(page.locator('text=Rekomendasi Dana Darurat')).toBeVisible();

		// Reset the form
		await page.getByRole('button', { name: 'Reset' }).click();

		// Check if form is cleared
		await expect(page.locator('#pengeluaran-bulanan')).toHaveValue('0');
		await expect(page.locator('#jumlah-tanggungan')).toHaveValue('0');
		await expect(page.locator('#dana-saat-ini')).toHaveValue('0');
		await expect(page.locator('#tabungan-bulanan')).toHaveValue('0');

		// Check if results are hidden
		await expect(page.locator('text=Rekomendasi Dana Darurat')).not.toBeVisible();
	});

	test('navigasi dari dan ke halaman utama', async ({ page }) => {
		// Check if we can navigate back to home
		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: 'Simulasi Finansial', exact: true })
		).toBeVisible();

		// Navigate to dana-darurat page from home
		await page.getByRole('link', { name: 'Dana Darurat' }).click();
		await expect(page).toHaveURL('/dana-darurat');
		await expect(page.locator('h1')).toContainText('Dana Darurat');
	});

	test('responsivitas pada layar mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Check if page elements are still visible and accessible on mobile
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('#pengeluaran-bulanan')).toBeVisible();
		await expect(page.locator('#jumlah-tanggungan')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Hitung Dana Darurat' })).toBeVisible();

		// Test form functionality on mobile
		await page.locator('#pengeluaran-bulanan').fill('5000000');
		await page.locator('#jumlah-tanggungan').fill('1');

		const submitBtn = page.getByRole('button', { name: 'Hitung Dana Darurat' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();

		// Wait for results
		await page.waitForTimeout(500);

		await expect(page.locator('text=Rekomendasi Dana Darurat')).toBeVisible();
	});

	test('educational content ditampilkan', async ({ page }) => {
		// Check if educational section exists
		await expect(page.getByText('Apa itu Dana Darurat?')).toBeVisible();
		await expect(page.getByText('Definisi')).toBeVisible();
		await expect(page.getByText('Mengapa Penting?')).toBeVisible();
		await expect(page.getByText('Tips Membangun Dana Darurat')).toBeVisible();
	});

	test('catatan penting ditampilkan', async ({ page }) => {
		// Check if important notes section exists
		await expect(page.getByText('Catatan Penting')).toBeVisible();
		await expect(page.getByText('mudah dicairkan')).toBeVisible();
		await expect(page.getByText('Simpan dana darurat di instrumen')).toBeVisible();
	});

	test('format mata uang rupiah ditampilkan dengan benar', async ({ page }) => {
		// Fill form and calculate
		await page.locator('#pengeluaran-bulanan').fill('6000000'); // 6 juta
		await page.locator('#jumlah-tanggungan').fill('1');

		const submitBtn = page.getByRole('button', { name: 'Hitung Dana Darurat' });
		await submitBtn.click();

		// Wait for results
		await page.waitForTimeout(500);

		// Check if amounts are formatted as Rupiah
		// Pegawai tetap + 1 tanggungan:
		// Minimum = (3 + 1) × 6 juta = 24 juta
		// Ideal = (6 + 1) × 6 juta = 42 juta
		await expect(page.locator('#minimum-amount')).toContainText('Rp 24.000.000');
		await expect(page.locator('#ideal-amount')).toContainText('Rp 42.000.000');
	});

	test('tombol kembali ke halaman utama berfungsi', async ({ page }) => {
		// Check if back to home link exists at top
		const backLinkTop = page
			.locator('a[href="/"]')
			.filter({ hasText: 'Kembali ke Halaman Utama' })
			.first();
		await expect(backLinkTop).toBeVisible();

		// Click the link
		await backLinkTop.click();

		// Should navigate to home page
		await expect(page).toHaveURL('/');
		await expect(
			page.getByRole('heading', { name: 'Simulasi Finansial', exact: true })
		).toBeVisible();
	});

	test('status berubah sesuai progress dana darurat', async ({ page }) => {
		// Test 1: Dana di bawah minimum
		await page.locator('#pengeluaran-bulanan').fill('5000000');
		await page.locator('#jumlah-tanggungan').fill('0');
		await page.locator('#dana-saat-ini').fill('5000000'); // < 15 juta (minimum)

		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();
		await page.waitForTimeout(500);

		await expect(
			page.locator('text=Perlu ditingkatkan! Dana darurat Anda masih di bawah target minimum')
		).toBeVisible();

		// Reset and test 2: Dana di atas ideal
		await page.getByRole('button', { name: 'Reset' }).click();
		await page.locator('#pengeluaran-bulanan').fill('5000000');
		await page.locator('#jumlah-tanggungan').fill('0');
		await page.locator('#dana-saat-ini').fill('35000000'); // > 30 juta (ideal)

		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();
		await page.waitForTimeout(500);

		await expect(
			page.locator('text=Excellent! Dana darurat Anda sudah mencapai target ideal')
		).toBeVisible();
	});

	test('penjelasan menyesuaikan jenis pekerjaan dan tanggungan', async ({ page }) => {
		// Test untuk freelance dengan tanggungan
		await page.locator('#pengeluaran-bulanan').fill('5000000');
		await page.locator('#jumlah-tanggungan').fill('2');
		await page.locator('input[value="freelance"]').click();

		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();
		await page.waitForTimeout(500);

		// Should show explanation for freelance
		await expect(page.locator('text=freelance dengan pendapatan tidak tetap')).toBeVisible();
		await expect(page.locator('text=Dengan 2 tanggungan')).toBeVisible();
	});

	test('tabel simulasi bulanan ditampilkan dengan benar', async ({ page }) => {
		// Fill form with tabungan bulanan
		await page.locator('#pengeluaran-bulanan').fill('5000000'); // 5 juta/bulan
		await page.locator('#jumlah-tanggungan').fill('0');
		await page.locator('#dana-saat-ini').fill('5000000'); // 5 juta saat ini
		await page.locator('#tabungan-bulanan').fill('2000000'); // 2 juta/bulan

		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();
		await page.waitForTimeout(500);

		// Check if monthly simulation table appears
		await expect(page.locator('text=Detail Simulasi Per Bulan')).toBeVisible();

		// Check table headers
		await expect(page.locator('th:has-text("Bulan")')).toBeVisible();
		await expect(page.locator('th:has-text("Dana Awal")')).toBeVisible();
		await expect(page.locator('th:has-text("Tabungan")')).toBeVisible();
		await expect(page.locator('th:has-text("Dana Akhir")')).toBeVisible();
		await expect(page.locator('th:has-text("Progress")')).toBeVisible();
		await expect(page.locator('th:has-text("Status")')).toBeVisible();

		// Check first row exists (Bulan 1)
		const firstRow = page.locator('tbody tr').first();
		await expect(firstRow).toContainText('Bulan 1');

		// Check that legend exists
		await expect(page.locator('text=Target Minimum Tercapai (🟡)')).toBeVisible();
		await expect(page.locator('text=Target Ideal Tercapai (✅)')).toBeVisible();
		await expect(page.locator('text=Target Maksimal Tercapai (⭐)')).toBeVisible();

		// Check milestone indicators exist (emojis)
		const tableContent = await page.locator('table').textContent();
		const hasMinimumMilestone =
			tableContent.includes('Target Minimum Tercapai!') || tableContent.includes('🟡');
		expect(hasMinimumMilestone).toBeTruthy();
	});

	test('tabel simulasi tidak muncul tanpa tabungan bulanan', async ({ page }) => {
		// Fill form WITHOUT tabungan bulanan
		await page.locator('#pengeluaran-bulanan').fill('5000000');
		await page.locator('#jumlah-tanggungan').fill('0');
		await page.locator('#dana-saat-ini').fill('10000000');
		// Don't fill tabungan-bulanan (leave it 0)

		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();
		await page.waitForTimeout(500);

		// Results should appear
		await expect(page.locator('text=Rekomendasi Dana Darurat')).toBeVisible();

		// But monthly simulation table should NOT appear
		await expect(page.locator('text=Detail Simulasi Per Bulan')).not.toBeVisible();
	});

	test('tabel simulasi menampilkan data akumulasi yang benar', async ({ page }) => {
		// Simple scenario: 10 juta saat ini, 5 juta/bulan saving, 5 juta pengeluaran
		// Target minimum (pegawai tetap, 0 tanggungan) = 3 × 5 juta = 15 juta
		// Should reach minimum in (15 - 10) / 5 = 1 bulan
		await page.locator('#pengeluaran-bulanan').fill('5000000');
		await page.locator('#jumlah-tanggungan').fill('0');
		await page.locator('#dana-saat-ini').fill('10000000');
		await page.locator('#tabungan-bulanan').fill('5000000');

		await page.getByRole('button', { name: 'Hitung Dana Darurat' }).click();
		await page.waitForTimeout(500);

		// Table should appear
		await expect(page.locator('text=Detail Simulasi Per Bulan')).toBeVisible();

		// Check first row: dana awal should be 10 juta
		const firstRow = page.locator('tbody tr').first();
		await expect(firstRow.locator('td').nth(1)).toContainText('10.000.000');

		// Check first row: dana akhir should be 15 juta (10 + 5)
		await expect(firstRow.locator('td').nth(3)).toContainText('15.000.000');

		// First row should be the minimum milestone
		await expect(firstRow.locator('text=Target Minimum Tercapai!')).toBeVisible();
	});
});
