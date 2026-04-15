// ============================================================
//  FILE: assets/js/auth.js
//  DESKRIPSI: Fungsi autentikasi untuk semua halaman
//  VERSI: 1.0.0 (Final)
// ============================================================

/**
 * Memeriksa apakah user sudah login.
 * Jika belum, redirect ke halaman login.
 * @returns {object|null} Data user atau null
 */
function checkAuth() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = 'index.html';
        return null;
    }
    try {
        const user = JSON.parse(userStr);
        return user;
    } catch (e) {
        localStorage.removeItem('user');
        window.location.href = 'index.html';
        return null;
    }
}

/**
 * Logout: hapus data user dan redirect ke login
 */
function logout() {
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Event listener untuk tombol logout
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'logoutBtn') {
        e.preventDefault();
        logout();
    }
});

// Tampilkan nama user di navbar jika ada
document.addEventListener('DOMContentLoaded', function() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            const displayNameEl = document.getElementById('displayName');
            if (displayNameEl && user.nama) {
                displayNameEl.innerText = user.nama;
            } else if (displayNameEl && user.email) {
                displayNameEl.innerText = user.email;
            }
        } catch (e) {
            // abaikan
        }
    }
});