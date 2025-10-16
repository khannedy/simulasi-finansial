<script>
	let hargaProperti = $state(0);
	let kenaikanHarga = $state(0); // persen per tahun
	let sewaTahunan = $state(0);
	let durasiSimulasi = $state(0);
	let hasil = $state(null);

	function hitungProperti() {
		if (hargaProperti <= 0 || sewaTahunan <= 0 || durasiSimulasi <= 0) {
			alert('Mohon isi semua field dengan nilai yang valid!');
			return;
		}

		if (kenaikanHarga < 0 || kenaikanHarga > 100) {
			alert('Kenaikan harga harus antara 0% - 100%!');
			return;
		}

		// Generate detail per tahun
		const detailTahunan = [];
		let totalSewa = 0;

		for (let tahun = 1; tahun <= durasiSimulasi; tahun++) {
			// Nilai properti dengan compound growth
			const nilaiProperti = hargaProperti * Math.pow(1 + kenaikanHarga / 100, tahun);
			const capitalGain = nilaiProperti - hargaProperti;

			// Akumulasi sewa
			totalSewa += sewaTahunan;

			// Total keuntungan = capital gain + total sewa
			const totalKeuntungan = capitalGain + totalSewa;

			detailTahunan.push({
				tahun,
				nilaiProperti,
				capitalGain,
				sewaTahunIni: sewaTahunan,
				totalSewa,
				totalKeuntungan
			});
		}

		// Summary data
		const nilaiAkhir = detailTahunan[detailTahunan.length - 1].nilaiProperti;
		const totalCapitalGain = nilaiAkhir - hargaProperti;
		const totalSewaAkumulatif = sewaTahunan * durasiSimulasi;
		const totalKeuntunganAkhir = totalCapitalGain + totalSewaAkumulatif;
		const roi = ((totalKeuntunganAkhir / hargaProperti) * 100).toFixed(2);

		hasil = {
			detailTahunan,
			summary: {
				hargaBeli: hargaProperti,
				nilaiAkhir,
				totalCapitalGain,
				totalSewa: totalSewaAkumulatif,
				totalKeuntungan: totalKeuntunganAkhir,
				roi,
				kenaikanHarga,
				sewaTahunan,
				durasiSimulasi
			}
		};
	}

	function resetForm() {
		hargaProperti = 0;
		kenaikanHarga = 0;
		sewaTahunan = 0;
		durasiSimulasi = 0;
		hasil = null;
	}

	function formatRupiah(amount) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Investasi Properti - Simulasi Finansial</title>
	<meta
		name="description"
		content="Simulasi investasi properti untuk disewakan dengan perhitungan capital gain dan rental income"
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Back to Home Button -->
		<div class="mb-6">
			<a
				href="/"
				class="inline-flex items-center text-gray-700 hover:text-amber-600 transition-colors duration-200 group"
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
			<h1 class="text-4xl font-bold text-gray-800 mb-2">Investasi Properti</h1>
			<p class="text-gray-600 text-lg">
				Simulasi investasi properti untuk disewakan dengan perhitungan capital gain dan rental income
			</p>
		</div>

		<!-- Form Input -->
		<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
			<h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
				<svg
					class="w-6 h-6 mr-2 text-amber-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
					></path>
				</svg>
				Parameter Investasi
			</h2>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					hitungProperti();
				}}
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
			>
				<div class="space-y-2">
					<label for="harga-properti" class="block text-sm font-medium text-gray-700">
						Harga Properti (Rp)
					</label>
					<input
						id="harga-properti"
						type="number"
						bind:value={hargaProperti}
						placeholder="1000000000"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-lg"
						min="1"
						step="any"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="kenaikan-harga" class="block text-sm font-medium text-gray-700">
						Kenaikan Harga per Tahun (%)
					</label>
					<input
						id="kenaikan-harga"
						type="number"
						bind:value={kenaikanHarga}
						placeholder="5"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-lg"
						min="0"
						max="100"
						step="0.1"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="sewa-tahunan" class="block text-sm font-medium text-gray-700">
						Harga Sewa per Tahun (Rp)
					</label>
					<input
						id="sewa-tahunan"
						type="number"
						bind:value={sewaTahunan}
						placeholder="50000000"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-lg"
						min="1"
						step="any"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="durasi-simulasi" class="block text-sm font-medium text-gray-700">
						Durasi Simulasi (Tahun)
					</label>
					<input
						id="durasi-simulasi"
						type="number"
						bind:value={durasiSimulasi}
						placeholder="10"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-lg"
						min="1"
						max="30"
						step="1"
						required
					/>
				</div>

				<div class="lg:col-span-4 md:col-span-2 flex gap-4 justify-center">
					<button
						type="submit"
						class="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center shadow-lg hover:shadow-xl"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							></path>
						</svg>
						Hitung Investasi
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
							class="w-6 h-6 mr-2 text-amber-600"
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

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
							<div class="text-blue-600 text-sm font-medium">Harga Beli Awal</div>
							<div
								id="harga-beli-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.hargaBeli)}
							</div>
						</div>
						<div class="bg-green-50 p-6 rounded-xl border border-green-100">
							<div class="text-green-600 text-sm font-medium">
								Nilai Properti Akhir (Tahun {hasil.summary.durasiSimulasi})
							</div>
							<div
								id="nilai-akhir-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.nilaiAkhir)}
							</div>
						</div>
						<div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
							<div class="text-purple-600 text-sm font-medium">Total Capital Gain</div>
							<div
								id="capital-gain-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.totalCapitalGain)}
							</div>
							<div class="text-xs text-gray-500 mt-1">
								Apresiasi {hasil.summary.kenaikanHarga}% per tahun
							</div>
						</div>
						<div class="bg-orange-50 p-6 rounded-xl border border-orange-100">
							<div class="text-orange-600 text-sm font-medium">Total Pendapatan Sewa</div>
							<div
								id="total-sewa-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.totalSewa)}
							</div>
							<div class="text-xs text-gray-500 mt-1">
								{formatRupiah(hasil.summary.sewaTahunan)}/tahun × {hasil.summary.durasiSimulasi} tahun
							</div>
						</div>
						<div class="bg-amber-50 p-6 rounded-xl border border-amber-100">
							<div class="text-amber-600 text-sm font-medium">Total Keuntungan</div>
							<div
								id="total-keuntungan-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.totalKeuntungan)}
							</div>
							<div class="text-xs text-gray-500 mt-1">Capital Gain + Sewa</div>
						</div>
						<div class="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
							<div class="text-emerald-600 text-sm font-medium">ROI (Return on Investment)</div>
							<div
								id="roi-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{hasil.summary.roi}%
							</div>
							<div class="text-xs text-gray-500 mt-1">
								Selama {hasil.summary.durasiSimulasi} tahun
							</div>
						</div>
					</div>
				</div>

				<!-- Detail Tabel -->
				<div class="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div class="p-6 border-b border-gray-200">
						<h2 class="text-2xl font-semibold text-gray-800 flex items-center">
							<svg
								class="w-6 h-6 mr-2 text-amber-600"
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
							Detail Investasi per Tahun
						</h2>
					</div>

					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Tahun
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Nilai Properti
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Capital Gain
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Sewa Tahun Ini
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Total Sewa
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Total Keuntungan
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each hasil.detailTahunan as item, index (item.tahun)}
									<tr class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											Tahun {item.tahun}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
											{formatRupiah(item.nilaiProperti)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-purple-600">
											{formatRupiah(item.capitalGain)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600">
											{formatRupiah(item.sewaTahunIni)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
											{formatRupiah(item.totalSewa)}
										</td>
										<td
											class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-amber-600"
										>
											{formatRupiah(item.totalKeuntungan)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}

		<!-- Penjelasan Capital Gain & Rental Income -->
		<div class="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
			<h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center">
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
					></path>
				</svg>
				Dua Sumber Keuntungan Investasi Properti
			</h3>
			<div class="text-blue-700 text-sm space-y-3">
				<div class="bg-white rounded-lg p-4 space-y-2">
					<p>
						<span class="font-semibold">💎 Capital Gain (Apresiasi):</span><br />
						Keuntungan dari kenaikan nilai properti seiring waktu
					</p>
					<p class="text-blue-600 ml-4">
						Contoh: Properti 1 miliar dengan kenaikan 5%/tahun, setelah 10 tahun menjadi 1,63
						miliar. Capital Gain = 630 juta
					</p>
				</div>
				<div class="bg-white rounded-lg p-4 space-y-2">
					<p>
						<span class="font-semibold">💰 Rental Income (Pendapatan Sewa):</span><br />
						Pendapatan pasif bulanan/tahunan dari menyewakan properti
					</p>
					<p class="text-blue-600 ml-4">
						Contoh: Sewa 50 juta/tahun × 10 tahun = 500 juta total pendapatan sewa
					</p>
				</div>
				<p class="bg-green-100 p-3 rounded border border-green-300 text-green-800">
					💡 <span class="font-semibold">Total Keuntungan:</span> Capital Gain + Rental Income =
					Properti memberikan keuntungan ganda!
				</p>
			</div>
		</div>

		<!-- Catatan -->
		<div class="mt-4 bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
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
					• Simulasi ini tidak termasuk biaya-biaya lain seperti: Pajak Bumi dan Bangunan (PBB),
					biaya perawatan, biaya renovasi, biaya manajemen properti, dan biaya-biaya lainnya
				</li>
				<li>• Asumsi: Properti terisi penyewa sepanjang tahun (occupancy rate 100%)</li>
				<li>• Harga sewa dianggap tetap (tidak ada kenaikan sewa)</li>
				<li>• Kenaikan harga properti menggunakan compound growth</li>
				<li>
					• Tidak memperhitungkan inflasi, pajak penghasilan sewa, dan capital gain tax
				</li>
				<li>• Hasil simulasi bersifat perkiraan dan dapat berbeda dengan kondisi pasar riil</li>
				<li>
					• Pastikan untuk melakukan analisis lebih mendalam dan berkonsultasi dengan profesional
					properti untuk investasi yang lebih akurat
				</li>
			</ul>
		</div>
	</div>
</div>
