<script>
	let hartaList = $state([
		{
			id: 1,
			nama: '',
			jenisInput: 'nilai_langsung', // 'nilai_langsung' atau 'harga_satuan'
			hargaSatuan: 0,
			jumlah: 0,
			nilaiTotal: 0
		}
	]);

	let hasil = $state(null);
	let nextId = $state(2);
	let hargaEmasPerGram = $state(1000000); // Default harga emas per gram

	// Nisab dalam rupiah (setara 85 gram emas)
	const NISAB_GRAM_EMAS = 85;
	const TARIF_ZAKAT = 0.025; // 2.5%

	function tambahHarta() {
		hartaList = [
			...hartaList,
			{
				id: nextId++,
				nama: '',
				jenisInput: 'nilai_langsung',
				hargaSatuan: 0,
				jumlah: 0,
				nilaiTotal: 0
			}
		];
	}

	function hapusHarta(id) {
		hartaList = hartaList.filter((harta) => harta.id !== id);
	}

	function updateNilaiTotal(harta) {
		if (harta.jenisInput === 'harga_satuan') {
			const harga = Number(harta.hargaSatuan) || 0;
			const jumlah = Number(harta.jumlah) || 0;
			harta.nilaiTotal = harga * jumlah;
		}
		// Untuk nilai_langsung, nilaiTotal sudah diinput langsung oleh user
	}

	function hitungZakat() {
		// Validasi harga emas
		if (!hargaEmasPerGram || hargaEmasPerGram <= 0) {
			alert('Mohon isi harga emas per gram dengan nilai yang valid!');
			return;
		}

		// Update semua nilai total terlebih dahulu
		hartaList.forEach((harta) => updateNilaiTotal(harta));

		// Validasi input
		const hartaValid = hartaList.filter(
			(harta) => harta.nama.trim() !== '' && harta.nilaiTotal > 0
		);

		if (hartaValid.length === 0) {
			alert('Mohon tambahkan minimal satu jenis harta dengan nilai yang valid!');
			return;
		}

		// Hitung total harta
		const totalHarta = hartaValid.reduce((total, harta) => total + harta.nilaiTotal, 0);

		// Hitung nisab berdasarkan harga emas saat ini
		const nisabRupiah = NISAB_GRAM_EMAS * hargaEmasPerGram;

		// Cek apakah mencapai nisab
		const mencapaiNisab = totalHarta >= nisabRupiah;

		// Hitung zakat
		const jumlahZakat = mencapaiNisab ? totalHarta * TARIF_ZAKAT : 0;

		hasil = {
			hartaValid,
			totalHarta,
			nisab: nisabRupiah,
			hargaEmas: hargaEmasPerGram,
			mencapaiNisab,
			jumlahZakat,
			persentaseZakat: TARIF_ZAKAT * 100
		};
	}

	function resetForm() {
		hartaList = [
			{
				id: 1,
				nama: '',
				jenisInput: 'nilai_langsung',
				hargaSatuan: 0,
				jumlah: 0,
				nilaiTotal: 0
			}
		];
		hargaEmasPerGram = 1000000; // Reset ke default
		hasil = null;
		nextId = 2;
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
	<title>Kalkulator Zakat Mal - Simulasi Finansial</title>
	<meta
		name="description"
		content="Hitung zakat mal 2,5% dari berbagai jenis harta secara mudah dan akurat"
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8 px-4">
	<div class="max-w-6xl mx-auto">
		<!-- Back to Home Button -->
		<div class="mb-6">
			<a
				href="/"
				class="inline-flex items-center text-gray-700 hover:text-green-600 transition-colors duration-200 group"
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
			<h1 class="text-4xl font-bold text-gray-800 mb-2">Kalkulator Zakat Mal</h1>
			<p class="text-gray-600 text-lg">
				Hitung zakat mal 2,5% dari berbagai jenis harta dengan mudah dan akurat
			</p>
		</div>

		<!-- Input Harga Emas -->
		<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
			<h2 class="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
				<svg
					class="w-6 h-6 mr-2 text-yellow-600"
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
				Harga Emas Saat Ini
			</h2>

			<div class="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
				<div class="space-y-2">
					<label for="harga-emas" class="block text-sm font-medium text-gray-700">
						Harga Emas per Gram (Rp)
					</label>
					<input
						id="harga-emas"
						type="number"
						bind:value={hargaEmasPerGram}
						placeholder="1000000"
						class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors text-lg"
						min="1"
						step="any"
						required
					/>
					<p class="text-sm text-gray-600">
						Nisab zakat mal = 85 gram emas = {formatRupiah(NISAB_GRAM_EMAS * hargaEmasPerGram)}
					</p>
				</div>
			</div>
		</div>

		<!-- Form Input Harta -->
		<div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
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
						d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
					></path>
				</svg>
				Daftar Harta
			</h2>

			{#each hartaList as harta, index (harta.id)}
				<div class="bg-gray-50 rounded-xl p-6 mb-4 border border-gray-200">
					<div class="flex justify-between items-center mb-4">
						<h3 class="font-medium text-gray-800">Harta #{index + 1}</h3>
						{#if hartaList.length > 1}
							<button
								type="button"
								onclick={() => hapusHarta(harta.id)}
								class="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
								title="Hapus harta"
								aria-label="Hapus harta #{index + 1}"
							>
								<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									></path>
								</svg>
							</button>
						{/if}
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						<!-- Nama Harta -->
						<div class="space-y-2">
							<label for="nama-harta-{index}" class="block text-sm font-medium text-gray-700"> Nama Harta </label>
							<input
								id="nama-harta-{index}"
								type="text"
								bind:value={harta.nama}
								placeholder="Contoh: Emas, Tabungan, Investasi"
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
							/>
						</div>

						<!-- Jenis Input -->
						<div class="space-y-2">
							<label for="jenis-input-{index}" class="block text-sm font-medium text-gray-700"> Jenis Input </label>
							<select
								id="jenis-input-{index}"
								bind:value={harta.jenisInput}
								class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
							>
								<option value="nilai_langsung">Nilai Langsung</option>
								<option value="harga_satuan">Harga × Jumlah</option>
							</select>
						</div>

						{#if harta.jenisInput === 'harga_satuan'}
							<!-- Harga Satuan -->
							<div class="space-y-2">
								<label for="harga-satuan-{index}" class="block text-sm font-medium text-gray-700"> Harga Satuan (Rp) </label>
								<input
									id="harga-satuan-{index}"
									type="number"
									bind:value={harta.hargaSatuan}
									oninput={() => updateNilaiTotal(harta)}
									placeholder="1000000"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
									min="0"
									step="any"
								/>
							</div>

							<!-- Jumlah -->
							<div class="space-y-2">
								<label for="jumlah-{index}" class="block text-sm font-medium text-gray-700"> Jumlah </label>
								<input
									id="jumlah-{index}"
									type="number"
									bind:value={harta.jumlah}
									oninput={() => updateNilaiTotal(harta)}
									placeholder="10"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
									min="0"
									step="any"
								/>
							</div>
						{:else}
							<!-- Nilai Total (untuk input langsung) -->
							<div class="space-y-2 md:col-span-2">
								<label for="nilai-total-{index}" class="block text-sm font-medium text-gray-700"> Nilai Total (Rp) </label>
								<input
									id="nilai-total-{index}"
									type="number"
									bind:value={harta.nilaiTotal}
									placeholder="10000000"
									class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
									min="0"
									step="any"
								/>
							</div>
						{/if}
					</div>

					{#if harta.jenisInput === 'harga_satuan' && harta.hargaSatuan > 0 && harta.jumlah > 0}
						<div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
							<div class="text-sm text-green-700">
								<strong>Nilai Total: {formatRupiah(harta.nilaiTotal)}</strong>
							</div>
						</div>
					{/if}
				</div>
			{/each}

			<div class="flex gap-4 justify-center mt-6">
				<button
					type="button"
					onclick={tambahHarta}
					class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"
						></path>
					</svg>
					Tambah Harta
				</button>
				<button
					type="button"
					onclick={hitungZakat}
					class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center shadow-lg hover:shadow-xl"
				>
					<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
						></path>
					</svg>
					Hitung Zakat
				</button>
				<button
					type="button"
					onclick={resetForm}
					class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
				>
					Reset
				</button>
			</div>
		</div>

		<!-- Hasil Perhitungan -->
		{#if hasil}
			<div class="space-y-8">
				<!-- Status Nisab -->
				<div class="bg-white rounded-2xl shadow-xl p-8">
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
								d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
							></path>
						</svg>
						Status Kewajiban Zakat
					</h2>

					<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div class="bg-blue-50 p-6 rounded-xl border border-blue-100">
							<div class="text-blue-600 text-sm font-medium">Total Harta</div>
							<div id="total-harta-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.totalHarta)}
							</div>
						</div>
						<div class="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
							<div class="text-yellow-600 text-sm font-medium">Nisab (85 gram emas)</div>
							<div id="nisab-amount" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{formatRupiah(hasil.nisab)}
							</div>
						</div>
						<div
							class={`p-6 rounded-xl border ${hasil.mencapaiNisab ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}
						>
							<div
								class={`text-sm font-medium ${hasil.mencapaiNisab ? 'text-green-600' : 'text-red-600'}`}
							>
								Status Zakat
							</div>
							<div id="status-zakat" class="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 mt-1 break-words leading-tight">
								{hasil.mencapaiNisab ? 'Wajib' : 'Belum Wajib'}
							</div>
						</div>
					</div>

					{#if hasil.mencapaiNisab}
						<div class="mt-6 p-6 bg-green-50 border border-green-200 rounded-xl">
							<div class="flex items-center justify-between">
								<div>
									<div class="text-green-600 text-sm font-medium">
										Jumlah Zakat yang Wajib Dibayar (2,5%)
									</div>
									<div id="jumlah-zakat-amount" class="text-3xl font-bold text-green-700 mt-1">
										{formatRupiah(hasil.jumlahZakat)}
									</div>
								</div>
								<div class="text-6xl text-green-200">
									<svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
										<path
											d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
										/>
									</svg>
								</div>
							</div>
						</div>
					{:else}
						<div class="mt-6 p-6 bg-gray-50 border border-gray-200 rounded-xl">
							<div class="flex items-center justify-center text-gray-500">
								<svg class="w-12 h-12 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									></path>
								</svg>
								<div>
									<div class="text-lg font-medium">Zakat Belum Wajib</div>
									<div class="text-sm">Total harta belum mencapai nisab minimum</div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Detail Harta -->
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
									d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 4h6m-6 2h6m-3 3h3m-3 2h3"
								></path>
							</svg>
							Detail Harta
						</h2>
					</div>

					<div class="overflow-x-auto">
						<table class="w-full">
							<thead class="bg-gray-50">
								<tr>
									<th
										class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Nama Harta
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Nilai Total
									</th>
									<th
										class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
									>
										Zakat (2,5%)
									</th>
								</tr>
							</thead>
							<tbody class="bg-white divide-y divide-gray-200">
								{#each hasil.hartaValid as harta, index (harta.id)}
									<tr class={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
										<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
											{harta.nama}
										</td>
										<td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
											{formatRupiah(harta.nilaiTotal)}
										</td>
										<td
											class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600"
										>
											{hasil.mencapaiNisab ? formatRupiah(harta.nilaiTotal * TARIF_ZAKAT) : '-'}
										</td>
									</tr>
								{/each}
								<tr class="bg-green-50 font-bold">
									<td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
										TOTAL
									</td>
									<td
										class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-gray-900"
									>
										{formatRupiah(hasil.totalHarta)}
									</td>
									<td
										class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-600"
									>
										{formatRupiah(hasil.jumlahZakat)}
									</td>
								</tr>
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
				<li>• Zakat mal wajib dibayar jika total harta mencapai nisab (setara 85 gram emas)</li>
				<li>• Tarif zakat mal adalah 2,5% dari total harta yang dizakati</li>
				<li>• Nisab dihitung berdasarkan harga emas saat ini, pastikan mengisi harga emas terkini</li>
				<li>• Harta harus dimiliki selama 1 tahun (haul) untuk wajib zakat</li>
				<li>• Konsultasikan dengan ustadz/kyai untuk detail perhitungan yang lebih akurat</li>
			</ul>
		</div>
	</div>
</div>
