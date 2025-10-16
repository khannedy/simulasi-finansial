# Simulasi Finansial

Platform simulasi dan perencanaan keuangan berbasis web untuk pengguna Indonesia. Aplikasi ini membantu individu membuat keputusan finansial yang lebih baik melalui simulasi interaktif untuk berbagai skenario investasi dan perhitungan keuangan Islam (Zakat).

## Fitur Utama

### 1. Simulasi Obligasi
Kalkulator untuk menghitung pembayaran kupon bulanan, pajak, dan total pendapatan dari investasi obligasi.
- Input: Saldo obligasi, tingkat bunga tahunan, durasi investasi
- Perhitungan: Kupon bulanan bruto, pajak 10%, kupon bersih
- Output: Tabel per bulan dan ringkasan kartu

### 2. Kalkulator Zakat Mal
Kalkulator Zakat (zakat harta) dengan rate 2.5% untuk berbagai jenis aset.
- Input fleksibel: Tambah berbagai jenis aset secara dinamis
- Dua mode input: Nilai langsung atau Harga × Jumlah
- Threshold Nisab: 85 juta IDR (setara 85g emas)
- Manajemen daftar aset dinamis (tambah/hapus item)
- Perhitungan otomatis dan penentuan status Zakat

### 3. Perencanaan Pensiun
Simulasi perencanaan dana pensiun menggunakan model matematis.
- Dua tipe simulasi:
  1. Dana Habis di Akhir Periode
  2. Modal Tetap (Hidup dari Bunga)
- Input: Target dana tahunan, durasi, tingkat bunga
- Algoritma binary search untuk menemukan dana awal optimal
- Opsional: Perhitungan Zakat 2.5% tahunan
- Breakdown komprehensif per tahun

### 4. Investasi Berkala
Kalkulator pertumbuhan investasi bulanan reguler dengan bunga majemuk.
- Input: Dana awal (opsional), investasi bulanan, durasi, tingkat bunga tahunan
- Bunga majemuk dihitung bulanan
- Perhitungan Zakat untuk dana yang dipegang ≥1 tahun
- Tracking detail per bulan
- Ringkasan visual dengan 6 metrik kunci

### Coming Soon
- Simulasi Saham (Stock Investment)
- Properti (Real Estate Investment)

## Tech Stack

- **Framework:** SvelteKit 2.22.0 (Svelte 5.0.0)
- **Build Tool:** Vite 7.0.4
- **Styling:** Tailwind CSS 3.4.0
- **Testing:** Playwright 1.49.1
- **Code Quality:** ESLint 9.18.0, Prettier 3.4.2
- **Package Manager:** Bun
- **Runtime:** Bun (JavaScript runtime)

## Prerequisites

- [Bun](https://bun.sh) v1.0 atau lebih tinggi

## Installation

```sh
# Clone repository
git clone <repository-url>
cd simulasi-finansial

# Install dependencies dengan bun
bun install
```

## Development

Jalankan development server:

```sh
bun run dev

# atau buka aplikasi langsung di browser
bun run dev -- --open
```

Server akan berjalan di `http://localhost:5173`

## Building

Untuk membuat production build:

```sh
bun run build
```

Preview production build:

```sh
bun run preview
```

## Testing

Jalankan end-to-end tests dengan Playwright:

```sh
# Run semua tests dengan 3x retry
bun run test

# Run tests tanpa retry
bun run test:e2e
```

## Code Quality

```sh
# Check code formatting dan linting
bun run lint

# Auto-format code
bun run format
```

## Project Structure

```
simulasi-finansial/
├── src/
│   ├── routes/                     # SvelteKit file-based routing
│   │   ├── +layout.svelte          # Root layout component
│   │   ├── +page.svelte            # Home page
│   │   ├── obligasi/               # Simulasi Obligasi
│   │   ├── zakat-mal/              # Kalkulator Zakat Mal
│   │   ├── perencanaan-pensiun/    # Perencanaan Pensiun
│   │   └── investasi-berkala/      # Investasi Berkala
│   ├── lib/                        # Shared libraries
│   ├── app.html                    # HTML template
│   └── app.css                     # Global styles (Tailwind)
├── e2e/                            # End-to-end tests
│   ├── investasi-berkala.test.js
│   ├── zakat-mal.test.js
│   ├── obligasi.test.js
│   └── perencanaan-pensiun.test.js
├── svelte.config.js                # SvelteKit configuration
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── playwright.config.js            # Playwright test configuration
└── package.json                    # Dependencies and scripts
```

## Key Features

- **Indonesian-Focused:** Aturan pajak Indonesia (10%), perhitungan Zakat (2.5%), mata uang IDR
- **Privacy-Friendly:** Semua perhitungan dilakukan di sisi klien, tidak ada pengumpulan data
- **Client-Side Only:** Tidak memerlukan backend atau database
- **Responsive Design:** Mobile-first dengan Tailwind CSS
- **Well-Tested:** Comprehensive E2E tests dengan Playwright
- **Accessible:** ARIA labels, semantic HTML, desain responsif

## Architecture Highlights

- File-based routing (SvelteKit)
- Svelte 5 reactivity dengan `$state()` dan `$effect()`
- Pure client-side calculations
- Tidak ada state management eksternal (Svelte reactivity murni)
- Setiap simulasi self-contained di route-nya sendiri

## Scripts Available

```sh
bun run dev          # Start development server
bun run build        # Build untuk production
bun run preview      # Preview production build
bun run lint         # Check code quality
bun run format       # Auto-format code
bun run test         # Run E2E tests dengan retry
bun run test:e2e     # Run E2E tests tanpa retry
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Add your license here]

## Contact

[Add your contact information here]