function showOverlay() {
  document.getElementById("overlay").style.display = "flex";
}

function closeOverlay() {
  var registrationScreen = document.getElementById("registrationScreen");
  if (registrationScreen.style.display === "block") {
    // Jika pengguna sedang berada di halaman registrasi, tampilkan form login
    document.getElementById("loginScreen").style.display = "block";
    registrationScreen.style.display = "none";
  }
  // Tutup overlay
  document.getElementById("overlay").style.display = "none";
}

function showRegistrationForm() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("registrationScreen").style.display = "block";
  console.log();
}

function showLoginForm() {
  document.getElementById("loginScreen").style.display = "block";
  document.getElementById("registrationScreen").style.display = "none";
}



