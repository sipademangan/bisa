// ============================================================
// api.js - Full version for SIP Demangan
// Mendukung: login, register, warga, surat (termasuk ttd dan upload),
// verifikasi pendaftar, manajemen ketua RT, berita, galeri, family tree,
// knowledge base Sipade, chatbot, upload foto profil, dan pengaturan akses role.
// ============================================================

const API_BASE_URL = 'https://script.google.com/macros/s/AKfycbw1dE98DqdpJBa_QNVJYkRaLKdKjFoteG21Rx5bajkHy0cy9sLYRhbzOAIZP6Eng_AsIA/exec';

/**
 * Helper: Mendapatkan user yang login dari localStorage atau sessionStorage.
 * Mengembalikan { email, role, nama, rt, foto_profil } atau null.
 */
function getLoggedInUser() {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) { /* ignore */ }
  if (!user) {
    try {
      user = JSON.parse(sessionStorage.getItem('user'));
    } catch (e) { }
  }
  return user;
}

/**
 * Request utama ke backend Apps Script.
 * - method: GET, POST, PUT, DELETE (akan dikonversi ke POST dengan query param 'method')
 * - body: object untuk POST/PUT
 */
async function apiRequest(path, method = 'GET', body = null) {
  const user = getLoggedInUser();
  const url = new URL(API_BASE_URL);
  url.searchParams.append('path', path);
  url.searchParams.append('method', method);

  if (user && user.email) {
    url.searchParams.append('userEmail', user.email);
    if (user.role) url.searchParams.append('userRole', user.role);
  }

  const httpMethod = (method === 'GET') ? 'GET' : 'POST';
  const options = {
    method: httpMethod,
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'omit',
  };

  if (httpMethod === 'POST') {
    options.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const payload = new URLSearchParams();
    if (body) {
      payload.append('data', JSON.stringify(body));
    }
    options.body = payload.toString();
  }

  try {
    const response = await fetch(url.toString(), options);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    const data = await response.json();
    if (!data.success) throw new Error(data.error || 'Terjadi kesalahan pada server');
    return data.data;
  } catch (error) {
    console.error('[apiRequest] error:', error);
    throw error;
  }
}

// ========== PUBLIC (tanpa login) ==========
async function getPublicStatistik() {
  return apiRequest('/public/statistik', 'GET');
}
async function getPublicBerita() {
  return apiRequest('/public/berita', 'GET');
}
async function getPublicGaleri() {
  return apiRequest('/public/galeri', 'GET');
}
async function verifySuratByNomor(nomorSurat) {
  return apiRequest(`/public/verify-surat?nomor=${encodeURIComponent(nomorSurat)}`, 'GET');
}

// ========== AUTH ==========
async function login(email, password) {
  return apiRequest('/login', 'POST', { email, password });
}
async function register(data) {
  return apiRequest('/register', 'POST', data);
}

// ========== CHATBOT ==========
async function chatWithBot(message) {
  return apiRequest('/chat', 'POST', { message });
}

// ========== WARGA ==========
async function getWarga() {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/warga', 'GET');
}
async function getWargaById(id) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/warga/${id}`, 'GET');
}
async function createWarga(data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/warga', 'POST', data);
}
async function updateWarga(id, data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/warga/${id}`, 'PUT', data);
}
async function deleteWarga(id) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/warga/${id}`, 'DELETE');
}

// ========== SURAT ==========
async function getSurat() {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/surat', 'GET');
}
async function getSuratById(id) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/surat/${id}`, 'GET');
}
async function createSurat(data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/surat', 'POST', data);
}
async function updateSuratStatus(id, status, file_url = null, nomor_surat = null) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  const payload = { status };
  if (file_url) payload.file_url = file_url;
  if (nomor_surat) payload.nomor_surat = nomor_surat;
  return apiRequest(`/surat/${id}/status`, 'PUT', payload);
}
async function ttdSurat(id, data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/surat/${id}/ttd`, 'PUT', data);
}
async function updateSurat(id, data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/surat/${id}`, 'PUT', data);
}
async function deleteSurat(id) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/surat/${id}`, 'DELETE');
}

// ========== USERS (Admin only) ==========
async function getUsers() {
  const user = getLoggedInUser();
  if (!user || user.role !== 'admin') throw new Error('Akses ditolak');
  return apiRequest('/users', 'GET');
}
async function createUser(data) {
  const user = getLoggedInUser();
  if (!user || user.role !== 'admin') throw new Error('Akses ditolak');
  return apiRequest('/users', 'POST', data);
}
async function updateUser(email, data) {
  const user = getLoggedInUser();
  if (!user || user.role !== 'admin') throw new Error('Akses ditolak');
  return apiRequest(`/users/${email}`, 'PUT', data);
}
async function deleteUser(email) {
  const user = getLoggedInUser();
  if (!user || user.role !== 'admin') throw new Error('Akses ditolak');
  return apiRequest(`/users/${email}`, 'DELETE');
}

// ========== VERIFIKASI PENDaftar (Ketua RT / Admin) ==========
async function getPendingUsers() {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  if (user.role !== 'admin' && user.role !== 'ketua_rt') throw new Error('Akses ditolak');
  return apiRequest('/pending-users', 'GET');
}
async function approveUser(email) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  if (user.role !== 'admin' && user.role !== 'ketua_rt') throw new Error('Akses ditolak');
  return apiRequest('/approve-user', 'POST', { email });
}
async function rejectUser(email) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  if (user.role !== 'admin' && user.role !== 'ketua_rt') throw new Error('Akses ditolak');
  return apiRequest('/reject-user', 'POST', { email });
}

// ========== MANAJEMEN KETUA RT (Admin) ==========
async function getKetuaRt() {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/ketua-rt', 'GET');
}
async function createKetuaRt(data) {
  const user = getLoggedInUser();
  if (!user || user.role !== 'admin') throw new Error('Akses ditolak');
  return apiRequest('/ketua-rt', 'POST', data);
}
async function updateKetuaRt(rt, data) {
  const user = getLoggedInUser();
  if (!user || user.role !== 'admin') throw new Error('Akses ditolak');
  return apiRequest(`/ketua-rt/${rt}`, 'PUT', data);
}
async function deleteKetuaRt(rt) {
  const user = getLoggedInUser();
  if (!user || user.role !== 'admin') throw new Error('Akses ditolak');
  return apiRequest(`/ketua-rt/${rt}`, 'DELETE');
}

// ========== BERITA ==========
async function getBerita() {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/berita', 'GET');
}
async function createBerita(data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/berita', 'POST', data);
}
async function updateBerita(id, data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/berita/${id}`, 'PUT', data);
}
async function deleteBerita(id) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/berita/${id}`, 'DELETE');
}

// ========== GALERI ==========
async function getGaleri() {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/galeri', 'GET');
}
async function createGaleri(data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/galeri', 'POST', data);
}
async function updateGaleri(id, data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/galeri/${id}`, 'PUT', data);
}
async function deleteGaleri(id) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/galeri/${id}`, 'DELETE');
}

// ========== FAMILY TREE ==========
async function getFamily() {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/family', 'GET');
}
async function getFamilyById(id) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/family/${id}`, 'GET');
}
async function createFamily(data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/family', 'POST', data);
}
async function updateFamily(id, data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/family/${id}`, 'PUT', data);
}
async function deleteFamily(id) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/family/${id}`, 'DELETE');
}

