# Sistem Informasi Padukuhan Demangan (Sipade)

Sistem informasi berbasis web untuk Padukuhan Demangan yang terintegrasi dengan pemetaan rumah (OpenStreetMap), manajemen surat, berita dinamis, galeri kegiatan, serta **chatbot cerdas Sipade** yang humanis.  
Terdapat 3 level akses pengguna: **Admin**, **Ketua RT**, dan **Member**.  
Frontend dibangun dengan **Bootstrap 5**, **Leaflet.js**, **Chart.js**, dan dihosting di **GitHub Pages**. Backend menggunakan **Google Apps Script** + **Google Sheets**.

---

## ✨ Fitur Utama

- **Autentikasi multi-level** (Admin, Ketua RT, Member)
- **CRUD data warga** lengkap (NIK, NKK, pekerjaan, pendidikan, foto diri & rumah, lokasi rumah di peta)
- **Pemetaan rumah interaktif** dengan Leaflet.js & OpenStreetMap
- **Pengajuan & pemrosesan surat keterangan** online
- **Dashboard statistik** – jumlah warga, surat, grafik sebaran penduduk per RT, pekerjaan, pendidikan
- **Manajemen pengguna** (khusus admin)
- **Berita & informasi** dinamis (dari database Google Sheets)
- **Galeri kegiatan** – mendukung gambar dan video YouTube
- **Chatbot Sipade** – asisten AI humanis dengan:
  - Pengetahuan yang dapat dikelola oleh Admin/Ketua RT (CRUD knowledge base)
  - Fitur kirim pesan/masukan langsung ke perangkat padukuhan (Dukuh atau Ketua RT) via WhatsApp
  - Tombol saran cepat (kegiatan, gotong royong, donor darah, kerja bakti)
- **Verifikasi keaslian surat** via halaman publik (`verifikasi_surat.html`) menggunakan nomor surat atau QR code
- **Kebijakan privasi & syarat ketentuan** – ditampilkan dalam modal terintegrasi
- **Responsif, ringan, dan SEO friendly** (menggunakan AOS animasi)

---

## 🧱 Teknologi

| Komponen       | Teknologi |
|----------------|-----------|
| Frontend       | HTML, CSS, JavaScript, Bootstrap 5, Leaflet, Chart.js, AOS (Animate on Scroll) |
| Backend        | Google Apps Script (REST API) |
| Database       | Google Sheets |
| Hosting        | GitHub Pages |
| Icons & Fonts  | Font Awesome 6, Google Fonts (Inter) |
| Peta           | Leaflet + OpenStreetMap (tile layer) |
| Lainnya        | Fetch API, localStorage (session pengguna) |

---

## 🗄️ Struktur Database (Google Sheets)

Buat **satu spreadsheet** dengan sheet berikut (nama sheet **case-sensitive**).  
Gunakan ID spreadsheet tersebut di kode Apps Script.

### Sheet `Users`
| email | password (hash) | role | rt | nama_lengkap |
|-------|----------------|------|----|---------------|
| Contoh: admin@padukuhan.id | sha256(...) | admin | (kosong) | Administrator |

> Role yang valid: `admin`, `ketua_rt`, `member`. Kolom `rt` diisi angka 1–7 untuk ketua_rt.

### Sheet `Warga`
| id | nik | nkk | nama | no_hp | email | alamat_rt | latitude | longitude | pekerjaan | pendidikan_terakhir | keterangan | foto_diri_url | foto_rumah_url | created_by | updated_at |
|----|-----|-----|------|-------|-------|-----------|----------|-----------|-----------|----------------------|-------------|----------------|----------------|------------|------------|

### Sheet `Surat`
| id | jenis_surat | nik_pemohon | keperluan | status | file_url | tgl_pengajuan | tgl_selesai | diproses_oleh |
|----|-------------|-------------|-----------|--------|----------|---------------|-------------|----------------|

### Sheet `Berita`
| id | judul | isi | gambar_url | tgl_publikasi | created_by |
|----|-------|-----|------------|----------------|------------|

### Sheet `Galeri`
| id | tipe | gambar_url | deskripsi | urutan |
|----|------|------------|-----------|--------|
| tipe: `image` atau `video` | Jika video, `gambar_url` berisi URL YouTube (contoh: `https://youtu.be/...`). |

### Sheet `KnowledgeBase`
| id | judul | kategori | isi | created_at |
|----|-------|----------|-----|-------------|
| Kategori: `Kegiatan`, `Pengumuman`, `FAQ`, `Lainnya` | Digunakan oleh chatbot Sipade. |

### Sheet `Settings`
| key | value |
|-----|-------|
| total_warga | (diisi otomatis via script) |
| total_surat_terbit | (diisi otomatis) |

> **Catatan**: Semua sheet harus memiliki baris header sesuai kolom di atas.

---

## 🔧 Instalasi & Konfigurasi

### 1. Backend (Google Apps Script)

