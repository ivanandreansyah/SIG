# Perencanaan Sistem Informasi Geografis (SIG)

## 1. Identifikasi Teknologi (Tech Stack)
Aplikasi ini dibangun menggunakan teknologi modern berbasis web (Web-based GIS) dengan spesifikasi sebagai berikut:

*   **Framework Utama**: **Next.js 16** (App Router)
*   **Bahasa Pemrograman**: **TypeScript** (untuk keamanan tipe data yang ketat)
*   **Library UI**: **React 19**
*   **Styling**: **Tailwind CSS v4** (Utility-first CSS) & **Lucide React** (Ikon)
*   **Peta & Spasial**:
    *   **Leaflet** & **React-Leaflet** (Rendering peta interaktif)
    *   **@maptiler/leaflet-maptilersdk** (Tile layer provider)
*   **Backend & Database**: **Supabase**
    *   **PostgreSQL**: Database relasional utama.
    *   **PostGIS**: Ekstensi untuk mengelola data spasial/geografis (titik koordinat).
    *   **Supabase Storage**: Penyimpanan file (foto lokasi).
    *   **Supabase Auth**: Manajemen autentikasi pengguna.

## 2. Arsitektur Sistem
Sistem menggunakan arsitektur **Client-Server** (Serverless via Supabase):
*   **Client (Frontend)**: Aplikasi Next.js yang diakses pengguna melalui browser. Menangani tampilan peta, interaksi pengguna, dan form input.
*   **Server/BaaS (Backend)**: Supabase menangani logika database, API (via Client SDK), autentikasi, dan aturan keamanan (Row Level Security).

## 3. Desain Database (Schema)
Berdasarkan `supabase_setup.sql`, berikut adalah struktur data sistem:

### Tabel Utama:
1.  **`categories`**: Menyimpan kategori utama infrastruktur (misal: "Jalan", "Jembatan").
2.  **`subcategories`**: Sub-jenis dari kategori (misal: "Jalan Aspal", "Jalan Beton").
3.  **`locations`**: Data inti spasial.
    *   Menyimpan koordinat (`latitude`, `longitude`) dan Geometry (`geom`).
    *   Detail lokasi: `name`, `address`, `dusun`, `condition` (kondisi).
4.  **`location_images`**: Galeri foto untuk setiap titik lokasi.
5.  **`infrastructure_conditions`**: Riwayat pencatatan kondisi infrastruktur (Pemantauan berkala).
6.  **`location_reports`**: Fitur partisipasi publik/warga untuk melaporkan lokasi atau kerusakan.

## 4. Fitur & Fungsionalitas
### A. Publik (Pengguna Umum)
1.  **Peta Interaktif**: Melihat sebaran titik lokasi infrastruktur desa.
2.  **Detail Lokasi**: Mengklik titik untuk melihat informasi detail dan foto.
3.  **Filter**: Menyaring tampilan berdasarkan kategori atau kondisi (Baik/Rusak).
4.  **Pelaporan**: Form untuk warga melaporkan kondisi infrastruktur (`/report`).

### B. Administrator (`/admin`)
1.  **Dashboard Manajemen**: Ringkasan data (Statistik).
2.  **Manajemen Lokasi (CRUD)**:
    *   Tambah titik baru (klik di peta atau input koordinat).
    *   Edit data & upload foto.
    *   Hapus lokasi.
3.  **Manajemen Master Data**: Mengelola Kategori dan Subkategori.
4.  **Verifikasi Laporan**: Meninjau laporan yang masuk dari warga.

## 5. Alur Kerja (Workflow)
1.  **Input Data**: Admin login -> Buka form tambah lokasi -> Isi data -> Upload foto -> Simpan.
2.  **Visualisasi**: Sistem mengambil data GeoJSON dari Supabase -> Render di Leaflet Map.
3.  **Pelaporan**: Warga akses menu lapor -> Isi form & upload bukti -> Laporan masuk status 'pending' -> Admin memverifikasi.
