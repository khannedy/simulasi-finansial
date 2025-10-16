# Rencana Pengembangan Fitur - Simulasi Finansial

## Fitur yang Sudah Ada

1. **Simulasi Obligasi** - Kalkulator kupon bulanan dengan perhitungan pajak
2. **Kalkulator Zakat Mal** - Kalkulator zakat harta dengan harga emas dinamis
3. **Perencanaan Pensiun** - Simulasi dana pensiun dengan 2 strategi (dana habis vs modal tetap)
4. **Investasi Berkala** - Kalkulator pertumbuhan investasi bulanan dengan bunga majemuk
5. **Simulasi KPR** - Kalkulator cicilan rumah dengan metode anuitas
6. **Simulasi KKB** - Kalkulator cicilan kendaraan dengan metode anuitas
7. **Investasi Properti** - Simulasi investasi properti untuk disewakan dengan capital gain dan rental income

---

## Rekomendasi Fitur Baru

### Prioritas Tinggi (High Priority)

#### 1. Dana Darurat (Emergency Fund Calculator)

**Kenapa penting**: Fondasi perencanaan keuangan yang sering diabaikan oleh masyarakat Indonesia. Dana darurat adalah prioritas pertama sebelum berinvestasi.

**Input:**
- Pengeluaran bulanan (Rp)
- Jumlah tanggungan keluarga (0-10)
- Jenis pekerjaan (Tetap/Freelance/Wiraswasta)
- Dana darurat saat ini (Rp) - opsional

**Perhitungan:**
- Pegawai tetap: 3-6 bulan pengeluaran
- Freelance/Wiraswasta: 6-12 bulan pengeluaran
- Adjustment berdasarkan tanggungan (+1 bulan per tanggungan)
- Simulasi: Berapa lama mencapai target dengan tabungan bulanan

**Output:**
- Rekomendasi dana darurat minimum
- Rekomendasi dana darurat ideal
- Target dana darurat maksimal
- Kalkulator: Input tabungan bulanan → berapa lama mencapai target
- Progress tracker: Dana saat ini vs target

**Color scheme**: green (stability, safety)

---

#### 2. Tabungan Pendidikan Anak

**Kenapa penting**: Biaya pendidikan di Indonesia meningkat 10-15% per tahun, jauh di atas inflasi umum. Orang tua perlu mempersiapkan jauh-jauh hari.

**Input:**
- Usia anak saat ini (0-18 tahun)
- Target pendidikan (TK, SD, SMP, SMA, Kulitas S1 Negeri/Swasta)
- Biaya pendidikan saat ini (atau gunakan database estimasi)
- Inflasi pendidikan per tahun (%) - default 12%
- Dana saat ini (Rp) - opsional
- Return investasi tahunan (%) - default 8%

**Perhitungan:**
- Future value dengan inflasi: FV = PV × (1 + inflasi)^tahun
- Waktu sampai masuk sekolah = target usia - usia sekarang
- PMT (tabungan bulanan) untuk mencapai target dengan compound interest
- Breakdown: berapa dari tabungan vs hasil investasi

**Output:**
- Biaya pendidikan saat ini
- Proyeksi biaya saat anak masuk sekolah
- Rekomendasi tabungan per bulan
- Simulasi dengan berbagai return (konservatif 6%, moderat 8%, agresif 12%)
- Timeline visual per tahun

**Database estimasi biaya** (opsional):
- TK Swasta: Rp 3-10 juta/tahun
- SD Swasta: Rp 10-30 juta/tahun
- SMP Swasta: Rp 15-40 juta/tahun
- SMA Swasta: Rp 20-50 juta/tahun
- Kuliah Negeri: Rp 5-15 juta/tahun
- Kuliah Swasta: Rp 20-60 juta/tahun

**Color scheme**: blue (education, trust)

---

#### 3. Kalkulator Deposito

**Kenapa penting**: Deposito adalah instrumen investasi paling populer di Indonesia karena aman, mudah, dan dijamin LPS hingga Rp 2 miliar.

