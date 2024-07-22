function showOverlay1() {
  document.getElementById("overlay1").style.display = "flex";
}

function closeOverlay1() {
    // Jika pengguna sedang berada di halaman registrasi, tampilkan form login
    document.getElementById("loginScreen1").style.display = "block";
    registrationScreen.style.display = "none";
  // Tutup overlay
  document.getElementById("overlay1").style.display = "none";
}


function showLoginForm() {
  document.getElementById("loginScreen1").style.display = "block";
}
