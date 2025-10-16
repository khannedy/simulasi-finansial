<script>
	let pengeluaranBulanan = $state(0);
	let jumlahTanggungan = $state(0);
	let jenisKerja = $state('tetap');
	let danaSaatIni = $state(0);
	let tabunganBulanan = $state(0);
	let hasil = $state(null);

	function hitungDanadarurat() {
		// Validation
		if (pengeluaranBulanan <= 0) {
			alert('Mohon isi pengeluaran bulanan dengan nilai yang valid!');
			return;
		}

		// Base recommendations berdasarkan jenis pekerjaan
		let baseMin, baseIdeal, baseMax;

		if (jenisKerja === 'tetap') {
			baseMin = 3; // 3 bulan
			baseIdeal = 6; // 6 bulan
			baseMax = 6; // 6 bulan
		} else {
			// freelance atau wiraswasta
			baseMin = 6; // 6 bulan
			baseIdeal = 9; // 9 bulan
			baseMax = 12; // 12 bulan
		}

		// Adjustment untuk tanggungan (+1 bulan per tanggungan)
		const adjustedMin = (baseMin + jumlahTanggungan) * pengeluaranBulanan;
		const adjustedIdeal = (baseIdeal + jumlahTanggungan) * pengeluaranBulanan;
		const adjustedMax = (baseMax + jumlahTanggungan) * pengeluaranBulanan;

		// Progress calculation
		const progress = danaSaatIni > 0 ? (danaSaatIni / adjustedIdeal) * 100 : 0;

		// Determine status
		let status = '';
		let statusColor = '';
		if (danaSaatIni >= adjustedIdeal) {
			status = 'Excellent! Dana darurat Anda sudah mencapai target ideal';
			statusColor = 'text-green-600';
		} else if (danaSaatIni >= adjustedMin) {
			status = 'Good! Dana darurat Anda sudah mencapai target minimum';
			statusColor = 'text-yellow-600';
		} else {
			status = 'Perlu ditingkatkan! Dana darurat Anda masih di bawah target minimum';
			statusColor = 'text-red-600';
		}

		// Time simulation (jika ada input tabungan bulanan)
		let waktuSimulasi = null;
		let simulasiBulanan = [];

		if (tabunganBulanan > 0) {
			const sisaMin = Math.max(0, adjustedMin - danaSaatIni);
			const sisaIdeal = Math.max(0, adjustedIdeal - danaSaatIni);
			const sisaMax = Math.max(0, adjustedMax - danaSaatIni);

			const bulanMin = sisaMin > 0 ? Math.ceil(sisaMin / tabunganBulanan) : 0;
			const bulanIdeal = sisaIdeal > 0 ? Math.ceil(sisaIdeal / tabunganBulanan) : 0;
			const bulanMax = sisaMax > 0 ? Math.ceil(sisaMax / tabunganBulanan) : 0;

			// Calculate estimated dates
			const today = new Date();
			const tanggalMin =
				bulanMin > 0 ? new Date(today.setMonth(today.getMonth() + bulanMin)) : null;
			today.setTime(Date.now()); // reset
			const tanggalIdeal =
				bulanIdeal > 0 ? new Date(today.setMonth(today.getMonth() + bulanIdeal)) : null;
			today.setTime(Date.now()); // reset
			const tanggalMax =
				bulanMax > 0 ? new Date(today.setMonth(today.getMonth() + bulanMax)) : null;

			waktuSimulasi = {
				bulanMin,
				bulanIdeal,
				bulanMax,
				tanggalMin,
				tanggalIdeal,
				tanggalMax
			};

			// Generate simulasi per bulan
			let danaAkumulasi = danaSaatIni;
			const maxBulan = Math.min(bulanMax || 120, 120); // Maksimal 120 bulan (10 tahun)

			for (let bulan = 1; bulan <= maxBulan; bulan++) {
				const danaAwalBulan = danaAkumulasi;
				danaAkumulasi += tabunganBulanan;
				const progressMin = (danaAkumulasi / adjustedMin) * 100;
				const progressIdeal = (danaAkumulasi / adjustedIdeal) * 100;
				const progressMax = (danaAkumulasi / adjustedMax) * 100;

				// Determine status
				let status = '';
				let statusClass = '';
				let isMilestone = false;

				if (danaAkumulasi >= adjustedMax) {
					if (bulan === bulanMax) {
						status = 'Target Maksimal Tercapai! ⭐';
						statusClass = 'bg-blue-50 border-blue-300';
						isMilestone = true;
					} else {
						status = 'Maksimal Tercapai';
						statusClass = '';
					}
				} else if (danaAkumulasi >= adjustedIdeal) {
					if (bulan === bulanIdeal) {
						status = 'Target Ideal Tercapai! ✓';
						statusClass = 'bg-green-50 border-green-300';
						isMilestone = true;
					} else {
						status = 'Ideal Tercapai';
						statusClass = '';
					}
				} else if (danaAkumulasi >= adjustedMin) {
					if (bulan === bulanMin) {
						status = 'Target Minimum Tercapai!';
						statusClass = 'bg-yellow-50 border-yellow-300';
						isMilestone = true;
					} else {
						status = 'Minimum Tercapai';
						statusClass = '';
					}
				} else {
					status = 'Belum Tercapai';
					statusClass = '';
				}

				simulasiBulanan.push({
					bulan,
					danaAwal: danaAwalBulan,
					tabungan: tabunganBulanan,
					danaAkhir: danaAkumulasi,
					progressMin: Math.min(progressMin, 100),
					progressIdeal: Math.min(progressIdeal, 100),
					progressMax: Math.min(progressMax, 100),
					status,
					statusClass,
					isMilestone
				});

				// Stop jika sudah mencapai target maksimal
				if (danaAkumulasi >= adjustedMax) {
					break;
				}
			}
		}

		hasil = {
			recommendations: {
				minimum: adjustedMin,
				ideal: adjustedIdeal,
				maksimal: adjustedMax,
				baseMin: baseMin + jumlahTanggungan,
				baseIdeal: baseIdeal + jumlahTanggungan,
				baseMax: baseMax + jumlahTanggungan
			},
			progress: {
				persentase: Math.min(progress, 100),
				status,
				statusColor,
				danaSaatIni
			},
			waktuSimulasi,
			simulasiBulanan,
			jenisKerja,
			pengeluaranBulanan,
			jumlahTanggungan
		};
	}

	function reset() {
		pengeluaranBulanan = 0;
		jumlahTanggungan = 0;
		jenisKerja = 'tetap';
		danaSaatIni = 0;
		tabunganBulanan = 0;
		hasil = null;
	}

	function formatRupiah(angka) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(angka);
	}

	function formatTanggal(date) {
		if (!date) return '';
		return new Intl.DateTimeFormat('id-ID', {
			year: 'numeric',
			month: 'long'
		}).format(date);
	}
