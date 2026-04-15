# Sistem Informasi Padukuhan Demangan

Sistem informasi berbasis web untuk Padukuhan Demangan dengan fitur pendataan warga, pemetaan rumah (OpenStreetMap), manajemen surat, dan pengguna dengan 3 level akses (Admin, Ketua RT, Member). Frontend dibangun dengan Bootstrap 5 dan dihosting di GitHub Pages, backend menggunakan Google Apps Script + Google Sheets.

## Fitur Utama

- Autentikasi multi-level (Admin, Ketua RT, Member)
- CRUD data warga lengkap dengan NIK, NKK, pekerjaan, pendidikan, foto, dan lokasi rumah (OpenStreetMap)
- Pemetaan rumah dengan Leaflet.js
- Pengajuan dan pemrosesan surat keterangan
- Dashboard statistik jumlah warga, surat, dll.
- Manajemen pengguna (khusus admin)
- Responsif, ringan, dan SEO friendly

## Teknologi

- **Frontend**: HTML, CSS, JavaScript, Bootstrap 5, Leaflet, Chart.js
- **Backend**: Google Apps Script (REST API)
- **Database**: Google Sheets
- **Hosting**: GitHub Pages

## Instalasi

1. **Backend (Apps Script)**:
   - Buat project baru di script.google.com.
   - Salin kode backend (sesuai arsitektur) ke project.
   - Deploy sebagai Web App dengan akses "Anyone".
   - Salin URL Web App.

2. **Frontend**:
   - Clone atau download repositori ini.
   - Buka `assets/js/api.js` dan ganti `APPS_SCRIPT_URL` dengan URL Web App.
   - Upload semua file ke repository GitHub.
   - Aktifkan GitHub Pages dari branch `main`.

3. **Google Sheets**:
   - Buat spreadsheet baru dengan sheet: `Users`, `Warga`, `Surat`, `Settings`.
   - Isi sheet `Users` dengan data admin awal (email, password hash, role admin).
   - Catat ID spreadsheet untuk digunakan di backend.

## Struktur Database (Google Sheets)

### Sheet `Users`
| email | password (hash) | role | rt | nama_lengkap |

### Sheet `Warga`
| id | nik | nkk | nama | no_hp | email | alamat_rt | latitude | longitude | pekerjaan | pendidikan_terakhir | keterangan | foto_diri_url | foto_rumah_url | created_by | updated_at |

### Sheet `Surat`
| id | jenis_surat | nik_pemohon | keperluan | status | file_url | tgl_pengajuan | tgl_selesai | diproses_oleh |

## Penggunaan

- Login dengan akun yang sudah terdaftar.
- Admin dapat mengelola semua data dan pengguna.
- Ketua RT hanya dapat mengelola data warga di RT-nya.
- Member hanya dapat melihat dan mengedit data dirinya sendiri, serta mengajukan surat.

## Catatan

- Pastikan Apps Script sudah dikonfigurasi dengan benar dan mengembalikan response JSON dengan properti `success`.
- Untuk keamanan, sebaiknya implementasikan hashing password di frontend atau gunakan HTTPS.
- Upload foto menggunakan endpoint `/upload` yang disediakan backend (mengupload ke Google Drive dan mengembalikan URL).

## Lisensi

MIT License