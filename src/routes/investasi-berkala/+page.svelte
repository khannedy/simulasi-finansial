<script>
	import { base } from '$app/paths';

	let danaSaatIni = $state(0);
	let investasiBulanan = $state(0);
	let jangkaWaktu = $state(0);
	let bungaTahunan = $state(0);
	let hasil = $state(null);

	function hitungSimulasi() {
		if (investasiBulanan <= 0 || jangkaWaktu <= 0 || bungaTahunan <= 0) {
			alert('Mohon isi semua field dengan nilai yang valid!');
			return;
		}

		const bungaBulanan = bungaTahunan / 100 / 12;
		const totalBulan = jangkaWaktu * 12;

		// Generate data per bulan dengan compound interest
		const detailBulanan = [];
		let saldoAkumulatif = danaSaatIni || 0; // Mulai dari dana saat ini
		let totalInvestasi = danaSaatIni || 0; // Total investasi termasuk dana awal
		let totalBunga = 0;

		for (let i = 1; i <= totalBulan; i++) {
			// Tambahkan investasi bulanan
			saldoAkumulatif += investasiBulanan;
			totalInvestasi += investasiBulanan;

			// Hitung bunga dari saldo yang sudah ada
			const bungaBulanIni = saldoAkumulatif * bungaBulanan;
			saldoAkumulatif += bungaBulanIni;
			totalBunga += bungaBulanIni;

			detailBulanan.push({
				bulan: i,
				investasiBulanan: investasiBulanan,
				bungaBulanIni: bungaBulanIni,
				saldoAkumulatif: saldoAkumulatif,
				totalInvestasi: totalInvestasi,
				totalBunga: totalBunga
			});
		}

		hasil = {
			detailBulanan,
			summary: {
				danaAwal: danaSaatIni || 0,
				totalInvestasiBulanan: investasiBulanan * totalBulan,
				totalInvestasi,
				totalBunga,
				totalDana: saldoAkumulatif,
				keuntungan: saldoAkumulatif - totalInvestasi
			}
		};
	}

	function formatRupiah(amount) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	function resetForm() {
		danaSaatIni = 0;
		investasiBulanan = 0;
		jangkaWaktu = 0;
		bungaTahunan = 0;
		hasil = null;
	}
</script>

