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
							d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
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

			<!-- Placeholder untuk simulasi lainnya -->
			<div class="bg-white rounded-2xl shadow-lg p-8 opacity-50">
				<div class="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-6">
					<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-400 mb-3">Simulasi Saham</h2>
				<p class="text-gray-400 mb-4">
					Segera hadir - Simulasi return investasi saham dan analisis portofolio
				</p>
				<div class="text-gray-400 font-semibold">Coming Soon</div>
			</div>

			<!-- Placeholder untuk simulasi lainnya -->
			<div class="bg-white rounded-2xl shadow-lg p-8 opacity-50">
				<div class="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl mb-6">
					<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
						></path>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
						></path>
					</svg>
				</div>
				<h2 class="text-2xl font-bold text-gray-400 mb-3">Properti</h2>
				<p class="text-gray-400 mb-4">
					Segera hadir - Simulasi investasi properti dan analisis ROI
				</p>
				<div class="text-gray-400 font-semibold">Coming Soon</div>
			</div>
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