**Input:**
- Dana awal (Rp)
- Suku bunga per tahun (%) - biasanya 3-6%
- Tenor (bulan): 1, 3, 6, 12, 24
- Perpanjangan otomatis (ARO): Ya/Tidak
- Jika ARO, jumlah perpanjangan (1-10x)

**Perhitungan:**
- Bunga per bulan = (dana × bunga_tahunan / 12)
- Pajak bunga = 20% dari bunga (untuk bunga > Rp 240k/bulan)
- Bunga bersih = bunga - pajak
- Total dana akhir tenor = dana awal + total bunga bersih
- Jika ARO: compound untuk periode berikutnya

**Output:**
- Bunga per bulan (bruto)
- Pajak per bulan
- Bunga per bulan (neto)
- Total bunga neto per tenor
- Dana akhir tenor
- Tabel breakdown per bulan
- Jika ARO: Proyeksi untuk semua periode perpanjangan
- Effective yield (%)

**Catatan:**
- Pajak 20% final (untuk individu)
- Bunga di bawah Rp 7.5 juta/tahun tidak kena pajak (update sesuai aturan terbaru)
- Deposito < Rp 1 juta biasanya tidak tersedia

**Color scheme**: teal/cyan (stability, trust, banking)

---

#### 4. Investasi Emas

**Kenapa penting**: Emas adalah safe haven dan hedge terhadap inflasi. Sangat populer di Indonesia untuk investasi jangka panjang.

**Input:**
- Harga beli emas per gram (Rp) - bisa fetch dari API atau input manual
- Jumlah gram
- Biaya beli (%) - spread Antam ~3-5%, pegadaian ~2-3%
- Target investasi (tahun)
- Asumsi kenaikan harga emas per tahun (%) - historis ~8-10%
- Tipe penyimpanan:
  - Emas fisik (biaya keamanan 0.5-1% per tahun)
  - Tabungan emas (biaya admin ~Rp 30k/bulan)
  - Emas digital (biaya 0-0.5%)

**Perhitungan:**
- Total investasi awal = (harga × gram) × (1 + biaya_beli)
- Proyeksi harga emas = harga_beli × (1 + kenaikan)^tahun
- Nilai emas masa depan = proyeksi_harga × gram
- Biaya jual (%) - spread ~2-5%
- Nilai jual bersih = nilai emas × (1 - biaya_jual)
- Biaya penyimpanan total (jika fisik atau tabungan)
- Keuntungan bersih = nilai jual - investasi awal - biaya penyimpanan
- ROI = (keuntungan / investasi awal) × 100%

**Output:**
- Total investasi awal (termasuk spread beli)
- Proyeksi nilai emas di masa depan
- Estimasi nilai jual bersih (setelah spread jual)
- Total keuntungan/rugi
- ROI (%)
- Breakdown biaya per tahun
- Perbandingan 3 tipe penyimpanan dalam tabel
- Grafik proyeksi nilai emas

**Catatan:**
- Harga emas Antam sebagai referensi
- Spread beli-jual cukup besar (4-8%)
- Tidak ada return seperti investasi lain (no cash flow)
- Cocok untuk long-term (minimal 3-5 tahun)

**Color scheme**: yellow/amber (gold, precious)

---

### Prioritas Menengah (Medium Priority)

#### 5. Simulasi Kartu Kredit & Pelunasan Utang

**Kenapa penting**: Banyak masyarakat Indonesia terjebat debt cycle karena bunga kartu kredit yang sangat tinggi (2-3% per bulan = 24-36% per tahun).

**Input:**
- Total utang kartu kredit (Rp)
- Bunga per bulan (%) - default 2.5%
- Minimum payment (%) - default 10% dari total utang
- Pembayaran bulanan yang mampu dilakukan (Rp)
- Opsi: Ada tambahan utang baru per bulan? (Rp)

**Perhitungan:**
- Skenario 1: Bayar minimum → berapa lama lunas? (bisa never!)
- Skenario 2: Bayar custom amount → berapa lama lunas?
- Skenario 3: Bayar full amount → bebas bunga
- Total bunga yang dibayar
- Breakdown per bulan: utang, bunga, pembayaran, sisa