<svelte:head>
	<title>Simulasi Investasi Berkala - Simulasi Finansial</title>
	<meta name="description" content="Simulasi investasi berkala dengan compound interest bulanan" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Back to Home Button -->
		<div class="mb-6">
			<a
				href="{base}/"
				class="inline-flex items-center text-gray-700 hover:text-emerald-600 transition-colors duration-200 group"
			>
				<svg
					class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					></path>
				</svg>
				<span class="font-medium">Kembali ke Halaman Utama</span>
			</a>
		</div>

		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-800 mb-2">Simulasi Investasi Berkala</h1>
			<p class="text-gray-600 text-lg">
				Simulasi pertumbuhan dana dari investasi rutin bulanan dengan compound interest
			</p>
		</div>

		<!-- Form Input -->
		<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
			<h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
				<svg
					class="w-6 h-6 mr-2 text-emerald-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
					></path>
				</svg>
				Parameter Investasi
			</h2>

			<form onsubmit={(e) => { e.preventDefault(); hitungSimulasi(); }} class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<div class="space-y-2">
					<label for="dana-awal" class="block text-sm font-medium text-gray-700">
						Dana Saat Ini (Rp)
					</label>
					<input
						id="dana-awal"
						type="number"
						bind:value={danaSaatIni}
						placeholder="0"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-lg"
						min="0"
						step="any"
					/>
				</div>

				<div class="space-y-2">
					<label for="investasi" class="block text-sm font-medium text-gray-700">
						Investasi Bulanan (Rp)
					</label>
					<input
						id="investasi"
						type="number"
						bind:value={investasiBulanan}
						placeholder="1000000"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-lg"
						min="1"
						step="any"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="waktu" class="block text-sm font-medium text-gray-700">
						Jangka Waktu (Tahun)
					</label>
					<input
						id="waktu"
						type="number"
						bind:value={jangkaWaktu}
						placeholder="10"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-lg"
						min="1"
						step="any"
						max="50"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="bunga" class="block text-sm font-medium text-gray-700">
						Bunga per Tahun (%)
					</label>
					<input
						id="bunga"
						type="number"
						bind:value={bungaTahunan}
						placeholder="12"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-lg"
						min="0.1"
						step="0.1"
						max="100"
						required
					/>
				</div>

				<div class="lg:col-span-4 md:col-span-2 flex gap-4 justify-center">
					<button
						type="submit"
						class="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center shadow-lg hover:shadow-xl"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
							></path>
						</svg>
						Hitung Simulasi
					</button>
					<button
						type="button"
						onclick={resetForm}
						class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
					>
						Reset
					</button>
				</div>
			</form>
		</div>

		<!-- Hasil Simulasi -->
		{#if hasil}
			<div class="space-y-8">
				<!-- Summary Card -->
				<div class="bg-white rounded-2xl shadow-xl p-8">
					<h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
						<svg
							class="w-6 h-6 mr-2 text-green-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							></path>
						</svg>
						Ringkasan Investasi
					</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
						<div class="bg-gray-50 p-6 rounded-xl border border-gray-100">
							<div class="text-gray-600 text-sm font-medium">Dana Awal</div>
							<div id="dana-awal-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.summary.danaAwal)}
							</div>
						</div>
						<div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
							<div class="text-blue-600 text-sm font-medium">Total Investasi Bulanan</div>
							<div id="investasi-bulanan-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.summary.totalInvestasiBulanan)}
							</div>
						</div>
						<div class="bg-green-50 p-6 rounded-xl border border-green-100">
							<div class="text-green-600 text-sm font-medium">Total Bunga</div>
							<div id="total-bunga-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.summary.totalBunga)}
							</div>
						</div>
						<div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
							<div class="text-purple-600 text-sm font-medium">Total Dana</div>
							<div id="total-dana-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.summary.totalDana)}
							</div>
						</div>
						<div class="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
							<div class="text-emerald-600 text-sm font-medium">Keuntungan</div>
							<div id="keuntungan-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.summary.keuntungan)}
							</div>
							<div class="text-xs text-gray-500 mt-1">dari compound interest</div>
						</div>
					</div>
				</div>

				<!-- Detail Tabel -->
				<div class="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div class="p-6 border-b border-gray-200">
						<h2 class="text-2xl font-semibold text-gray-800 flex items-center">
							<svg
								class="w-6 h-6 mr-2 text-indigo-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
								></path>
							</svg>
							Detail Pertumbuhan Bulanan
						</h2>
					</div>

					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Bulan
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Investasi Bulanan
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Bunga Bulan Ini
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Total Investasi
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Saldo Akumulatif
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each hasil.detailBulanan as item, index (item.bulan)}
									<tr class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											Bulan {item.bulan}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
											{formatRupiah(item.investasiBulanan)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
											{formatRupiah(item.bungaBulanIni)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
											{formatRupiah(item.totalInvestasi)}
										</td>
										<td
											class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-emerald-600"
										>
											{formatRupiah(item.saldoAkumulatif)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}

		<!-- Catatan -->
		<div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
			<h3 class="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				Catatan Penting
			</h3>
			<ul class="text-yellow-700 text-sm space-y-1">
				<li>
					• Simulasi menggunakan compound interest yang dihitung setiap bulan
				</li>
				<li>• Investasi dilakukan di awal bulan, bunga dihitung dari saldo yang sudah ada</li>
				<li>• Bunga yang diperoleh langsung ditambahkan ke investasi (compound effect)</li>
				<li>• Hasil simulasi bersifat ilustratif dan tidak termasuk biaya transaksi atau pajak</li>
				<li>• Asumsi return konsisten setiap bulan, kondisi pasar sebenarnya dapat berfluktuasi</li>
			</ul>
		</div>
	</div>
</div>