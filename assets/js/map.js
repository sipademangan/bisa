// Inisialisasi peta Leaflet
function initMap(containerId, onClickCallback) {
    const map = L.map(containerId).setView([-7.7956, 110.3695], 13); // Koordinat default (Yogyakarta)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);

    map.on('click', function(e) {
        if (onClickCallback) onClickCallback(e.latlng);
    });

    return map;
}

// Mendapatkan lokasi pengguna dan memindahkan peta
function getLocationAndSetMap(map, callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latlng = [position.coords.latitude, position.coords.longitude];
            map.setView(latlng, 16);
            if (callback) callback({lat: latlng[0], lng: latlng[1]});
        }, function(error) {
            alert('Tidak dapat mengambil lokasi: ' + error.message);
        });
    } else {
        alert('Geolocation tidak didukung browser ini.');
    }
}