**Output:**
- Durasi pelunasan (bulan/tahun)
- Total bunga yang akan dibayar
- Total pembayaran (pokok + bunga)
- Tabel simulasi per bulan
- Warning: Jika bayar minimum saja → butuh X tahun + bayar Y juta bunga!
- Rekomendasi: Berapa minimal harus bayar per bulan untuk lunas dalam 1-2 tahun

**Bonus - Strategi Pelunasan Multi Kartu:**
- Input: Beberapa kartu kredit dengan utang & bunga berbeda
- Strategi debt avalanche (bayar bunga tertinggi dulu)
- Strategi debt snowball (bayar utang terkecil dulu)
- Perbandingan kedua strategi

**Color scheme**: red (warning, debt, danger)

---

#### 6. Reksa Dana

**Kenapa penting**: Investasi reksa dana mudah, terjangkau (mulai Rp 10k), dan dikelola profesional. Cocok untuk pemula.

**Input:**
- Investasi awal (Rp) - opsional, bisa 0
- Investasi rutin per bulan (Rp)
- Jenis reksa dana:
  - Pasar Uang (return 3-5%, risk: sangat rendah)
  - Pendapatan Tetap (return 5-8%, risk: rendah)
  - Campuran (return 7-12%, risk: menengah)
  - Saham (return 10-20%, risk: tinggi)
- Return tahunan (%) - auto-fill based on jenis, bisa di-adjust
- Durasi investasi (tahun)
- Biaya:
  - Subscription fee (%) - 0-1%
  - Management fee (% per tahun) - 0.5-2%
  - Redemption fee (%) - 0-2%

**Perhitungan:**
- Future value dengan contribution compound interest
- Total investasi = investasi awal + (bulanan × jumlah bulan)
- Total biaya management = rata-rata NAV × management_fee × tahun
- Nilai investasi akhir = FV - biaya - redemption_fee
- Total return = nilai akhir - total investasi
- ROI = (return / total investasi) × 100%

**Output:**
- Total dana yang diinvestasikan
- Proyeksi nilai investasi di masa depan
- Total return investasi
- ROI (%)
- Breakdown biaya (subscription, management, redemption)
- Tabel proyeksi per tahun
- Perbandingan 4 jenis reksa dana dalam satu chart

**Catatan:**
- Return bersifat tidak tetap (volatile)
- Past performance bukan jaminan future result
- Reksa dana saham cocok untuk jangka panjang (>5 tahun)
- Reksa dana pasar uang cocok untuk jangka pendek (<1 tahun)

**Color scheme**: purple (investment, growth)

---

#### 7. Target Tabungan (Goal-Based Savings)

**Kenapa penting**: Membantu visualisasi dan motivasi untuk mencapai target finansial spesifik seperti DP rumah, umroh, gadget, liburan, dll.

**Input:**
- Nama target (text) - misal "DP Rumah", "Umroh", "iPhone", "Liburan ke Jepang"
- Target dana yang dibutuhkan (Rp)
- Target waktu (bulan/tahun)
- Dana yang sudah ada (Rp) - opsional
- Opsi investasi:
  - Tabungan biasa (0% return)
  - Deposito (3-6% return)
  - Reksa dana (5-15% return)
- Return tahunan jika pilih investasi (%)

**Perhitungan:**
- Dana yang masih dibutuhkan = target - dana_sekarang
- Jika tabungan biasa: tabungan per bulan = dana_dibutuhkan / waktu (bulan)
- Jika investasi: gunakan PMT formula dengan compound interest
- Timeline mencapai target

**Output:**
- Visualisasi progress bar (dana sekarang vs target)
- Rekomendasi tabungan per bulan
- Perbandingan strategi:
  - Tabungan biasa → perlu tabung Rp X/bulan
  - Deposito → perlu tabung Rp Y/bulan (lebih sedikit karena bunga)
  - Reksa dana → perlu tabung Rp Z/bulan (paling sedikit tapi ada risiko)
