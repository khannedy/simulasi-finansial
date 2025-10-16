<svelte:head>
	<title>Simulasi Finansial - Kalkulator Investasi Indonesia</title>
	<meta
		name="description"
		content="Platform simulasi keuangan dan investasi untuk membantu perencanaan finansial Anda"
	/>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-12">
			<h1 class="text-5xl font-bold text-gray-800 mb-4">Simulasi Finansial</h1>
			<p class="text-gray-600 text-xl max-w-2xl mx-auto">
				Platform simulasi keuangan dan investasi untuk membantu Anda membuat keputusan finansial
				yang lebih baik
			</p>
		</div>

		<!-- Features Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<!-- Dana Darurat Card -->
			<a
				href="/dana-darurat"
				class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 group"
			>
				<div
					class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6 group-hover:bg-green-200 transition-colors"
				>
					<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-800 mb-3">Dana Darurat</h2>
				<p class="text-gray-600 mb-4">
					Hitung berapa dana darurat ideal yang Anda butuhkan berdasarkan pengeluaran, pekerjaan, dan tanggungan keluarga
				</p>
				<div class="flex items-center text-green-600 font-semibold group-hover:text-green-700">
					Mulai Hitung
					<svg
						class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</a>

			<!-- Obligasi Card -->
			<a
				href="/obligasi"
				class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 group"
			>
				<div
					class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-xl mb-6 group-hover:bg-blue-200 transition-colors"
				>
					<svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-800 mb-3">Simulasi Obligasi</h2>
				<p class="text-gray-600 mb-4">
					Hitung perkiraan kupon bulanan, pajak obligasi, dan total pendapatan dari investasi
					obligasi Anda
				</p>
				<div class="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
					Mulai Simulasi
					<svg
						class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</a>

			<!-- Zakat Mal Card -->
			<a
				href="/zakat-mal"
				class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 group"
			>
				<div
					class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-xl mb-6 group-hover:bg-green-200 transition-colors"
				>
					<svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-800 mb-3">Kalkulator Zakat Mal</h2>
				<p class="text-gray-600 mb-4">
					Hitung zakat mal 2,5% dari berbagai jenis harta dengan input harga emas yang dapat disesuaikan untuk perhitungan nisab akurat
				</p>
				<div class="flex items-center text-green-600 font-semibold group-hover:text-green-700">
					Mulai Hitung Zakat
					<svg
						class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</a>

			<!-- Perencanaan Pensiun Card -->
			<a
				href="/perencanaan-pensiun"
				class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 group"
			>
				<div
					class="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-xl mb-6 group-hover:bg-purple-200 transition-colors"
				>
					<svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l3-1m-3 1l-3-1"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-800 mb-3">Perencanaan Pensiun</h2>
				<p class="text-gray-600 mb-4">
					Simulasi dana pensiun dengan rumus anuitas dan dua tipe perencanaan: dana habis atau modal tetap
				</p>
				<div class="flex items-center text-purple-600 font-semibold group-hover:text-purple-700">
					Mulai Perencanaan
					<svg
						class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</a>

			<!-- Investasi Berkala Card -->
			<a
				href="/investasi-berkala"
				class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 group"
			>
				<div
					class="flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-xl mb-6 group-hover:bg-emerald-200 transition-colors"
				>
					<svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-800 mb-3">Investasi Berkala</h2>
				<p class="text-gray-600 mb-4">
					Simulasi pertumbuhan dana dari investasi rutin bulanan dengan compound interest
				</p>
				<div class="flex items-center text-emerald-600 font-semibold group-hover:text-emerald-700">
					Mulai Simulasi
					<svg
						class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</a>

			<!-- Simulasi KPR Card -->
			<a
				href="/simulasi-kpr"
				class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 group"
			>
				<div
					class="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-xl mb-6 group-hover:bg-indigo-200 transition-colors"
				>
					<svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-800 mb-3">Simulasi KPR</h2>
				<p class="text-gray-600 mb-4">
					Hitung cicilan bulanan KPR dengan berbagai skenario DP, tenor, dan suku bunga
				</p>
				<div class="flex items-center text-indigo-600 font-semibold group-hover:text-indigo-700">
					Mulai Simulasi
					<svg
						class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</a>

			<!-- Simulasi KKB Card -->
			<a
				href="/simulasi-kkb"
				class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 group"
			>
				<div
					class="flex items-center justify-center w-16 h-16 bg-teal-100 rounded-xl mb-6 group-hover:bg-teal-200 transition-colors"
				>
					<svg class="w-8 h-8 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-800 mb-3">Simulasi KKB</h2>
				<p class="text-gray-600 mb-4">
					Hitung cicilan bulanan kredit kendaraan bermotor dengan berbagai skenario DP, tenor, dan suku bunga
				</p>
				<div class="flex items-center text-teal-600 font-semibold group-hover:text-teal-700">
					Mulai Simulasi
					<svg
						class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</a>

			<!-- Investasi Properti Card -->
			<a
				href="/investasi-properti"
				class="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 group"
			>
				<div
					class="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-xl mb-6 group-hover:bg-amber-200 transition-colors"
				>
					<svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-800 mb-3">Investasi Properti</h2>
				<p class="text-gray-600 mb-4">
					Simulasi investasi properti untuk disewakan dengan perhitungan capital gain dan rental income
				</p>
				<div class="flex items-center text-amber-600 font-semibold group-hover:text-amber-700">
					Mulai Simulasi
					<svg
						class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"
						></path>
					</svg>
				</div>
			</a>
		</div>

		<!-- Info Section -->
		<div class="mt-16 bg-white rounded-2xl shadow-lg p-8">
			<div class="text-center">
				<h2 class="text-3xl font-bold text-gray-800 mb-4">Mengapa Simulasi Finansial?</h2>
				<p class="text-gray-600 text-lg max-w-3xl mx-auto mb-8">
					Keputusan investasi yang tepat membutuhkan perhitungan yang akurat. Platform kami
					menyediakan simulasi yang mudah dipahami untuk membantu Anda merencanakan masa depan
					finansial.
				</p>

				<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div class="text-center">
						<div
							class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-6 h-6 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								></path>
							</svg>
						</div>
						<h3 class="font-semibold text-gray-800 mb-2">Perhitungan Akurat</h3>
						<p class="text-gray-600 text-sm">
							Menggunakan formula standar industri dan aturan perpajakan Indonesia
						</p>
					</div>

					<div class="text-center">
						<div
							class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-6 h-6 text-blue-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								></path>
							</svg>
						</div>
						<h3 class="font-semibold text-gray-800 mb-2">Mudah Digunakan</h3>
						<p class="text-gray-600 text-sm">
							Interface yang intuitif dan hasil yang mudah dipahami
						</p>
					</div>

					<div class="text-center">
						<div
							class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-6 h-6 text-purple-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
								></path>
							</svg>
						</div>
						<h3 class="font-semibold text-gray-800 mb-2">100% Gratis</h3>
						<p class="text-gray-600 text-sm">
							Tidak ada biaya tersembunyi, semua simulasi gratis untuk digunakan
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
