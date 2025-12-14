# 🗺️ Sistem Informasi Geografis (SIG) Desa Mulyoharjo

![Status](https://img.shields.io/badge/Status-Development-blue?style=for-the-badge)
![Tech](https://img.shields.io/badge/Stack-Next.js_15_|_Supabase_|_Leaflet-black?style=for-the-badge)

## 📌 Pendahuluan

**SIG Desa Mulyoharjo** adalah platform pemetaan digital modern yang dirancang untuk mendigitalkan data infrastruktur dan fasilitas publik di Desa Mulyoharjo. Sistem ini hadir untuk mempermudah pemerintah desa dalam monitoring aset, perencanaan pembangunan, serta memberikan transparansi informasi geospasial kepada masyarakat luas.

Dengan antarmuka **Dark Glassmorphism** yang elegan dan responsif, aplikasi ini memberikan pengalaman eksplorasi peta yang intuitif dan futuristik.

---

## 🚀 Fitur Unggulan

### 🌍 Untuk Masyarakat (Publik)
*   **Peta Interaktif Real-time**: Jelajahi sebaran fasilitas desa dengan navigasi yang mulus.
*   **Filter Kategori Cerdas**: Tampilkan lokasi berdasarkan jenis (Sekolah, Masjid, Kantor Pemerintahan, dll).
*   **Pencarian Cepat**: Temukan lokasi spesifik dalam hitungan detik.
*   **Detail Informasi Lengkap**: Lihat foto, deskripsi, dan status kondisi infrastruktur terkini.
*   **Partisipasi Warga**: Fitur pelaporan untuk warga yang ingin menginformasikan kerusakan atau pembaruan data fasilitas.

### 🛠️ Untuk Administrator
*   **Dashboard Monitoring**: Statistik ringkas mengenai persebaran dan kondisi aset desa.
*   **Manajemen Data Spasial**: Tambah, ubah, dan hapus titik lokasi dengan mudah.
*   **Verifikasi Laporan**: Validasi laporan yang masuk dari warga sebelum dipublikasikan.
*   **Manajemen Kategori**: Atur jenis-jenis fasilitas sesuai kebutuhan desa.
*   **Sistem Log**: Pantau aktivitas perubahan data untuk keamanan.

---

## 💻 Teknologi

Aplikasi ini dibangun menggunakan *stack* teknologi terkini untuk performa maksimal:

| Komponen | Teknologi | Deskripsi |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org/) | React Framework untuk performa tinggi & SEO. |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Utilitas-first CSS untuk desain modern. |
| **Maps** | [React Leaflet](https://react-leaflet.js.org/) | Library peta interaktif open-source. |
| **Backend** | [Supabase](https://supabase.com/) | Backend-as-a-Service (PostgreSQL + PostGIS). |
| **Icons** | [Lucide React](https://lucide.dev/) | Koleksi ikon yang konsisten dan ringan. |
| **Charts** | [Recharts](https://recharts.org/) | Visualisasi data statistik. |

---

## ⚙️ Persiapan Instalasi

Pastikan perangkat Anda telah terinstall:
1.  **Node.js** (v18 atau lebih baru)
2.  **Git**
3.  Akun **Supabase** aktif

### Langkah 1: Clone Repository
```bash
git clone https://github.com/riaanmubarok/gis-mulyoharjo.git
cd gis-mulyoharjo
```

### Langkah 2: Install Dependencies
```bash
npm install
# atau
yarn install
```

### Langkah 3: Konfigurasi Environment
Salin file `.env.example` menjadi `.env.local` (atau buat baru) dan isi kredensial berikut:

```env
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Map Provider (MapTiler)
NEXT_PUBLIC_MAPTILER_API_KEY=your-maptiler-key

# Admin Default Credentials (Optional seed)
ADMIN_USER=admin
ADMIN_PASSWORD=admin123
```

### Langkah 4: Setup Database
Buka dashboard Supabase Anda, masuk ke **SQL Editor**, dan jalankan script yang ada di file `supabase_setup.sql`.
*   Script ini akan mengaktifkan ekstensi `postgis`.
*   Membuat tabel `categories`, `locations`, `reports`, dll.
*   Mengatur kebijakan keamanan (RLS).

### Langkah 5: Jalankan Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

---

## 📂 Struktur Proyek

```
gis-mulyoharjo/
├── src/
│   ├── app/            # App Router (Pages & Layouts)
│   │   ├── admin/      # Halaman khusus Admin
│   │   └── (public)/   # Halaman publik
│   ├── components/     # UI Components (Reusable)
│   │   ├── ControlPanel/ # Komponen panel peta
│   │   └── ui/         # Base components (Buttons, Inputs)
│   ├── lib/            # Utility functions & Supabase Client
│   ├── types/          # TypeScript definitions
│   └── styles/         # Global styles
├── public/             # Static assets
└── ...
```

## 🤝 Berkontribusi

Kontribusi selalu diterima! Silakan buat *Pull Request* atau laporkan isu jika Anda menemukan *bug* atau memiliki ide fitur baru.

**Dikembangkan untuk Desa Mulyoharjo.**