- Timeline dengan milestones (25%, 50%, 75%, 100%)
- Estimasi tanggal tercapai

**Fitur tambahan:**
- Multiple goals tracking
- Priority ranking goals
- Visual progress dengan emoji/icons

**Color scheme**: orange (goal, motivation, achievement)

---

#### 8. Kalkulator Inflasi & Daya Beli

**Kenapa penting**: Edukasi tentang erosi nilai uang akibat inflasi. Orang perlu paham bahwa uang Rp 1 miliar sekarang ≠ Rp 1 miliar 20 tahun lagi.

**Input Mode 1 - Future Value:**
- Harga barang/jasa saat ini (Rp)
- Tingkat inflasi per tahun (%) - default 3-5%
- Jumlah tahun ke depan

**Output Mode 1:**
- Harga di masa depan
- Persentase kenaikan
- Perbandingan visual

**Input Mode 2 - Present Value:**
- Target dana di masa depan (Rp)
- Tingkat inflasi per tahun (%)
- Jumlah tahun ke depan

**Output Mode 2:**
- Berapa nilai uang tersebut jika di masa sekarang
- Berapa harus diinvestasikan sekarang dengan return X% untuk mencapai daya beli yang sama

**Input Mode 3 - Daya Beli:**
- Jumlah uang (Rp)
- Tahun 1 (referensi)
- Tahun 2 (pembanding)
- Tingkat inflasi rata-rata (%)

**Output Mode 3:**
- Daya beli uang tersebut di tahun berbeda
- Contoh: Rp 1 miliar tahun 2000 = Rp X miliar tahun 2024

**Perhitungan:**
- Future value: FV = PV × (1 + inflasi)^tahun
- Present value: PV = FV / (1 + inflasi)^tahun
- Real return = ((1 + return) / (1 + inflasi)) - 1

**Output Tambahan:**
- Tabel inflasi per tahun
- Contoh konkret: harga beras, bensin, rumah dari tahun ke tahun
- Calculator: "Berapa return investasi minimal agar mengalahkan inflasi?"

**Color scheme**: gray/slate (neutral, educational)

---

### Prioritas Rendah (Nice to Have)

#### 9. Perbandingan Investasi (Investment Comparison Tool)

**Kenapa penting**: Membantu user memilih instrumen investasi yang sesuai dengan profil risiko, jangka waktu, dan target return.

**Input:**
- Dana yang akan diinvestasikan (Rp)
- Durasi investasi (tahun)
- Profil risiko (Konservatif/Moderat/Agresif)

**Perbandingan instrumen:**
1. Deposito (3-6% return)
2. Obligasi (6-8% return)
3. Reksa Dana Pendapatan Tetap (5-8% return)
4. Reksa Dana Campuran (7-12% return)
5. Reksa Dana Saham (10-20% return)
6. Properti (8-12% capital gain + 5-8% rental yield)
7. Emas (8-10% return)

**Output:**
- Tabel perbandingan dengan kolom:
  - Instrumen
  - Return (min-max)
  - Hasil investasi setelah X tahun
  - Level risiko (1-5 stars)
  - Likuiditas (mudah dicairkan?)
  - Minimum investasi
  - Biaya/fee
  - Cocok untuk jangka waktu berapa
- Rekomendasi berdasarkan profil risiko
- Chart perbandingan visual

**Color scheme**: indigo (comparison, analytics)

---

#### 10. Financial Independence (FIRE Calculator)

**Kenapa penting**: Trend FIRE (Financial Independence, Retire Early) sedang berkembang. Banyak orang ingin tahu kapan bisa hidup dari passive income.

**Input:**
- Pengeluaran tahunan saat ini (Rp)
- Aset/investasi saat ini (Rp)
- Tabungan/investasi per tahun (Rp)
- Return investasi per tahun (%) - default 8%
- Target withdrawal rate (%) - default 4% (safe withdrawal rule)
- Inflasi (%) - default 3%