// ========== KEUANGAN ==========
async function getKeuangan() {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/keuangan', 'GET');
}
async function createKeuangan(data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/keuangan', 'POST', data);
}
async function updateKeuangan(id, data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/keuangan/${id}`, 'PUT', data);
}
async function deleteKeuangan(id) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest(`/keuangan/${id}`, 'DELETE');
}
async function exportKeuanganPdf(params) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  let query = '';
  if (params.tahun) query += `&tahun=${params.tahun}`;
  if (params.rt) query += `&rt=${params.rt}`;
  return apiRequest(`/keuangan/export-pdf?${query.substring(1)}`, 'GET');
}

// ========== KNOWLEDGE BASE SIPADE (Admin & Ketua RT) ==========
async function getSipadeKnowledge() {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  if (user.role !== 'admin' && user.role !== 'ketua_rt') throw new Error('Akses ditolak');
  return apiRequest('/sipade-knowledge', 'GET');
}
async function createSipadeKnowledge(data) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  if (user.role !== 'admin' && user.role !== 'ketua_rt') throw new Error('Akses ditolak');
  return apiRequest('/sipade-knowledge', 'POST', data);
}
async function deleteSipadeKnowledge(id) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  if (user.role !== 'admin' && user.role !== 'ketua_rt') throw new Error('Akses ditolak');
  return apiRequest(`/sipade-knowledge/${id}`, 'DELETE');
}

// ========== UPLOAD & IMPORT ==========
/**
 * Upload file (gambar atau PDF) ke Drive.
 * @param {string} base64Data - Data base64 tanpa prefix (hasil split setelah koma)
 * @param {string} fileName - Nama file dengan ekstensi
 * @param {boolean} isSurat - Apakah file surat (akan disimpan di folder Surat Demangan)
 */
async function uploadFile(base64Data, fileName, isSurat = false) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/upload', 'POST', { data: base64Data, filename: fileName, isSurat });
}

// ========== UPDATE FOTO PROFIL ==========
/**
 * Mengunggah foto profil user yang sedang login.
 * @param {string} base64Data - Data base64 tanpa prefix
 * @param {string} fileName - Nama file gambar
 * @returns {Promise<{user: object, foto_url: string}>}
 */
async function updateProfilePhoto(base64Data, fileName) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  const result = await apiRequest('/profile/photo', 'POST', { foto_data: base64Data, filename: fileName });
  // Update user di localStorage dengan data terbaru (termasuk foto_profil)
  if (result && result.user) {
    localStorage.setItem('user', JSON.stringify(result.user));
  }
  return result;
}

// ========== PENGATURAN AKSES ROLE (Admin only) ==========
/**
 * Mendapatkan status akses untuk role ketua_rt dan member.
 * @returns {Promise<{ketua_rt: string, member: string}>}
 */
async function getAccessSettings() {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/access-settings', 'GET');
}

/**
 * Mengupdate status akses untuk role tertentu (hanya admin).
 * @param {string} role - 'ketua_rt' atau 'member'
 * @param {string} status - 'active' atau 'inactive'
 */
async function updateAccessSetting(role, status) {
  const user = getLoggedInUser();
  if (!user || user.role !== 'admin') throw new Error('Akses ditolak');
  return apiRequest('/access-settings', 'POST', { role, status });
}

async function importWarga(wargaArray) {
  const user = getLoggedInUser();
  if (!user) throw new Error('Anda belum login');
  return apiRequest('/import-warga', 'POST', { warga: wargaArray });
}

// ========== HASH TOOL (Admin only) ==========
async function unhash(hash) {
  const user = getLoggedInUser();
  if (!user || user.role !== 'admin') throw new Error('Akses ditolak');
  return apiRequest('/unhash', 'POST', { hash });
}