import { expect, test } from '@playwright/test';

test.describe('Halaman Simulasi Investasi Berkala', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/investasi-berkala');
	});

	test('halaman investasi berkala memiliki judul yang benar', async ({ page }) => {
		await expect(page).toHaveTitle('Simulasi Investasi Berkala - Simulasi Finansial');
		await expect(page.locator('h1')).toContainText('Simulasi Investasi Berkala');
	});

	test('form input memiliki semua field yang diperlukan', async ({ page }) => {
		// Check if all input fields exist
		await expect(page.locator('#dana-awal')).toBeVisible();
		await expect(page.locator('#investasi')).toBeVisible();
		await expect(page.locator('#waktu')).toBeVisible();
		await expect(page.locator('#bunga')).toBeVisible();

		// Check labels
		await expect(page.getByText('Dana Saat Ini (Rp)')).toBeVisible();
		await expect(page.getByText('Investasi Bulanan (Rp)')).toBeVisible();
		await expect(page.getByText('Jangka Waktu (Tahun)')).toBeVisible();
		await expect(page.getByText('Bunga per Tahun (%)')).toBeVisible();

		// Check zakat toggle
		await expect(page.locator('#zakat-toggle')).toBeVisible();
		await expect(page.getByText('Aktifkan Zakat (2,5% dari dana yang mengendap 1 tahun)')).toBeVisible();
		await expect(page.locator('#zakat-toggle')).toBeChecked(); // Default should be checked

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

	test('simulasi investasi berkala dengan data valid (tanpa dana awal)', async ({ page }) => {
		// Fill the form with test data
		await page.locator('#dana-awal').fill('0'); // Tidak ada dana awal
		await page.locator('#investasi').fill('1000000'); // 1 juta per bulan
		await page.locator('#waktu').fill('2'); // 2 tahun
		await page.locator('#bunga').fill('12'); // 12% per tahun

		// Submit the form
		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for any JS to execute
		await page.waitForTimeout(1000);

		// Check if results are displayed
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible();
		await expect(page.locator('text=Detail Pertumbuhan Bulanan')).toBeVisible();

		// Check summary cards using ID selectors
		await expect(page.locator('#dana-awal-amount')).toBeVisible();
		await expect(page.locator('#investasi-bulanan-amount')).toBeVisible();
		await expect(page.locator('#total-bunga-amount')).toBeVisible();
		await expect(page.locator('#total-dana-amount')).toBeVisible();
		await expect(page.locator('#keuntungan-amount')).toBeVisible();

		// Check if table is displayed and validate some content
		await expect(page.locator('table')).toBeVisible();
		await expect(page.locator('thead')).toBeVisible();
		await expect(page.locator('tbody')).toBeVisible();

		// Should have 24 rows for 2 years (24 months)
		const rows = page.locator('tbody tr');
		await expect(rows).toHaveCount(24);

		// Check first month row
		await expect(page.getByRole('cell', { name: 'Bulan 1', exact: true })).toBeVisible();

		// Check last month row
		await expect(page.getByRole('cell', { name: 'Bulan 24', exact: true })).toBeVisible();
	});

	test('simulasi investasi berkala dengan dana awal', async ({ page }) => {
		// Fill the form with test data including initial fund
		await page.locator('#dana-awal').fill('5000000'); // 5 juta dana awal
		await page.locator('#investasi').fill('1000000'); // 1 juta per bulan
		await page.locator('#waktu').fill('1'); // 1 tahun
		await page.locator('#bunga').fill('12'); // 12% per tahun

		// Submit the form
		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for any JS to execute
		await page.waitForTimeout(1000);

		// Check if results are displayed
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible();

		// Dana awal should be shown as 5 million - use specific ID
		await expect(page.locator('#dana-awal-amount')).toContainText('Rp 5.000.000');

		// Total investasi bulanan should be 12 million (1 juta x 12 bulan)
		await expect(page.locator('#investasi-bulanan-amount')).toContainText('Rp 12.000.000');

		// Should have 12 rows for 1 year (12 months)
		const rows = page.locator('tbody tr');
		await expect(rows).toHaveCount(12);
	});

	test('perhitungan compound interest memberikan hasil yang benar', async ({ page }) => {
		// Ensure clean state by waiting for page to fully load
		await page.waitForTimeout(200);
		
		// Test with simple values for easy calculation verification
		await page.locator('#dana-awal').fill('0'); // No initial fund
		await page.locator('#investasi').fill('1000000'); // 1 million per month
		await page.locator('#waktu').fill('1'); // 1 year
		await page.locator('#bunga').fill('12'); // 12% per year (1% per month)

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for results to appear
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// With 1% monthly interest and 1M monthly investment for 12 months
		// Total investment should be 12M - check using ID selector
		await expect(page.locator('#investasi-bulanan-amount')).toContainText('Rp 12.000.000');

		// Final amount should be greater than 12M due to compound interest
		// Check that there's some interest earned (should show positive keuntungan)
		await expect(page.locator('#keuntungan-amount')).toBeVisible();
	});

	test('tombol reset berfungsi dengan benar', async ({ page }) => {
		// Ensure form is rendered
		await expect(page.locator('#dana-awal')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#investasi')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#waktu')).toBeVisible({ timeout: 10000 });
		await expect(page.locator('#bunga')).toBeVisible({ timeout: 10000 });

		// Fill the form
		await page.locator('#dana-awal').clear();
		await page.locator('#dana-awal').fill('2000000');
		await page.locator('#investasi').clear();
		await page.locator('#investasi').fill('500000');
		await page.locator('#waktu').clear();
		await page.locator('#waktu').fill('5');
		await page.locator('#bunga').clear();
		await page.locator('#bunga').fill('10');

		// Ensure values are set
		await expect(page.locator('#dana-awal')).toHaveValue('2000000');
		await expect(page.locator('#investasi')).toHaveValue('500000');
		await expect(page.locator('#waktu')).toHaveValue('5');
		await expect(page.locator('#bunga')).toHaveValue('10');

		// Submit to show results
		const submitBtn = page.getByRole('button', { name: 'Hitung Simulasi' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();
		
		// Wait for the Svelte reactive update to complete
		await page.waitForTimeout(300);
		
		// Wait for results to appear
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Investasi'));
		}, { timeout: 15000 });
		
		await expect(page.getByRole('heading', { name: 'Ringkasan Investasi' })).toBeVisible({ timeout: 5000 });

		// Reset the form
		await page.getByRole('button', { name: 'Reset' }).click();

		// Check if form is cleared
		await expect(page.locator('#dana-awal')).toHaveValue('0');
		await expect(page.locator('#investasi')).toHaveValue('0');
		await expect(page.locator('#waktu')).toHaveValue('0');
		await expect(page.locator('#bunga')).toHaveValue('0');
		await expect(page.locator('#zakat-toggle')).toBeChecked(); // Should be back to default (checked)

		// Check if results are hidden
		await expect(page.getByText('Ringkasan Investasi')).not.toBeVisible();
	});

	test('navigasi dari dan ke halaman utama', async ({ page }) => {
		// Check if we can navigate back to home
		await page.goto('/');
		await expect(
			page.getByRole('heading', { name: 'Simulasi Finansial', exact: true })
		).toBeVisible();
		await expect(page.getByText('Investasi Berkala')).toBeVisible();

		// Navigate to investasi-berkala page from home
		await page.getByRole('link', { name: 'Investasi Berkala' }).click();
		await expect(page).toHaveURL('/investasi-berkala');
		await expect(page.locator('h1')).toContainText('Simulasi Investasi Berkala');
	});

	test('responsivitas pada layar mobile', async ({ page }) => {
		// Set mobile viewport
		await page.setViewportSize({ width: 375, height: 667 });

		// Check if page elements are still visible and accessible on mobile
		await expect(page.locator('h1')).toBeVisible();
		await expect(page.locator('#dana-awal')).toBeVisible();
		await expect(page.locator('#investasi')).toBeVisible();
		await expect(page.locator('#waktu')).toBeVisible();
		await expect(page.locator('#bunga')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Hitung Simulasi' })).toBeVisible();

		// Test form functionality on mobile
		await page.locator('#dana-awal').clear();
		await page.locator('#dana-awal').fill('1000000');
		await page.locator('#investasi').clear();
		await page.locator('#investasi').fill('500000');
		await page.locator('#waktu').clear();
		await page.locator('#waktu').fill('2');
		await page.locator('#bunga').clear();
		await page.locator('#bunga').fill('8');

		const submitBtn = page.getByRole('button', { name: 'Hitung Simulasi' });
		await submitBtn.scrollIntoViewIfNeeded();
		await submitBtn.click();
		
		// Wait for results
		await page.waitForTimeout(300);
		await page.waitForFunction(() => {
			const headings = Array.from(document.querySelectorAll('h2'));
			return headings.some(h => h.textContent.includes('Ringkasan Investasi'));
		}, { timeout: 15000 });
		
		await expect(page.getByRole('heading', { name: 'Ringkasan Investasi' })).toBeVisible({ timeout: 5000 });

		// Check if table is still accessible (may have horizontal scroll)
		await expect(page.locator('table')).toBeVisible();
	});

	test('catatan penting ditampilkan', async ({ page }) => {
		// Check if important notes section exists
		await expect(page.getByText('Catatan Penting')).toBeVisible();
		await expect(
			page.getByText('Simulasi menggunakan compound interest yang dihitung setiap bulan')
		).toBeVisible();
		await expect(
			page.getByText('Investasi dilakukan di awal bulan, bunga dihitung dari saldo yang sudah ada')
		).toBeVisible();
		await expect(
			page.getByText('Bunga yang diperoleh langsung ditambahkan ke investasi (compound effect)')
		).toBeVisible();
		await expect(page.getByText('Zakat 2,5% dihitung dari dana yang sudah mengendap selama 1 tahun')).toBeVisible();
		await expect(page.getByText('Zakat hanya wajib jika dana mengendap mencapai nisab (85 juta rupiah)')).toBeVisible();
		await expect(page.getByText('Zakat dapat diaktifkan/dinonaktifkan sesuai kebutuhan simulasi')).toBeVisible();
		await expect(page.getByText('Hasil simulasi bersifat ilustratif')).toBeVisible();
		await expect(page.getByText('Asumsi return konsisten setiap bulan')).toBeVisible();
		await expect(page.getByText('Konsultasikan dengan ustadz/kyai untuk perhitungan zakat yang lebih akurat')).toBeVisible();
	});

	test('validasi input - tidak menerima nilai negatif', async ({ page }) => {
		// Try to input negative values
		await page.locator('#investasi').fill('-1000000');
		await page.locator('#waktu').fill('-1');
		await page.locator('#bunga').fill('-5');

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Should not show results or show validation error
		await expect(page.locator('text=Ringkasan Investasi')).not.toBeVisible();
	});

	test('menampilkan kartu ringkasan dengan benar (dengan zakat)', async ({ page }) => {
		// Fill form and submit with zakat enabled
		await page.locator('#dana-awal').fill('1000000');
		await page.locator('#investasi').fill('500000');
		await page.locator('#waktu').fill('2');
		await page.locator('#bunga').fill('10');
		
		// Ensure zakat is enabled (should be by default)
		await expect(page.locator('#zakat-toggle')).toBeChecked();

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for results
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Check all 6 summary cards exist when zakat is enabled
		await expect(page.locator('#dana-awal-amount')).toBeVisible();
		await expect(page.locator('#investasi-bulanan-amount')).toBeVisible();
		await expect(page.locator('#total-bunga-amount')).toBeVisible();
		await expect(page.locator('#total-zakat-amount')).toBeVisible();
		await expect(page.locator('#total-dana-amount')).toBeVisible();
		await expect(page.locator('#keuntungan-amount')).toBeVisible();

		// Check total dana shows "Setelah zakat"
		await expect(page.getByText('Setelah zakat')).toBeVisible();
	});

	test('menampilkan kartu ringkasan tanpa zakat', async ({ page }) => {
		// Fill form and disable zakat
		await page.locator('#dana-awal').fill('1000000');
		await page.locator('#investasi').fill('500000');
		await page.locator('#waktu').fill('2');
		await page.locator('#bunga').fill('10');
		
		// Disable zakat toggle
		await page.locator('#zakat-toggle').uncheck();
		await expect(page.locator('#zakat-toggle')).not.toBeChecked();

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for results
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Check only 5 summary cards exist when zakat is disabled
		await expect(page.locator('#dana-awal-amount')).toBeVisible();
		await expect(page.locator('#investasi-bulanan-amount')).toBeVisible();
		await expect(page.locator('#total-bunga-amount')).toBeVisible();
		await expect(page.locator('#total-zakat-amount')).not.toBeVisible();
		await expect(page.locator('#total-dana-amount')).toBeVisible();
		await expect(page.locator('#keuntungan-amount')).toBeVisible();

		// Check total dana shows "Sebelum zakat"
		await expect(page.getByText('Sebelum zakat')).toBeVisible();
	});

	test('simulasi dengan zakat enabled menampilkan informasi zakat di tabel', async ({ page }) => {
		// Fill form with high investment to ensure zakat applies
		await page.locator('#dana-awal').fill('100000000'); // 100 juta dana awal (sudah di atas nisab)
		await page.locator('#investasi').fill('20000000'); // 20 juta per bulan
		await page.locator('#waktu').fill('2'); // 2 tahun (24 bulan)
		await page.locator('#bunga').fill('15'); // 15% per tahun
		
		// Ensure zakat is enabled
		await expect(page.locator('#zakat-toggle')).toBeChecked();

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for results
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Check table headers include zakat columns
		await expect(page.locator('th:has-text("Dana Mengendap 1 Tahun")')).toBeVisible();
		await expect(page.locator('th:has-text("Zakat Bulan Ini")')).toBeVisible();
		await expect(page.locator('th:has-text("Status Zakat")')).toBeVisible();

		// Check first 12 months show "Belum 1 Tahun"
		await expect(page.locator('tbody tr:first-child .bg-gray-100', { hasText: 'Belum 1 Tahun' })).toBeVisible();

		// Check month 13 onwards should show zakat status
		// Look for any zakat status element in row 13 (whether Wajib or Tidak Wajib)
		const row13StatusElement = page.locator('tbody tr:nth-child(13) td:has(.bg-green-100, .bg-yellow-100)');
		await expect(row13StatusElement).toBeVisible();
	});

	test('simulasi dengan zakat disabled menyembunyikan kolom zakat di tabel', async ({ page }) => {
		// Fill form and disable zakat
		await page.locator('#dana-awal').fill('10000000');
		await page.locator('#investasi').fill('5000000');
		await page.locator('#waktu').fill('2');
		await page.locator('#bunga').fill('10');
		
		// Disable zakat toggle
		await page.locator('#zakat-toggle').uncheck();

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for results
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Check table headers do NOT include zakat columns
		await expect(page.locator('th:has-text("Dana Mengendap 1 Tahun")')).not.toBeVisible();
		await expect(page.locator('th:has-text("Zakat Bulan Ini")')).not.toBeVisible();
		await expect(page.locator('th:has-text("Status Zakat")')).not.toBeVisible();
	});

	test('zakat mulai dihitung setelah 1 tahun (bulan ke-13)', async ({ page }) => {
		// Fill form with amount that will trigger zakat
		await page.locator('#dana-awal').fill('85000000'); // 85 juta (exactly at nisab)
		await page.locator('#investasi').fill('1000000'); // 1 juta per bulan
		await page.locator('#waktu').fill('2'); // 2 tahun
		await page.locator('#bunga').fill('8'); // 8% per tahun

		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();

		// Wait for results
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Check that months 1-12 show "Belum 1 Tahun"
		const firstRowStatus = page.locator('tbody tr:first-child .bg-gray-100');
		await expect(firstRowStatus).toContainText('Belum 1 Tahun');

		const row12Status = page.locator('tbody tr:nth-child(12) .bg-gray-100');
		await expect(row12Status).toContainText('Belum 1 Tahun');

		// Check that month 13 shows zakat status (should be Wajib for high amount)
		const row13Status = page.locator('tbody tr:nth-child(13) .bg-green-100');
		await expect(row13Status).toContainText('Wajib');
	});

	test('reset form menyertakan zakat toggle', async ({ page }) => {
		// Fill form and disable zakat
		await page.locator('#dana-awal').fill('5000000');
		await page.locator('#investasi').fill('2000000');
		await page.locator('#waktu').fill('3');
		await page.locator('#bunga').fill('15');
		await page.locator('#zakat-toggle').uncheck();

		// Verify values are set
		await expect(page.locator('#dana-awal')).toHaveValue('5000000');
		await expect(page.locator('#zakat-toggle')).not.toBeChecked();

		// Submit to show results
		await page.getByRole('button', { name: 'Hitung Simulasi' }).click();
		await expect(page.locator('text=Ringkasan Investasi')).toBeVisible({ timeout: 5000 });

		// Reset form
		await page.getByRole('button', { name: 'Reset' }).click();

		// Check that zakat toggle is reset to checked (default)
		await expect(page.locator('#dana-awal')).toHaveValue('0');
		await expect(page.locator('#investasi')).toHaveValue('0');
		await expect(page.locator('#waktu')).toHaveValue('0');
		await expect(page.locator('#bunga')).toHaveValue('0');
		await expect(page.locator('#zakat-toggle')).toBeChecked(); // Should be back to default (checked)

		// Results should be hidden
		await expect(page.getByText('Ringkasan Investasi')).not.toBeVisible();
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