**Perhitungan:**
- FIRE Number = pengeluaran_tahunan × 25 (atau 100 / withdrawal_rate)
- Passive income per tahun = aset × withdrawal_rate
- Tahun mencapai FIRE dengan future value compound
- FI Ratio = aset_sekarang / FIRE_number × 100%

**Output:**
- FIRE Number (target aset untuk financial independence)
- Current FI Ratio (%)
- Passive income saat ini vs pengeluaran
- Estimasi tahun untuk mencapai FIRE
- Proyeksi aset per tahun sampai mencapai FIRE
- Different FIRE levels:
  - Lean FIRE (hidup minimalis)
  - FIRE (standar)
  - Fat FIRE (hidup mewah)

**Scenarios:**
- What if investasi per tahun dinaikkan X%?
- What if return investasi lebih tinggi/rendah?
- What if pengeluaran dikurangi?

**Color scheme**: emerald/green (freedom, independence)

---

#### 11. Simulasi Kredit Tanpa Agunan (KTA)

**Kenapa penting**: KTA populer untuk kebutuhan mendesak, tapi bunganya tinggi (12-24% per tahun). Perlu edukasi tentang total cost.

**Input:**
- Jumlah pinjaman (Rp)
- Suku bunga per tahun (%)
- Lama cicilan (bulan) - biasanya 12-60 bulan
- Biaya admin/provisi (%) - biasanya 1-3%
- Asuransi jiwa (% per tahun) - opsional, ~0.5-1%

**Perhitungan:**
- Cicilan bulanan dengan metode anuitas
- Total biaya: provisi + asuransi
- Total pembayaran = cicilan × jumlah bulan + biaya
- Total bunga = total pembayaran - pinjaman
- Effective interest rate (dengan biaya)

**Output:**
- Cicilan per bulan
- Total bunga
- Total biaya admin & asuransi
- Total pembayaran keseluruhan
- Effective rate (lebih tinggi dari advertised rate)
- Tabel amortisasi per bulan
- Perbandingan dengan kartu kredit dan KPR (rate comparison)

**Warning:**
- Bunga KTA lebih tinggi dari KPR/KKB
- Pertimbangkan alternatif lain jika memungkinkan
- Jangan ambil KTA untuk konsumsi lifestyle

**Color scheme**: orange/amber (caution, warning)

---

#### 12. Kalkulator Kebutuhan Asuransi

**Kenapa penting**: Banyak orang under-insured atau over-insured. Tool ini membantu menghitung kebutuhan uang pertanggungan (UP) yang rasional.

**Input - Asuransi Jiwa:**
- Usia (tahun)
- Status pernikahan (Single/Married)
- Jumlah tanggungan (0-10)
- Pendapatan per bulan (Rp)
- Total utang/kewajiban (Rp) - KPR, KKB, KTA, dll
- Biaya hidup keluarga per bulan (Rp)
- Aset likuid saat ini (Rp) - tabungan, deposito, investasi
- Target tahun proteksi (10-30 tahun)

**Metode Perhitungan:**

**1. Income Replacement Method:**
UP = pendapatan_tahunan × replacement_years × (1 + inflasi)^(years/2)

**2. Human Life Value:**
UP = (pendapatan_tahunan - pengeluaran_pribadi) × sisa_tahun_produktif × discount_factor

**3. Financial Needs Analysis (paling akurat):**
UP = A + B + C - D

Di mana:
- A = Total utang/kewajiban
- B = Kebutuhan dana pendidikan anak (future value)
- C = Biaya hidup keluarga × tahun proteksi
- D = Aset likuid yang sudah ada

**Output:**
- Rekomendasi UP minimum (Income Replacement)
- Rekomendasi UP ideal (Financial Needs Analysis)
- Breakdown kebutuhan:
  - Pelunasan utang: Rp X
  - Dana pendidikan: Rp Y
  - Biaya hidup Z tahun: Rp Z
  - Dikurangi aset: -Rp A
  - **Total UP: Rp B**
