<script>
	import { base } from '$app/paths';

	let saldoObligasi = $state(0);
	let bungaObligasi = $state(0);
	let durasiObligasi = $state(0);
	let hasil = $state(null);

	function hitungSimulasi() {
		if (saldoObligasi <= 0 || bungaObligasi <= 0 || durasiObligasi <= 0) {
			alert('Mohon isi semua field dengan nilai yang valid!');
			return;
		}

		const bungaTahunan = bungaObligasi / 100;
		const kuponBulanan = (saldoObligasi * bungaTahunan) / 12;
		const pajakObligasi = kuponBulanan * 0.1; // Pajak 10%
		const kuponBersih = kuponBulanan - pajakObligasi;
		const totalBulan = durasiObligasi * 12;

		// Track running total
		let runningTotal = saldoObligasi;

		// Generate data per bulan
		const detailBulanan = [];
		for (let i = 1; i <= totalBulan; i++) {
			// Add monthly kupon to running total
			runningTotal += kuponBersih;

			detailBulanan.push({
				bulan: i,
				kuponKotor: kuponBulanan,
				pajak: pajakObligasi,
				kuponBersih: kuponBersih,
				totalDana: runningTotal
			});
		}

		const totalKuponKotor = kuponBulanan * totalBulan;
		const totalPajak = pajakObligasi * totalBulan;
		const totalKuponBersih = kuponBersih * totalBulan;
		const totalPendapatan = totalKuponBersih + saldoObligasi;

		hasil = {
			detailBulanan,
			summary: {
				totalKuponKotor,
				totalPajak,
				totalKuponBersih,
				saldoPokok: saldoObligasi,
				totalPendapatan
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
		saldoObligasi = 0;
		bungaObligasi = 0;
		durasiObligasi = 0;
		hasil = null;
	}
</script>

<svelte:head>
	<title>Simulasi Obligasi - Simulasi Finansial</title>
	<meta name="description" content="Simulasi perhitungan kupon obligasi dan pajak obligasi" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Back to Home Button -->
		<div class="mb-6">
			<a
				href="{base}/"
				class="inline-flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
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
			<h1 class="text-4xl font-bold text-gray-800 mb-2">Simulasi Obligasi</h1>
			<p class="text-gray-600 text-lg">
				Hitung perkiraan kupon bulanan dan total pendapatan dari investasi obligasi Anda
			</p>
		</div>

		<!-- Form Input -->
		<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
			<h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
				<svg
					class="w-6 h-6 mr-2 text-blue-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
					></path>
				</svg>
				Parameter Obligasi
			</h2>

			<form onsubmit={(e) => { e.preventDefault(); hitungSimulasi(); }} class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="space-y-2">
					<label for="saldo" class="block text-sm font-medium text-gray-700">
						Saldo Obligasi (Rp)
					</label>
					<input
						id="saldo"
						type="number"
						bind:value={saldoObligasi}
						placeholder="1000000"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
						min="1"
						step="any"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="bunga" class="block text-sm font-medium text-gray-700">
						Bunga Obligasi (% per tahun)
					</label>
					<input
						id="bunga"
						type="number"
						bind:value={bungaObligasi}
						placeholder="6.5"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
						min="0.1"
						step="0.1"
						max="100"
						required
					/>
				</div>

				<div class="space-y-2">
					<label for="durasi" class="block text-sm font-medium text-gray-700">
						Durasi (Tahun)
					</label>
					<input
						id="durasi"
						type="number"
						bind:value={durasiObligasi}
						placeholder="5"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
						min="1"
						step="any"
						max="30"
						required
					/>
				</div>

				<div class="md:col-span-3 flex gap-4 justify-center">
					<button
						type="submit"
						class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center shadow-lg hover:shadow-xl"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
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

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
							<div class="text-blue-600 text-sm font-medium">Total Kupon Kotor</div>
							<div id="kupon-kotor-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.summary.totalKuponKotor)}
							</div>
						</div>
						<div class="bg-red-50 p-6 rounded-xl border border-red-100">
							<div class="text-red-600 text-sm font-medium">Total Pajak (10%)</div>
							<div id="pajak-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.summary.totalPajak)}
							</div>
						</div>
						<div class="bg-green-50 p-6 rounded-xl border border-green-100">
							<div class="text-green-600 text-sm font-medium">Total Kupon Bersih</div>
							<div id="kupon-bersih-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.summary.totalKuponBersih)}
							</div>
						</div>
						<div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
							<div class="text-purple-600 text-sm font-medium">Total Pendapatan</div>
							<div id="total-pendapatan-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.summary.totalPendapatan)}
							</div>
							<div class="text-xs text-gray-500 mt-1">Kupon + Pokok</div>
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
							Detail Kupon Bulanan
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
										Kupon Kotor
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Pajak (10%)
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Kupon Bersih
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Total Dana
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
											{formatRupiah(item.kuponKotor)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
											{formatRupiah(item.pajak)}
										</td>
										<td
											class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600"
										>
											{formatRupiah(item.kuponBersih)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-blue-600">
											{formatRupiah(item.totalDana)}
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
					• Simulasi ini menggunakan asumsi pajak obligasi 10% sesuai aturan perpajakan Indonesia
				</li>
				<li>• Kupon dibayarkan setiap bulan dengan jumlah yang sama</li>
				<li>• Total pendapatan sudah termasuk pengembalian pokok investasi</li>
				<li>• Hasil simulasi bersifat ilustratif dan tidak termasuk biaya transaksi</li>
			</ul>
		</div>
	</div>
</div>
