<script>
	let hargaKendaraan = $state(0);
	let dp = $state(20); // Default 20%
	let lamaCicilan = $state(0);
	let sukuBunga = $state(0);
	let hasil = $state(null);

	function hitungKKB() {
		if (hargaKendaraan <= 0 || lamaCicilan <= 0 || sukuBunga <= 0) {
			alert('Mohon isi semua field dengan nilai yang valid!');
			return;
		}

		if (dp < 0 || dp > 100) {
			alert('Down Payment harus antara 0% - 100%!');
			return;
		}

		// Perhitungan dasar
		const jumlahDP = hargaKendaraan * (dp / 100);
		const jumlahPinjaman = hargaKendaraan - jumlahDP;
		const bungaPerBulan = sukuBunga / 100 / 12;
		const totalBulan = lamaCicilan * 12;

		// Formula Anuitas: P × [r(1 + r)^n] / [(1 + r)^n - 1]
		const pembilang = bungaPerBulan * Math.pow(1 + bungaPerBulan, totalBulan);
		const penyebut = Math.pow(1 + bungaPerBulan, totalBulan) - 1;
		const cicilanPerBulan = jumlahPinjaman * (pembilang / penyebut);

		// Generate detail per bulan
		const detailBulanan = [];
		let sisaPinjaman = jumlahPinjaman;
		let totalBunga = 0;

		for (let i = 1; i <= totalBulan; i++) {
			const bungaBulanIni = sisaPinjaman * bungaPerBulan;
			const pokokBulanIni = cicilanPerBulan - bungaBulanIni;
			sisaPinjaman -= pokokBulanIni;
			totalBunga += bungaBulanIni;

			// Handle pembulatan untuk bulan terakhir
			if (i === totalBulan) {
				sisaPinjaman = 0;
			}

			detailBulanan.push({
				bulan: i,
				cicilanPokok: pokokBulanIni,
				cicilanBunga: bungaBulanIni,
				totalCicilan: cicilanPerBulan,
				sisaPinjaman: sisaPinjaman > 0 ? sisaPinjaman : 0
			});
		}

		const totalPembayaran = cicilanPerBulan * totalBulan;

		hasil = {
			detailBulanan,
			summary: {
				hargaKendaraan,
				jumlahDP,
				persenDP: dp,
				jumlahPinjaman,
				cicilanPerBulan,
				totalPembayaran,
				totalBunga,
				lamaCicilan,
				sukuBunga
			}
		};
	}

	function resetForm() {
		hargaKendaraan = 0;
		dp = 20;
		lamaCicilan = 0;
		sukuBunga = 0;
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
	<title>Simulasi KKB - Simulasi Finansial</title>
	<meta
		name="description"
		content="Simulasi kredit kendaraan bermotor (mobil/motor) dengan perhitungan cicilan bulanan menggunakan metode anuitas"
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Back to Home Button -->
		<div class="mb-6">
			<a
				href="/"
				class="inline-flex items-center text-gray-700 hover:text-teal-600 transition-colors duration-200 group"
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
			<h1 class="text-4xl font-bold text-gray-800 mb-2">Simulasi KKB</h1>
			<p class="text-gray-600 text-lg">
				Hitung cicilan bulanan KKB (Kredit Kendaraan Bermotor) untuk mobil atau motor dengan metode anuitas
			</p>
		</div>

		<!-- Form Input -->
		<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
			<h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
				<svg
					class="w-6 h-6 mr-2 text-teal-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
					></path>
				</svg>
				Parameter KKB
			</h2>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					hitungKKB();
				}}
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
			>
				<div class="space-y-2">
					<label for="harga-kendaraan" class="block text-sm font-medium text-gray-700">
						Harga Kendaraan (Rp)
					</label>
					<input
						id="harga-kendaraan"
						type="number"
						bind:value={hargaKendaraan}
						placeholder="200000000"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-lg"
						min="1"
						step="any"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="dp" class="block text-sm font-medium text-gray-700">
						Down Payment (%)
					</label>
					<input
						id="dp"
						type="number"
						bind:value={dp}
						placeholder="20"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-lg"
						min="0"
						max="100"
						step="0.1"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="lama-cicilan" class="block text-sm font-medium text-gray-700">
						Lama Cicilan (Tahun)
					</label>
					<input
						id="lama-cicilan"
						type="number"
						bind:value={lamaCicilan}
						placeholder="3"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-lg"
						min="1"
						max="7"
						step="1"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="suku-bunga" class="block text-sm font-medium text-gray-700">
						Suku Bunga (% per tahun)
					</label>
					<input
						id="suku-bunga"
						type="number"
						bind:value={sukuBunga}
						placeholder="8"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors text-lg"
						min="0.1"
						step="0.1"
						max="50"
						required
					/>
				</div>

				<div class="lg:col-span-4 md:col-span-2 flex gap-4 justify-center">
					<button
						type="submit"
						class="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center shadow-lg hover:shadow-xl"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
							></path>
						</svg>
						Hitung KKB
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
							class="w-6 h-6 mr-2 text-teal-600"
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
						Ringkasan KKB
					</h2>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
							<div class="text-blue-600 text-sm font-medium">Harga Kendaraan</div>
							<div
								id="harga-kendaraan-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.hargaKendaraan)}
							</div>
						</div>
						<div class="bg-green-50 p-6 rounded-xl border border-green-100">
							<div class="text-green-600 text-sm font-medium">Down Payment ({hasil.summary.persenDP}%)</div>
							<div
								id="dp-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.jumlahDP)}
							</div>
						</div>
						<div class="bg-orange-50 p-6 rounded-xl border border-orange-100">
							<div class="text-orange-600 text-sm font-medium">Jumlah Pinjaman</div>
							<div
								id="pinjaman-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.jumlahPinjaman)}
							</div>
						</div>
						<div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
							<div class="text-purple-600 text-sm font-medium">Cicilan per Bulan</div>
							<div
								id="cicilan-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.cicilanPerBulan)}
							</div>
							<div class="text-xs text-gray-500 mt-1">
								Selama {hasil.summary.lamaCicilan} tahun ({hasil.summary.lamaCicilan * 12} bulan)
							</div>
						</div>
						<div class="bg-teal-50 p-6 rounded-xl border border-teal-100">
							<div class="text-teal-600 text-sm font-medium">Total Pembayaran</div>
							<div
								id="total-pembayaran-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.totalPembayaran)}
							</div>
						</div>
						<div class="bg-red-50 p-6 rounded-xl border border-red-100">
							<div class="text-red-600 text-sm font-medium">Total Bunga</div>
							<div
								id="total-bunga-amount"
								class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight"
							>
								{formatRupiah(hasil.summary.totalBunga)}
							</div>
							<div class="text-xs text-gray-500 mt-1">
								Bunga {hasil.summary.sukuBunga}% per tahun
							</div>
						</div>
					</div>
				</div>

				<!-- Detail Tabel -->
				<div class="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div class="p-6 border-b border-gray-200">
						<h2 class="text-2xl font-semibold text-gray-800 flex items-center">
							<svg
								class="w-6 h-6 mr-2 text-teal-600"
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
							Detail Cicilan per Bulan
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
										Cicilan Pokok
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Cicilan Bunga
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Total Cicilan
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Sisa Pinjaman
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each hasil.detailBulanan as item, index (item.bulan)}
									<tr class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											Bulan {item.bulan}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
											{formatRupiah(item.cicilanPokok)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600">
											{formatRupiah(item.cicilanBunga)}
										</td>
										<td
											class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-teal-600"
										>
											{formatRupiah(item.totalCicilan)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
											{formatRupiah(item.sisaPinjaman)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}

		<!-- Penjelasan Rumus Anuitas -->
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
				Cara Perhitungan Bunga Anuitas
			</h3>
			<div class="text-blue-700 text-sm space-y-3">
				<p class="font-medium">Mengapa Total Bunga Berbeda dari Ekspektasi?</p>
				<div class="bg-white rounded-lg p-4 space-y-2">
					<p>
						<span class="font-semibold">❌ Bunga Sederhana (Simple Interest):</span><br />
						Contoh: Pinjaman 400 juta, bunga 4%/tahun, 5 tahun<br />
						<span class="text-red-600">Total Bunga = 400.000.000 × 4% × 5 = 80.000.000</span>
					</p>
					<p>
						<span class="font-semibold">✅ Bunga Anuitas (Yang Digunakan):</span><br />
						<span class="text-green-600">Total Bunga = 41.996.529 (LEBIH RENDAH!)</span>
					</p>
				</div>
				<p class="font-medium">Kenapa lebih rendah?</p>
				<ul class="space-y-1 ml-4">
					<li>• Cicilan tetap setiap bulan</li>
					<li>
						• <span class="font-semibold">Bunga dihitung dari sisa pinjaman yang terus berkurang</span
						>
					</li>
					<li>• Bulan 1: Bunga dari 400 juta</li>
					<li>• Bulan 2: Bunga dari ~394 juta (sudah berkurang!)</li>
					<li>• Bulan 60: Bunga dari sisa yang sangat kecil</li>
				</ul>
				<p class="bg-green-100 p-3 rounded border border-green-300 text-green-800">
					💡 <span class="font-semibold">Keuntungan:</span> Metode anuitas menguntungkan peminjam karena
					total bunga yang dibayar lebih rendah dari simple interest!
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
				<li>• Perhitungan menggunakan metode anuitas (cicilan tetap setiap bulan)</li>
				<li>
					• Simulasi ini tidak termasuk biaya-biaya lain seperti: biaya administrasi, provisi,
					asuransi (jiwa & kendaraan), biaya fidusia, dan biaya-biaya lainnya
				</li>
				<li>• Suku bunga yang digunakan adalah suku bunga tetap (fixed rate)</li>
				<li>
					• Untuk kendaraan bekas, biasanya ada batasan tahun kendaraan dan suku bunga yang lebih
					tinggi
				</li>
				<li>• Hasil simulasi bersifat perkiraan dan dapat berbeda dengan penawaran leasing/bank</li>
				<li>
					• Pastikan untuk berkonsultasi dengan dealer atau lembaga pembiayaan untuk detail yang
					lebih akurat
				</li>
			</ul>
		</div>
	</div>
</div>