1. Buka [script.google.com](https://script.google.com) dan buat project baru.
2. Salin kode backend (sesuai arsitektur REST API) ke dalam project.  
   **Endpoint minimal yang harus disediakan** (dipanggil oleh frontend):
   - **Publik (tanpa auth)**
     - `GET /getPublicStatistik` → mengembalikan `{ total_warga, total_surat_terbit }`
     - `GET /getPublicBerita` → array berita
     - `GET /getPublicGaleri` → array galeri
     - `GET /getSipadeKnowledge` → array knowledge base
     - `POST /chatWithBot` → menerima `{ message }`, mengembalikan `{ reply }`
   - **Autentikasi & CRUD**
     - `POST /login` → `{ email, password }` → mengembalikan data user + token (opsional)
     - `GET /warga`, `POST /warga`, `PUT /warga`, `DELETE /warga`
     - `GET /surat`, `POST /surat`, `PUT /surat`
     - `POST /createSipadeKnowledge` (auth admin/ketua_rt)
     - `DELETE /deleteSipadeKnowledge` (auth admin/ketua_rt)
     - `POST /upload` → upload file ke Google Drive, balikkan URL publik
3. Hubungkan Apps Script dengan Google Sheets:  
   `const sheet = SpreadsheetApp.openById('ID_SPREADSHEET').getSheetByName('Users');`
4. **Deploy** sebagai **Web App**:
   - Execute as: `Me` (atau akun pemilik spreadsheet)
   - Who has access: `Anyone` (agar dapat diakses dari GitHub Pages)
   - Salin URL Web App (contoh: `https://script.google.com/macros/s/.../exec`)

### 2. Frontend (GitHub Pages)

1. Clone atau download repositori ini.
2. Buka file `assets/js/api.js` dan ganti konstanta `APPS_SCRIPT_URL` dengan URL Web App dari langkah sebelumnya.
3. Pastikan semua file (HTML, CSS, JS, gambar) sudah di-upload ke repository GitHub.
4. Aktifkan **GitHub Pages** dari branch `main` (atau branch yang digunakan) melalui Settings > Pages.

### 3. Google Sheets – Data Awal

- Isi sheet `Users` dengan akun admin (gunakan hashing sederhana seperti SHA-256 di backend).  
  Contoh:  
  `admin@padukuhan.id`, `5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8` (hash untuk "password"), `admin`, ``, `Administrator`
- Isi sheet `Berita`, `Galeri`, `KnowledgeBase` dengan contoh data (opsional).
- Catat ID spreadsheet (dari URL) dan gunakan di kode Apps Script.

---

## 🚀 Penggunaan

### Akses Publik (tanpa login)
- Halaman utama (`index.html`) menampilkan:
  - Statistik jumlah warga, surat, RT
  - Berita terbaru
  - Galeri kegiatan (gambar & video)
  - Tombol **Masuk** (login)
  - **Chatbot Sipade** – dapat diajak bicara dan mengirim pesan ke perangkat padukuhan
  - Menu **Verifikasi Surat** – menuju halaman pengecekan keaslian surat

### Setelah Login (sesuai role)
- **Admin**
  - Akses semua data warga (CRUD)
  - Kelola semua surat & pengguna
  - Dashboard statistik lengkap
  - **Kelola Data Sipade** (tambah/hapus knowledge base chatbot)
- **Ketua RT**
  - Hanya dapat mengelola data warga di RT-nya
  - Memproses surat warganya
  - Juga dapat mengelola knowledge base chatbot
- **Member**
  - Melihat & mengedit data diri sendiri
  - Mengajukan surat keterangan

### Fitur Chatbot Sipade
- Klik ikon robot di kanan bawah layar.
- Tanyakan informasi seperti *"info kegiatan"*, *"donor darah"*, *"kerja bakti"*.
- Kirim masukan ke perangkat padukuhan:
  - Klik tombol **"Kirim Masukan ke Perangkat"** di dalam chatbot.
  - Pilih tujuan (Dukuh atau RT 01–07).
  - Masukkan nama, alamat, pesan.
  - Konfirmasi lalu terhubung ke WhatsApp perangkat terkait.
- **Admin/Ketua RT** dapat menambah pengetahuan chatbot melalui menu profil → **Kelola Data Sipade**.

---

## 📂 Catatan Penting

### Keamanan
- Gunakan **HTTPS** pada production (GitHub Pages sudah menyediakan HTTPS).
- Implementasikan hashing password di backend (contoh: SHA-256 atau bcrypt).
- Validasi role pada setiap endpoint (jangan hanya mengandalkan frontend).

### Upload File
- Endpoint `/upload` harus menerima file (multipart/form-data), menyimpannya ke Google Drive, lalu mengembalikan URL publik (dengan izin `Anyone with the link can view`).

### CORS
- Karena frontend di GitHub Pages (domain berbeda) dan backend di Apps Script, pastikan Apps Script mengirimkan header:
  ```javascript
  ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*');