</script>

<svelte:head>
	<title>Dana Darurat - Simulasi Finansial</title>
	<meta
		name="description"
		content="Kalkulator dana darurat untuk menentukan berapa dana darurat yang ideal untuk Anda berdasarkan pengeluaran, jenis pekerjaan, dan tanggungan."
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Back to Home Button -->
		<div class="mb-6">
			<a
				href="/"
				class="inline-flex items-center text-green-700 hover:text-green-800 font-medium transition-colors"
			>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					></path>
				</svg>
				Kembali ke Halaman Utama
			</a>
		</div>

		<!-- Header -->
		<div class="text-center mb-12">
			<div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
				<svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
					></path>
				</svg>
			</div>
			<h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Dana Darurat</h1>
			<p class="text-xl text-gray-600 max-w-3xl mx-auto">
				Hitung berapa dana darurat yang ideal untuk Anda berdasarkan pengeluaran bulanan, jenis
				pekerjaan, dan jumlah tanggungan keluarga
			</p>
		</div>

		<!-- Form Section -->
		<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-800 mb-6">Input Data</h2>

			<form on:submit|preventDefault={hitungDanadarurat} class="space-y-6">
				<!-- Pengeluaran Bulanan -->
				<div>
					<label for="pengeluaran-bulanan" class="block text-sm font-medium text-gray-700 mb-2">
						Pengeluaran Bulanan (Rp) <span class="text-red-500">*</span>
					</label>
					<input
						type="number"
						id="pengeluaran-bulanan"
						bind:value={pengeluaranBulanan}
						min="0"
						step="100000"
						required
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
						placeholder="Contoh: 5000000"
					/>
					<p class="mt-1 text-sm text-gray-500">
						Total pengeluaran rutin bulanan Anda (termasuk sewa, makan, transportasi, dll)
					</p>
				</div>

				<!-- Jenis Pekerjaan -->
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-2">
						Jenis Pekerjaan <span class="text-red-500">*</span>
					</label>
					<div class="space-y-3">
						<label class="flex items-center cursor-pointer">
							<input
								type="radio"
								name="jenis-kerja"
								value="tetap"
								bind:group={jenisKerja}
								class="w-4 h-4 text-green-600 focus:ring-green-500"
							/>
							<span class="ml-3">
								<span class="font-medium text-gray-900">Pegawai Tetap</span>
								<span class="block text-sm text-gray-500"
									>Pendapatan tetap dan stabil setiap bulan</span
								>
							</span>
						</label>
						<label class="flex items-center cursor-pointer">
							<input
								type="radio"
								name="jenis-kerja"
								value="freelance"
								bind:group={jenisKerja}
								class="w-4 h-4 text-green-600 focus:ring-green-500"
							/>
							<span class="ml-3">
								<span class="font-medium text-gray-900">Freelance</span>
								<span class="block text-sm text-gray-500">Pendapatan tidak tetap setiap bulan</span>
							</span>
						</label>
						<label class="flex items-center cursor-pointer">
							<input
								type="radio"
								name="jenis-kerja"
								value="wiraswasta"
								bind:group={jenisKerja}
								class="w-4 h-4 text-green-600 focus:ring-green-500"
							/>
							<span class="ml-3">
								<span class="font-medium text-gray-900">Wiraswasta</span>
								<span class="block text-sm text-gray-500">Punya usaha sendiri dengan cash flow variabel</span
								>
							</span>
						</label>
					</div>
				</div>

				<!-- Jumlah Tanggungan -->
				<div>
					<label for="jumlah-tanggungan" class="block text-sm font-medium text-gray-700 mb-2">
						Jumlah Tanggungan Keluarga <span class="text-red-500">*</span>
					</label>
					<input
						type="number"
						id="jumlah-tanggungan"
						bind:value={jumlahTanggungan}
						min="0"
						max="10"
						required
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
						placeholder="Contoh: 3"
					/>
					<p class="mt-1 text-sm text-gray-500">
						Jumlah anggota keluarga yang bergantung pada pendapatan Anda (pasangan, anak, orang
						tua)
					</p>
				</div>

				<!-- Dana Saat Ini -->
				<div>
					<label for="dana-saat-ini" class="block text-sm font-medium text-gray-700 mb-2">
						Dana Darurat Saat Ini (Rp) <span class="text-gray-400">(Opsional)</span>
					</label>
					<input
						type="number"
						id="dana-saat-ini"
						bind:value={danaSaatIni}
						min="0"
						step="100000"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
						placeholder="Contoh: 10000000"
					/>
					<p class="mt-1 text-sm text-gray-500">
						Jumlah dana darurat yang sudah Anda miliki saat ini (kosongkan jika belum ada)
					</p>
				</div>

				<!-- Tabungan Bulanan -->
				<div>
					<label for="tabungan-bulanan" class="block text-sm font-medium text-gray-700 mb-2">
						Tabungan Bulanan untuk Dana Darurat (Rp) <span class="text-gray-400">(Opsional)</span>
					</label>
					<input
						type="number"
						id="tabungan-bulanan"
						bind:value={tabunganBulanan}
						min="0"
						step="100000"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
						placeholder="Contoh: 1000000"
					/>
					<p class="mt-1 text-sm text-gray-500">
						Berapa yang bisa Anda sisihkan setiap bulan? Kami akan hitung berapa lama mencapai target
					</p>
				</div>

				<!-- Buttons -->
				<div class="flex gap-4">
					<button
						type="submit"
						class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
					>
						Hitung Dana Darurat
					</button>
					<button
						type="button"
						on:click={reset}
						class="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg transition-colors duration-200"
					>
						Reset
					</button>
				</div>
			</form>
		</div>

		<!-- Results Section -->
		{#if hasil}
			<!-- Status & Progress -->
			<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-gray-800 mb-6">Status Dana Darurat Anda</h2>

				<!-- Status Text -->
				<div class="mb-6">
					<p class="text-lg {hasil.progress.statusColor} font-semibold mb-2">
						{hasil.progress.status}
					</p>
					<p class="text-gray-600">
						Dana Anda saat ini: <span class="font-bold text-gray-800"
							>{formatRupiah(hasil.progress.danaSaatIni)}</span>
					</p>
				</div>

				<!-- Progress Bar -->
				<div class="mb-4">
					<div class="flex justify-between items-center mb-2">
						<span class="text-sm font-medium text-gray-700">Progress ke Target Ideal</span>
						<span class="text-sm font-bold text-green-600"
							>{hasil.progress.persentase.toFixed(1)}%</span
						>
					</div>
					<div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
						<div
							class="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-500"
							style="width: {Math.min(hasil.progress.persentase, 100)}%"
						></div>
					</div>
				</div>
			</div>

			<!-- Recommendations -->
			<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
				<h2 class="text-2xl font-bold text-gray-800 mb-6">Rekomendasi Dana Darurat</h2>

				<div class="grid md:grid-cols-3 gap-6">
					<!-- Minimum -->
					<div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border-2 border-yellow-300">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-lg font-bold text-gray-800">Minimum</h3>
							<svg class="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
									clip-rule="evenodd"
								></path>
							</svg>
						</div>
						<p class="text-3xl font-bold text-yellow-700 mb-2" id="minimum-amount">
							{formatRupiah(hasil.recommendations.minimum)}
						</p>
						<p class="text-sm text-gray-600">
							{hasil.recommendations.baseMin} bulan pengeluaran
						</p>
						<p class="text-xs text-gray-500 mt-2">Target minimum untuk keamanan dasar</p>
					</div>

					<!-- Ideal -->
					<div class="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl border-2 border-green-400">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-lg font-bold text-gray-800">Ideal</h3>
							<svg class="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path>
							</svg>
						</div>
						<p class="text-3xl font-bold text-green-700 mb-2" id="ideal-amount">
							{formatRupiah(hasil.recommendations.ideal)}
						</p>
						<p class="text-sm text-gray-600">
							{hasil.recommendations.baseIdeal} bulan pengeluaran
						</p>
						<p class="text-xs text-gray-500 mt-2">Target yang direkomendasikan</p>
					</div>

					<!-- Maksimal -->
					<div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-300">
						<div class="flex items-center justify-between mb-3">
							<h3 class="text-lg font-bold text-gray-800">Maksimal</h3>
							<svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
								></path>
							</svg>
						</div>
						<p class="text-3xl font-bold text-blue-700 mb-2" id="maksimal-amount">
							{formatRupiah(hasil.recommendations.maksimal)}
						</p>
						<p class="text-sm text-gray-600">
							{hasil.recommendations.baseMax} bulan pengeluaran
						</p>
						<p class="text-xs text-gray-500 mt-2">Target optimal untuk perlindungan maksimal</p>
					</div>
				</div>

				<!-- Explanation -->
				<div class="mt-6 bg-gray-50 p-4 rounded-lg">
					<p class="text-sm text-gray-700 leading-relaxed">
						<strong>Catatan:</strong>
						{#if jenisKerja === 'tetap'}
							Sebagai pegawai tetap dengan pendapatan stabil, Anda memerlukan dana darurat 3-6 bulan
							pengeluaran.
						{:else}
							Sebagai {jenisKerja} dengan pendapatan tidak tetap, Anda memerlukan dana darurat 6-12
							bulan pengeluaran untuk perlindungan lebih baik.
						{/if}
						{#if jumlahTanggungan > 0}
							Dengan {jumlahTanggungan} tanggungan, setiap tanggungan menambah 1 bulan ke target dana
							darurat Anda.
						{/if}
					</p>
				</div>
			</div>

			<!-- Time Simulation -->
			{#if hasil.waktuSimulasi && tabunganBulanan > 0}
				<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
					<h2 class="text-2xl font-bold text-gray-800 mb-6">Simulasi Waktu Pencapaian</h2>

					<p class="text-gray-600 mb-6">
						Dengan menabung <span class="font-bold text-green-600"
							>{formatRupiah(tabunganBulanan)}</span> setiap bulan, berikut estimasi waktu untuk mencapai
						target:
					</p>

					<div class="space-y-4">
						<!-- Minimum -->
						{#if hasil.waktuSimulasi.bulanMin > 0}
							<div class="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200" id="waktu-minimum">
								<div class="flex-1">
									<p class="font-semibold text-gray-800">Target Minimum</p>
									<p class="text-sm text-gray-600">
										{formatRupiah(hasil.recommendations.minimum)}
									</p>
								</div>
								<div class="text-right">
									<p class="text-2xl font-bold text-yellow-700">
										{hasil.waktuSimulasi.bulanMin}
										{hasil.waktuSimulasi.bulanMin === 1 ? 'bulan' : 'bulan'}
									</p>
									<p class="text-sm text-gray-600">
										~{formatTanggal(hasil.waktuSimulasi.tanggalMin)}
									</p>
								</div>
							</div>
						{:else}
							<div class="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
								<div class="flex-1">
									<p class="font-semibold text-gray-800">Target Minimum</p>
									<p class="text-sm text-gray-600">
										{formatRupiah(hasil.recommendations.minimum)}
									</p>
								</div>
								<div class="text-right">
									<p class="text-lg font-bold text-green-700">✓ Tercapai!</p>
								</div>
							</div>
						{/if}

						<!-- Ideal -->
						{#if hasil.waktuSimulasi.bulanIdeal > 0}
							<div class="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200" id="waktu-ideal">
								<div class="flex-1">
									<p class="font-semibold text-gray-800">Target Ideal</p>
									<p class="text-sm text-gray-600">
										{formatRupiah(hasil.recommendations.ideal)}
									</p>
								</div>
								<div class="text-right">
									<p class="text-2xl font-bold text-green-700">
										{hasil.waktuSimulasi.bulanIdeal}
										{hasil.waktuSimulasi.bulanIdeal === 1 ? 'bulan' : 'bulan'}
									</p>
									<p class="text-sm text-gray-600">
										~{formatTanggal(hasil.waktuSimulasi.tanggalIdeal)}
									</p>
								</div>
							</div>
						{:else}
							<div class="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
								<div class="flex-1">
									<p class="font-semibold text-gray-800">Target Ideal</p>
									<p class="text-sm text-gray-600">
										{formatRupiah(hasil.recommendations.ideal)}
									</p>
								</div>
								<div class="text-right">
									<p class="text-lg font-bold text-green-700">✓ Tercapai!</p>
								</div>
							</div>
						{/if}

						<!-- Maksimal -->
						{#if hasil.waktuSimulasi.bulanMax > 0}
							<div class="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200" id="waktu-maksimal">
								<div class="flex-1">
									<p class="font-semibold text-gray-800">Target Maksimal</p>
									<p class="text-sm text-gray-600">
										{formatRupiah(hasil.recommendations.maksimal)}
									</p>
								</div>
								<div class="text-right">
									<p class="text-2xl font-bold text-blue-700">
										{hasil.waktuSimulasi.bulanMax}
										{hasil.waktuSimulasi.bulanMax === 1 ? 'bulan' : 'bulan'}
									</p>
									<p class="text-sm text-gray-600">
										~{formatTanggal(hasil.waktuSimulasi.tanggalMax)}
									</p>
								</div>
							</div>
						{:else}
							<div class="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
								<div class="flex-1">
									<p class="font-semibold text-gray-800">Target Maksimal</p>
									<p class="text-sm text-gray-600">
										{formatRupiah(hasil.recommendations.maksimal)}
									</p>
								</div>
								<div class="text-right">
									<p class="text-lg font-bold text-green-700">✓ Tercapai!</p>
								</div>
							</div>
						{/if}
					</div>
				</div>
			{/if}

			<!-- Detail Simulasi Per Bulan -->
			{#if hasil.simulasiBulanan && hasil.simulasiBulanan.length > 0}
				<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
					<h2 class="text-2xl font-bold text-gray-800 mb-6">Detail Simulasi Per Bulan</h2>

					<p class="text-gray-600 mb-6">
						Berikut adalah proyeksi dana darurat Anda bulan ke bulan dengan tabungan <span
							class="font-bold text-green-600">{formatRupiah(tabunganBulanan)}</span
						> setiap bulan:
					</p>

					<!-- Table -->
					<div class="overflow-x-auto">
						<table class="w-full border-collapse">
							<thead class="bg-gray-50 sticky top-0">
								<tr>
									<th
										class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200"
									>
										Bulan
									</th>
									<th
										class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200"
									>
										Dana Awal
									</th>
									<th
										class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200"
									>
										Tabungan
									</th>
									<th
										class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200"
									>
										Dana Akhir
									</th>
									<th
										class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200"
									>
										Progress
									</th>
									<th
										class="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200"
									>
										Status
									</th>
								</tr>
							</thead>
							<tbody>
								{#each hasil.simulasiBulanan as row, index}
									<tr
										class="hover:bg-gray-50 transition-colors {row.statusClass} {row.isMilestone
											? 'border-2 font-semibold'
											: 'border-b border-gray-100'}"
									>
										<td class="px-4 py-3 text-sm text-gray-900">
											Bulan {row.bulan}
											{#if row.isMilestone}
												<span class="ml-1 text-xs"
													>{row.status.includes('Minimum')
														? '🟡'
														: row.status.includes('Ideal')
															? '✅'
															: '⭐'}</span
												>
											{/if}
										</td>
										<td class="px-4 py-3 text-sm text-right text-gray-700 tabular-nums">
											{formatRupiah(row.danaAwal)}
										</td>
										<td
											class="px-4 py-3 text-sm text-right text-green-600 font-medium tabular-nums"
										>
											+{formatRupiah(row.tabungan)}
										</td>
										<td
											class="px-4 py-3 text-sm text-right text-gray-900 font-semibold tabular-nums"
										>
											{formatRupiah(row.danaAkhir)}
										</td>
										<td class="px-4 py-3 text-sm text-right tabular-nums">
											<div class="flex items-center justify-end gap-2">
												<div class="w-16 bg-gray-200 rounded-full h-2">
													<div
														class="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
														style="width: {row.progressIdeal}%"
													></div>
												</div>
												<span class="text-xs font-medium text-gray-600"
													>{row.progressIdeal.toFixed(0)}%</span
												>
											</div>
										</td>
										<td class="px-4 py-3 text-xs text-center">
											<span
												class="inline-block px-2 py-1 rounded-full {row.status.includes(
													'Maksimal Tercapai'
												)
													? 'bg-blue-100 text-blue-800'
													: row.status.includes('Ideal Tercapai')
														? 'bg-green-100 text-green-800'
														: row.status.includes('Minimum Tercapai')
															? 'bg-yellow-100 text-yellow-800'
															: 'bg-gray-100 text-gray-700'}"
											>
												{row.status}
											</span>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Legend -->
					<div class="mt-6 flex flex-wrap gap-4 text-sm">
						<div class="flex items-center gap-2">
							<div class="w-4 h-4 bg-yellow-50 border-2 border-yellow-300 rounded"></div>
							<span class="text-gray-600">Target Minimum Tercapai (🟡)</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-4 h-4 bg-green-50 border-2 border-green-300 rounded"></div>
							<span class="text-gray-600">Target Ideal Tercapai (✅)</span>
						</div>
						<div class="flex items-center gap-2">
							<div class="w-4 h-4 bg-blue-50 border-2 border-blue-300 rounded"></div>
							<span class="text-gray-600">Target Maksimal Tercapai (⭐)</span>
						</div>
					</div>
				</div>
			{/if}
		{/if}

		<!-- Educational Content -->
		<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
			<h2 class="text-2xl font-bold text-gray-800 mb-6">Apa itu Dana Darurat?</h2>

			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Definisi</h3>
					<p class="text-gray-600 leading-relaxed">
						Dana darurat adalah sejumlah uang yang disisihkan khusus untuk menghadapi keadaan darurat
						atau kejadian tak terduga seperti kehilangan pekerjaan, sakit mendadak, kecelakaan, atau
						kerusakan kendaraan/rumah yang memerlukan perbaikan segera.
					</p>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Mengapa Penting?</h3>
					<ul class="space-y-2 text-gray-600">
						<li class="flex items-start">
							<svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span>Melindungi dari krisis finansial saat kehilangan pendapatan</span>
						</li>
						<li class="flex items-start">
							<svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span>Menghindari utang berbunga tinggi (kartu kredit, pinjaman online)</span>
						</li>
						<li class="flex items-start">
							<svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span>Memberikan ketenangan pikiran dan mengurangi stress finansial</span>
						</li>
						<li class="flex items-start">
							<svg class="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
								<path
									fill-rule="evenodd"
									d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clip-rule="evenodd"
								></path>
							</svg>
							<span>Melindungi investasi jangka panjang dari pencairan dini</span>
						</li>
					</ul>
				</div>

				<div>
					<h3 class="text-lg font-semibold text-gray-800 mb-2">Tips Membangun Dana Darurat</h3>
					<ul class="space-y-2 text-gray-600">
						<li class="flex items-start">
							<span class="font-bold text-green-600 mr-2">1.</span>
							<span
								><strong>Prioritaskan</strong> - Bangun dana darurat sebelum investasi lain</span
							>
						</li>
						<li class="flex items-start">
							<span class="font-bold text-green-600 mr-2">2.</span>
							<span
								><strong>Otomatis</strong> - Set auto-transfer ke rekening terpisah setiap gajian</span
							>
						</li>
						<li class="flex items-start">
							<span class="font-bold text-green-600 mr-2">3.</span>
							<span
								><strong>Mulai kecil</strong> - Tidak harus langsung penuh, mulai dengan 10-20% dari
								target</span
							>
						</li>
						<li class="flex items-start">
							<span class="font-bold text-green-600 mr-2">4.</span>
							<span
								><strong>Pisahkan</strong> - Simpan di rekening terpisah agar tidak tergoda
								menggunakannya</span
							>
						</li>
						<li class="flex items-start">
							<span class="font-bold text-green-600 mr-2">5.</span>
							<span
								><strong>Review berkala</strong> - Sesuaikan jumlah saat ada kenaikan pengeluaran atau
								tanggungan</span
							>
						</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- Important Notes -->
		<div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
			<h3 class="text-lg font-bold text-blue-900 mb-3 flex items-center">
				<svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
						clip-rule="evenodd"
					></path>
				</svg>
				Catatan Penting
			</h3>
			<ul class="space-y-2 text-blue-900">
				<li class="flex items-start">
					<span class="mr-2">•</span>
					<span
						>Simpan dana darurat di instrumen yang <strong>mudah dicairkan</strong> (likuid) seperti
						tabungan atau deposito jangka pendek (max 3 bulan)</span
					>
				</li>
				<li class="flex items-start">
					<span class="mr-2">•</span>
					<span
						><strong>Jangan</strong> investasikan dana darurat di instrumen berisiko seperti saham, reksa
						dana saham, atau kripto</span
					>
				</li>
				<li class="flex items-start">
					<span class="mr-2">•</span>
					<span
						>Dana darurat berbeda dengan <strong>tabungan tujuan</strong> (liburan, gadget, dll) - ini
						khusus untuk <strong>keadaan darurat</strong></span
					>
				</li>
				<li class="flex items-start">
					<span class="mr-2">•</span>
					<span
						>Review dan sesuaikan target saat ada perubahan kondisi (naik gaji, tambah tanggungan,
						pindah kerja)</span
					>
				</li>
				<li class="flex items-start">
					<span class="mr-2">•</span>
					<span>Hasil simulasi bersifat perkiraan dan bukan nasihat finansial profesional</span>
				</li>
			</ul>
		</div>

		<!-- Back to Home Button (Bottom) -->
		<div class="text-center">
			<a
				href="/"
				class="inline-flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
			>
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					></path>
				</svg>
				Kembali ke Halaman Utama
			</a>
		</div>
	</div>
</div>
