function showOverlay2() {
  document.getElementById("overlay2").style.display = "flex";
}

function closeOverlay2() {
    // Jika pengguna sedang berada di halaman registrasi, tampilkan form login
    document.getElementById("loginScreen1").style.display = "block";
    registrationScreen.style.display = "none";
  // Tutup overlay
  document.getElementById("overlay2").style.display = "none";
}