- Estimasi premi per bulan (rule of thumb: 5-10% dari pendapatan)
- Jenis asuransi yang cocok:
  - Term life (UP tinggi, premi murah, cocok untuk income replacement)
  - Whole life (UP + savings, premi mahal)
  - Unit link (UP + investasi, high fees)

**Input - Asuransi Kesehatan:**
- Usia
- Riwayat penyakit
- Kelas kamar RS yang diinginkan (I/II/III/VIP)
- Area coverage (Indonesia/Asia/Global)

**Output - Asuransi Kesehatan:**
- Rekomendasi plafon per tahun (Rp 50 juta - 1 miliar)
- Estimasi premi per bulan berdasarkan usia & coverage
- Tips: Asuransi kesehatan murni vs rider dari asuransi jiwa

**Color scheme**: red/pink (health, protection)

---

## Rekomendasi Urutan Implementasi

Jika harus memilih urutan implementasi berdasarkan **impact**, **urgency**, dan **user needs** di Indonesia:

### Phase 1 - Foundation (Must Have)
1. **Dana Darurat** ⭐⭐⭐
   - **Alasan**: Fundamental untuk semua orang, prioritas #1 sebelum investasi apapun
   - **Impact**: Very High - foundational financial health
   - **Complexity**: Low - perhitungan sederhana
   - **Time to build**: 1-2 hari

2. **Kalkulator Deposito** ⭐⭐⭐
   - **Alasan**: Instrumen paling populer di Indonesia, aman, dijamin LPS
   - **Impact**: High - banyak pengguna potensial
   - **Complexity**: Low-Medium
   - **Time to build**: 2-3 hari

3. **Tabungan Pendidikan Anak** ⭐⭐⭐
   - **Alasan**: Concern terbesar orang tua, biaya pendidikan terus naik
   - **Impact**: High - target audience jelas (parents)
   - **Complexity**: Medium
   - **Time to build**: 3-4 hari

### Phase 2 - Popular Investments (Should Have)
4. **Investasi Emas** ⭐⭐
   - **Alasan**: Safe haven investment, sangat populer di Indonesia
   - **Impact**: High
   - **Complexity**: Medium
   - **Time to build**: 3-4 hari

5. **Reksa Dana** ⭐⭐
   - **Alasan**: Entry point investasi untuk pemula, terjangkau
   - **Impact**: High
   - **Complexity**: Medium
   - **Time to build**: 3-4 hari

### Phase 3 - Debt Management (Important)
6. **Simulasi Kartu Kredit** ⭐⭐
   - **Alasan**: Banyak orang terjebak debt cycle, perlu edukasi
   - **Impact**: Medium-High - life-changing for some users
   - **Complexity**: Medium
   - **Time to build**: 2-3 hari

7. **Kredit Tanpa Agunan (KTA)** ⭐
   - **Alasan**: Melengkapi portfolio kredit (sudah ada KPR, KKB)
   - **Impact**: Medium
   - **Complexity**: Low (mirip KPR/KKB)
   - **Time to build**: 1-2 hari

### Phase 4 - Advanced Planning (Nice to Have)
8. **Target Tabungan (Goal-Based)** ⭐⭐
   - **Alasan**: Motivasi & gamification, user engagement
   - **Impact**: Medium
   - **Complexity**: Medium
   - **Time to build**: 2-3 hari

9. **Kalkulator Inflasi** ⭐
   - **Alasan**: Educational, awareness building
   - **Impact**: Medium - educational value
   - **Complexity**: Low
   - **Time to build**: 1-2 hari

10. **Financial Independence (FIRE)** ⭐
    - **Alasan**: Niche tapi growing trend
    - **Impact**: Low-Medium - specific audience
    - **Complexity**: Medium-High
    - **Time to build**: 3-4 hari

11. **Perbandingan Investasi** ⭐
    - **Alasan**: Decision support tool
    - **Impact**: Medium
    - **Complexity**: Low (reuse existing calculations)
    - **Time to build**: 2-3 hari

12. **Kalkulator Asuransi** ⭐
    - **Alasan**: Complex topic, tapi penting
    - **Impact**: Medium
    - **Complexity**: High - banyak variables
    - **Time to build**: 4-5 hari

