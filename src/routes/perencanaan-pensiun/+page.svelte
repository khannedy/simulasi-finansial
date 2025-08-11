<script>
	let targetDanaTahunan = $state(0);
	let durasiPensiun = $state(0);
	let tingkatSukuBunga = $state(6); // Default 6% per tahun
	let tipeSimulasi = $state('habis'); // 'habis' atau 'modal-tetap'
	let hasil = $state(null);
	let tipeSimulasiSebelumnya = $state('habis'); // Track tipe simulasi sebelumnya

	// Konstanta zakat
	const TARIF_ZAKAT = 0.025; // 2.5%

	// Reactive statement: kosongkan hasil saat tipe simulasi berubah
	$effect(() => {
		if (tipeSimulasi !== tipeSimulasiSebelumnya && hasil !== null) {
			hasil = null;
		}
		tipeSimulasiSebelumnya = tipeSimulasi;
	});

	function hitungPerencanaanPensiun() {
		if (targetDanaTahunan <= 0 || durasiPensiun <= 0 || tingkatSukuBunga <= 0) {
			alert('Mohon isi semua field dengan nilai yang valid!');
			return;
		}

		const r = tingkatSukuBunga / 100; // Convert percentage to decimal
		const n = durasiPensiun;
		const NISAB = 85000000; // 85 juta

		if (tipeSimulasi === 'habis') {
			// TIPE 1: Dana habis di akhir periode
			hasil = simulasiDanaHabis(r, n, NISAB);
		} else {
			// TIPE 2: Modal tetap, hidup dari bunga
			hasil = simulasiModalTetap(r, n, NISAB);
		}
	}

	function simulasiDanaHabis(r, n, NISAB) {
		// Pendekatan iteratif: cari dana awal yang cukup untuk bertahan sampai akhir periode
		// Mulai dengan estimasi menggunakan rumus anuitas, lalu sesuaikan
		let estimasiDanaAwal = targetDanaTahunan * ((1 - Math.pow(1 + r, -n)) / r);
		
		// Fungsi untuk simulasi dengan dana awal tertentu
		function simulasiDenganDanaAwal(danaAwal) {
			const simulasi = [];
			let sisaDana = danaAwal;
			let totalZakat = 0;
			let berhasil = true;

			for (let tahun = 1; tahun <= n; tahun++) {
				// Zakat dihitung dari sisa dana di awal tahun (sebelum penarikan)
				const zakatDibayar = sisaDana >= NISAB ? sisaDana * TARIF_ZAKAT : 0;
				
				// Total penarikan = dana hidup + zakat
				const totalPenarikan = targetDanaTahunan + zakatDibayar;
				totalZakat += zakatDibayar;

				// Cek apakah dana mencukupi
				if (sisaDana < totalPenarikan) {
					berhasil = false;
					break;
				}

				// Sisa dana setelah penarikan
				sisaDana = sisaDana - totalPenarikan;

				// Bunga yang diperoleh dari sisa dana
				const bungaDiperoleh = sisaDana > 0 ? sisaDana * r : 0;
				sisaDana += bungaDiperoleh;

				simulasi.push({
					tahun,
					sisaDanaAwal: sisaDana + totalPenarikan - bungaDiperoleh,
					danaDigunakan: targetDanaTahunan,
					zakatDibayar,
					totalPenarikan,
					bungaDiperoleh,
					sisaDanaAkhir: sisaDana,
					kenaZakat: sisaDana + totalPenarikan - bungaDiperoleh >= NISAB
				});
			}

			return { simulasi, totalZakat, berhasil, sisaDanaAkhir: sisaDana };
		}

		// Binary search untuk menemukan dana awal yang optimal
		let danaAwalMin = estimasiDanaAwal;
		let danaAwalMax = estimasiDanaAwal * 3; // Maksimal 3x estimasi
		let danaAwalOptimal = estimasiDanaAwal;
		let simulasiOptimal = null;
		let totalZakatOptimal = 0;

		// Pastikan estimasi minimal bisa berhasil
		while (!simulasiDenganDanaAwal(danaAwalMax).berhasil && danaAwalMax < estimasiDanaAwal * 10) {
			danaAwalMax *= 1.5;
		}

		// Binary search untuk mencari dana minimal yang bisa bertahan sampai akhir
		for (let iterasi = 0; iterasi < 20; iterasi++) {
			const danaAwalTest = (danaAwalMin + danaAwalMax) / 2;
			const hasil = simulasiDenganDanaAwal(danaAwalTest);

			if (hasil.berhasil) {
				// Berhasil, coba dengan dana yang lebih kecil
				danaAwalOptimal = danaAwalTest;
				simulasiOptimal = hasil.simulasi;
				totalZakatOptimal = hasil.totalZakat;
				danaAwalMax = danaAwalTest;
			} else {
				// Gagal, butuh dana yang lebih besar
				danaAwalMin = danaAwalTest;
			}

			// Jika selisih sudah kecil, berhenti
			if (Math.abs(danaAwalMax - danaAwalMin) < 1000000) { // Selisih 1 juta
				break;
			}
		}

		// Jika masih belum optimal, ambil yang aman
		if (!simulasiOptimal) {
			const hasilAman = simulasiDenganDanaAwal(danaAwalMax);
			danaAwalOptimal = danaAwalMax;
			simulasiOptimal = hasilAman.simulasi;
			totalZakatOptimal = hasilAman.totalZakat;
		}

		// Hitung estimasi dana tanpa zakat (untuk perbandingan)
		const faktorAnnuitas = (1 - Math.pow(1 + r, -n)) / r;
		const danaDiperlukanTanpaZakat = targetDanaTahunan * faktorAnnuitas;

		// Hitung rata-rata zakat tahunan
		const rataRataZakatTahunan = totalZakatOptimal / n;

		return {
			tipeSimulasi: 'Dana Habis di Akhir Periode',
			inputData: {
				targetDanaTahunan,
				durasiPensiun,
				tingkatSukuBunga,
				tipeSimulasi
			},
			perhitungan: {
				danaDiperlukanTanpaZakat,
				estimasiTambahanUntukZakat: danaAwalOptimal - danaDiperlukanTanpaZakat,
				totalDanaDiperlukan: danaAwalOptimal,
				totalZakatSelamaPensiun: totalZakatOptimal,
				rataRataZakatTahunan,
				faktorAnnuitas
			},
			simulasiTahunan: simulasiOptimal
		};
	}

	function simulasiModalTetap(r, n, NISAB) {
		// TIPE 2: Modal tetap, hidup dari bunga saja
		// Cari modal yang bunganya cukup untuk menutupi target dana + zakat

		function hitungDenganModal(modalAwal) {
			const simulasi = [];
			let sisaDana = modalAwal;
			let totalZakat = 0;
			let berhasil = true;

			for (let tahun = 1; tahun <= n; tahun++) {
				// Hitung bunga dari modal
				const bungaDiperoleh = sisaDana * r;
				
				// Zakat dihitung dari total dana (modal + bunga yang belum diambil)
				const totalDanaSebelumPenarikan = sisaDana + bungaDiperoleh;
				const zakatDibayar = totalDanaSebelumPenarikan >= NISAB ? totalDanaSebelumPenarikan * TARIF_ZAKAT : 0;
				
				// Total penarikan = dana hidup + zakat
				const totalPenarikan = targetDanaTahunan + zakatDibayar;
				totalZakat += zakatDibayar;

				// Cek apakah bunga mencukupi untuk penarikan
				if (bungaDiperoleh < totalPenarikan) {
					berhasil = false;
					break;
				}

				// Modal tetap, hanya ambil dari bunga
				const sisaBunga = bungaDiperoleh - totalPenarikan;
				// Sisa bunga ditambahkan ke modal untuk tahun depan
				sisaDana = modalAwal + sisaBunga;

				simulasi.push({
					tahun,
					sisaDanaAwal: modalAwal,
					modalTetap: modalAwal,
					bungaDiperoleh: bungaDiperoleh,
					danaDigunakan: targetDanaTahunan,
					zakatDibayar,
					totalPenarikan,
					sisaBunga: sisaBunga,
					sisaDanaAkhir: sisaDana,
					kenaZakat: totalDanaSebelumPenarikan >= NISAB
				});
			}

			return { simulasi, totalZakat, berhasil };
		}

		// Binary search untuk mencari modal minimal yang cukup
		let modalMin = targetDanaTahunan / r; // Minimal untuk bunga = target dana
		let modalMax = modalMin * 10; // Maksimal 10x
		let modalOptimal = modalMin;
		let simulasiOptimal = null;
		let totalZakatOptimal = 0;

		// Pastikan estimasi maksimal bisa berhasil
		while (!hitungDenganModal(modalMax).berhasil && modalMax < modalMin * 50) {
			modalMax *= 2;
		}

		// Binary search untuk mencari modal minimal yang cukup
		for (let iterasi = 0; iterasi < 25; iterasi++) {
			const modalTest = (modalMin + modalMax) / 2;
			const hasil = hitungDenganModal(modalTest);

			if (hasil.berhasil) {
				// Berhasil, coba dengan modal yang lebih kecil
				modalOptimal = modalTest;
				simulasiOptimal = hasil.simulasi;
				totalZakatOptimal = hasil.totalZakat;
				modalMax = modalTest;
			} else {
				// Gagal, butuh modal yang lebih besar
				modalMin = modalTest;
			}

			// Jika selisih sudah kecil, berhenti
			if (Math.abs(modalMax - modalMin) < 1000000) { // Selisih 1 juta
				break;
			}
		}

		// Jika masih belum optimal, ambil yang aman
		if (!simulasiOptimal) {
			const hasilAman = hitungDenganModal(modalMax);
			modalOptimal = modalMax;
			simulasiOptimal = hasilAman.simulasi;
			totalZakatOptimal = hasilAman.totalZakat;
		}

		// Hitung rata-rata zakat tahunan
		const rataRataZakatTahunan = totalZakatOptimal / n;

		return {
			tipeSimulasi: 'Modal Tetap (Hidup dari Bunga)',
			inputData: {
				targetDanaTahunan,
				durasiPensiun,
				tingkatSukuBunga,
				tipeSimulasi
			},
			perhitungan: {
				modalDiperlukan: modalOptimal,
				bungaRataRataTahunan: modalOptimal * r,
				totalDanaDiperlukan: modalOptimal,
				totalZakatSelamaPensiun: totalZakatOptimal,
				rataRataZakatTahunan,
				efisiensiModal: `${((modalOptimal * r - targetDanaTahunan) / (modalOptimal * r) * 100).toFixed(1)}%`
			},
			simulasiTahunan: simulasiOptimal
		};
	}

	function resetForm() {
		targetDanaTahunan = 0;
		durasiPensiun = 0;
		tingkatSukuBunga = 6;
		tipeSimulasi = 'habis';
		tipeSimulasiSebelumnya = 'habis';
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

	function formatPersen(value) {
		return `${value.toFixed(2)}%`;
	}
</script>

<svelte:head>
	<title>Perencanaan Pensiun - Simulasi Finansial</title>
	<meta name="description" content="Simulasi perencanaan dana pensiun dengan rumus anuitas dan perhitungan zakat 2,5%" />
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-4xl font-bold text-gray-800 mb-2">Perencanaan Pensiun</h1>
			<p class="text-gray-600 text-lg">
				Simulasi dana pensiun dengan rumus anuitas dan perhitungan zakat 2,5% per tahun
			</p>
		</div>

		<!-- Form Input -->
		<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
			<h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
				<svg
					class="w-6 h-6 mr-2 text-purple-600"
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
				Parameter Perencanaan Pensiun
			</h2>

			<form onsubmit={(e) => { e.preventDefault(); hitungPerencanaanPensiun(); }} class="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div class="space-y-2">
					<label for="target-dana" class="block text-sm font-medium text-gray-700">
						Target Dana Tahunan (Rp)
					</label>
					<input
						id="target-dana"
						type="number"
						bind:value={targetDanaTahunan}
						placeholder="120000000"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-lg"
						min="1"
						step="any"
						required
					/>
					<p class="text-xs text-gray-500">Dana yang ingin diterima setiap tahun saat pensiun</p>
				</div>

				<div class="space-y-2">
					<label for="durasi" class="block text-sm font-medium text-gray-700">
						Durasi Pensiun (Tahun)
					</label>
					<input
						id="durasi"
						type="number"
						bind:value={durasiPensiun}
						placeholder="25"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-lg"
						min="1"
						step="1"
						max="50"
						required
					/>
					<p class="text-xs text-gray-500">Berapa lama masa pensiun (misal: 25 tahun)</p>
				</div>

				<div class="space-y-2">
					<label for="suku-bunga" class="block text-sm font-medium text-gray-700">
						Tingkat Suku Bunga (% per tahun)
					</label>
					<input
						id="suku-bunga"
						type="number"
						bind:value={tingkatSukuBunga}
						placeholder="6"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors text-lg"
						min="0.1"
						step="0.1"
						max="20"
						required
					/>
					<p class="text-xs text-gray-500">Asumsi return investasi per tahun</p>
				</div>

				<div class="md:col-span-3 space-y-4">
					<fieldset class="space-y-2">
						<legend class="block text-sm font-medium text-gray-700">
							Tipe Simulasi
						</legend>
						<div class="flex gap-4">
							<label class="flex items-center">
								<input
									type="radio"
									bind:group={tipeSimulasi}
									value="habis"
									class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
								/>
								<span class="ml-2 text-sm text-gray-700">Dana Habis di Akhir Periode</span>
							</label>
							<label class="flex items-center">
								<input
									type="radio"
									bind:group={tipeSimulasi}
									value="modal-tetap"
									class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
								/>
								<span class="ml-2 text-sm text-gray-700">Modal Tetap (Hidup dari Bunga)</span>
							</label>
						</div>
						<p class="text-xs text-gray-500">
							Pilih strategi: dana habis di akhir vs modal tetap selamanya
						</p>
					</fieldset>
				</div>

				<div class="md:col-span-3 flex gap-4 justify-center">
					<button
						type="submit"
						class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center shadow-lg hover:shadow-xl"
					>
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							></path>
						</svg>
						Hitung Perencanaan
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
						Ringkasan Perencanaan Dana Pensiun
					</h2>

					<!-- Tipe Simulasi Badge -->
					<div class="mb-4">
						<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
							{hasil.tipeSimulasi}
						</span>
					</div>

					{#if tipeSimulasi === 'habis'}
						<!-- Summary untuk Dana Habis -->
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
								<div class="text-purple-600 text-sm font-medium">Total Dana Diperlukan</div>
								<div id="total-dana-diperlukan-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
									{formatRupiah(hasil.perhitungan.totalDanaDiperlukan)}
								</div>
								<div class="text-xs text-gray-500 mt-1">Dana + Estimasi Zakat</div>
							</div>
							<div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
								<div class="text-blue-600 text-sm font-medium">Dana Pensiun Murni</div>
								<div id="dana-pensiun-murni-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
									{formatRupiah(hasil.perhitungan.danaDiperlukanTanpaZakat || 0)}
								</div>
								<div class="text-xs text-gray-500 mt-1">Tanpa zakat</div>
							</div>
							<div class="bg-orange-50 p-6 rounded-xl border border-orange-100">
								<div class="text-orange-600 text-sm font-medium">Total Zakat</div>
								<div id="total-zakat-pensiun-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
									{formatRupiah(hasil.perhitungan.totalZakatSelamaPensiun)}
								</div>
								<div class="text-xs text-gray-500 mt-1">Selama {hasil.inputData.durasiPensiun} tahun</div>
							</div>
							<div class="bg-green-50 p-6 rounded-xl border border-green-100">
								<div class="text-green-600 text-sm font-medium">Rata-rata Zakat/Tahun</div>
								<div id="rata-zakat-tahunan-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
									{formatRupiah(hasil.perhitungan.rataRataZakatTahunan)}
								</div>
								<div class="text-xs text-gray-500 mt-1">2.5% dari harta</div>
							</div>
						</div>
					{:else}
						<!-- Summary untuk Modal Tetap -->
						<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
								<div class="text-purple-600 text-sm font-medium">Modal Diperlukan</div>
								<div id="modal-diperlukan-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
									{formatRupiah(hasil.perhitungan.modalDiperlukan || hasil.perhitungan.totalDanaDiperlukan)}
								</div>
								<div class="text-xs text-gray-500 mt-1">Modal tetap selamanya</div>
							</div>
							<div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
								<div class="text-blue-600 text-sm font-medium">Bunga Tahunan</div>
								<div id="bunga-tahunan-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
									{formatRupiah(hasil.perhitungan.bungaRataRataTahunan || 0)}
								</div>
								<div class="text-xs text-gray-500 mt-1">Return per tahun</div>
							</div>
							<div class="bg-orange-50 p-6 rounded-xl border border-orange-100">
								<div class="text-orange-600 text-sm font-medium">Total Zakat</div>
								<div id="total-zakat-modal-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
									{formatRupiah(hasil.perhitungan.totalZakatSelamaPensiun)}
								</div>
								<div class="text-xs text-gray-500 mt-1">Selama {hasil.inputData.durasiPensiun} tahun</div>
							</div>
							<div class="bg-green-50 p-6 rounded-xl border border-green-100">
								<div class="text-green-600 text-sm font-medium">Rata-rata Zakat/Tahun</div>
								<div id="rata-zakat-modal-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
									{formatRupiah(hasil.perhitungan.rataRataZakatTahunan)}
								</div>
								<div class="text-xs text-gray-500 mt-1">2.5% dari harta</div>
							</div>
						</div>
					{/if}

					<!-- Additional Info -->
					<div class="mt-6 p-4 bg-gray-50 rounded-lg">
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
							<div>
								<span class="font-medium text-gray-700">Target Dana Tahunan:</span>
								<span class="text-gray-600 ml-2">{formatRupiah(hasil.inputData.targetDanaTahunan)}</span>
							</div>
							<div>
								<span class="font-medium text-gray-700">Durasi Pensiun:</span>
								<span class="text-gray-600 ml-2">{hasil.inputData.durasiPensiun} tahun</span>
							</div>
							<div>
								<span class="font-medium text-gray-700">Suku Bunga:</span>
								<span class="text-gray-600 ml-2">{formatPersen(hasil.inputData.tingkatSukuBunga)}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Detail Simulasi Tahunan -->
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
							Simulasi Tahunan
						</h2>
					</div>

					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-gray-50">
								<tr>
									<th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Tahun
									</th>
									{#if tipeSimulasi === 'modal-tetap'}
										<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Modal Tetap
										</th>
										<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Bunga Diperoleh
										</th>
									{:else}
										<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Sisa Dana Awal
										</th>
									{/if}
									<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Dana Digunakan
									</th>
									<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Zakat Dibayar
									</th>
									<th class="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
										Status Zakat
									</th>
									<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Total Penarikan
									</th>
									{#if tipeSimulasi === 'modal-tetap'}
										<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Sisa Bunga
										</th>
									{:else}
										<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
											Bunga Diperoleh
										</th>
									{/if}
									<th class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
										Sisa Dana Akhir
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each hasil.simulasiTahunan as item, index (item.tahun)}
									<tr class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											Tahun {item.tahun}
										</td>
										{#if tipeSimulasi === 'modal-tetap'}
											<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-purple-600 font-medium">
												{formatRupiah(item.modalTetap || item.sisaDanaAwal)}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
												{formatRupiah(item.bungaDiperoleh)}
											</td>
										{:else}
											<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
												{formatRupiah(item.sisaDanaAwal)}
											</td>
										{/if}
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
											{formatRupiah(item.danaDigunakan)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-orange-600">
											{formatRupiah(item.zakatDibayar)}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-center">
											{#if item.kenaZakat}
												<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
													Wajib
												</span>
											{:else}
												<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
													Tidak Wajib
												</span>
											{/if}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-medium">
											{formatRupiah(item.totalPenarikan)}
										</td>
										{#if tipeSimulasi === 'modal-tetap'}
											<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-indigo-600">
												{formatRupiah(item.sisaBunga || 0)}
											</td>
										{:else}
											<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
												{formatRupiah(item.bungaDiperoleh)}
											</td>
										{/if}
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium {item.sisaDanaAkhir > 0 ? 'text-green-600' : 'text-red-600'}">
											{formatRupiah(item.sisaDanaAkhir)}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}

		<!-- Penjelasan Rumus -->
		<div class="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
			<h3 class="text-lg font-semibold text-blue-800 mb-3 flex items-center">
				<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					></path>
				</svg>
				Penjelasan Rumus dan Asumsi
			</h3>
			<div class="text-blue-700 text-sm space-y-2">
				<p>
					<strong>Metode Simulasi Iteratif:</strong> Mencari dana awal optimal yang dapat bertahan hingga akhir periode pensiun.
				</p>
				<ul class="list-disc list-inside space-y-1 ml-4">
					<li>Dimulai dengan estimasi rumus anuitas sebagai baseline</li>
					<li>Menggunakan binary search untuk menemukan dana minimal yang cukup</li>
					<li>Memperhitungkan zakat 2.5% dari total harta setiap tahun</li>
					<li>Memastikan dana tidak habis sebelum periode berakhir</li>
					<li>Bunga/return investasi ditambahkan setiap tahun</li>
				</ul>
				<p>
					<strong>Perhitungan Zakat:</strong> 2.5% dari total harta (sisa dana) jika mencapai nisab 85 juta rupiah.
				</p>
			</div>
		</div>

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
				<li>• Simulasi ini menggunakan metode iteratif dengan asumsi suku bunga tetap</li>
				<li>• Zakat 2.5% dihitung dari total harta (sisa dana) yang dimiliki, bukan dari penghasilan</li>
				<li>• Zakat hanya wajib jika total harta mencapai nisab (85 juta rupiah setara 85 gram emas)</li>
				<li>• Dana dihitung agar dapat bertahan hingga akhir periode tanpa deficit</li>
				<li>• Inflasi belum diperhitungkan dalam simulasi ini</li>
				<li>• Asumsi return investasi konstan setiap tahun (dalam praktik bisa berfluktuasi)</li>
				<li>• Konsultasikan dengan perencana keuangan untuk perencanaan yang lebih detail</li>
				<li>• Konsultasikan dengan ustadz/kyai untuk perhitungan zakat yang lebih akurat</li>
			</ul>
		</div>
	</div>
</div>