---

## Rekomendasi Top 3 untuk Implementasi Berikutnya

Jika hanya bisa implementasi 3 fitur, pilihan terbaik adalah:

### 🥇 1. Dana Darurat
**Why**:
- Universal need - setiap orang butuh
- Foundation sebelum investasi
- Simple tapi powerful
- Educational value tinggi

**Expected users**: 90% dari semua pengunjung akan tertarik

---

### 🥈 2. Kalkulator Deposito
**Why**:
- Instrumen #1 di Indonesia setelah tabungan
- Aman, dijamin LPS
- Mature market - banyak yang pakai
- Competitive advantage vs basic deposit calculator di internet

**Expected users**: 70-80% pengunjung potensial sudah punya/berencana punya deposito

---

### 🥉 3. Tabungan Pendidikan Anak
**Why**:
- Pain point besar untuk orang tua
- Biaya pendidikan naik drastis
- Long-term planning tool
- Emotional connection - anak adalah prioritas

**Expected users**: 50-60% (target: orang tua atau calon orang tua)

---

## Notes & Considerations

### Technical Considerations:
- Semua fitur di atas dapat diimplementasi **client-side only** (no backend needed)
- Gunakan Svelte 5 reactivity dengan `$state()` dan `$derived()`
- Maintain consistency dengan existing features:
  - Color scheme berbeda per fitur
  - Format Rupiah dengan `Intl.NumberFormat`
  - Responsive design dengan Tailwind CSS
  - E2E tests dengan Playwright

### Data Sources:
- **Harga emas**: Bisa fetch dari API (optional) atau manual input
  - API: https://www.goldapi.io/ (limited free tier)
  - Alternatif: Ambil dari website Antam (scraping, not recommended)
  - Best: Manual input dengan default value dari reference terbaru

- **Inflasi**: Gunakan historical data BPS (3-5% range)

- **Suku bunga**: Update manual atau dari reference bank-bank major

### UX Considerations:
- **Onboarding**: Untuk fitur complex (FIRE, Asuransi), consider step-by-step wizard
- **Tooltips**: Penjelasan istilah finansial untuk user awam
- **Comparisons**: Fitur "Bandingkan Skenario" untuk simulasi what-if
- **Sharing**: Option untuk export hasil simulasi sebagai image/PDF (future enhancement)
- **Templates**: Pre-filled examples untuk quick start

### Content Considerations:
- **Disclaimer**: Tambahkan disclaimer di setiap simulasi
  - "Hasil simulasi bersifat perkiraan dan tidak menjamin hasil aktual"
  - "Bukan nasihat investasi, konsultasikan dengan perencana keuangan"
- **Educational content**: Tips & best practices di setiap halaman
- **Glossary**: Halaman terpisah untuk istilah-istilah finansial

---

## Future Enhancements (Post v1.0)

### Multi-language Support
- English version untuk broader audience
- Regional variations (Malaysia, Singapore)

### Advanced Features
- **Dashboard**: Central dashboard untuk track semua goals
- **Portfolio Tracking**: Track real investments (manual input)
- **Notifications**: Reminder untuk review financial goals
- **Historical Data**: Chart historical performance vs projections

### Social Features
- **Anonymous sharing**: Share simulasi tanpa data pribadi
- **Community**: Forum diskusi finansial
- **Success stories**: User-submitted financial journey

### Monetization (Optional)
- **Affiliate**: Link ke platform investasi (deposito, reksa dana, emas)
- **Premium**: Advanced features (multi-scenario comparison, export PDF)
- **Ads**: Display ads (careful not to ruin UX)

---

## Conclusion

Platform ini memiliki potensi besar untuk menjadi **one-stop financial planning tool** untuk masyarakat Indonesia. Dengan implementasi bertahap dan fokus pada user needs, aplikasi ini bisa membantu jutaan orang membuat keputusan finansial yang lebih baik.

**Next Step**: Pilih 1-3 fitur dari rekomendasi di atas dan mulai implementasi! 🚀
