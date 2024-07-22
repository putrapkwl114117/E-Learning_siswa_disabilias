$(document).ready(function () {
  function showForm() {
    $("#overlay").fadeIn();
    $("#formContainer").fadeIn();
  }

  $("#closeForm").click(function () {
    $("#overlay").fadeOut();
    $("#formContainer").fadeOut();
  });

  // Panggil showForm saat tombol "Tambah Guru" diklik
  $(".nav_link.admin-link").click(showForm);
});

$(document).ready(function () {
  // Ambil elemen daftarGuru
  var daftarGuru = document.getElementById("daftarGuru");
  // Ambil elemen toggle sidebar
  var headerToggle = document.getElementById("header-toggle");

  // Tambahkan event listener untuk memantau klik pada toggle sidebar
  headerToggle.addEventListener("click", function () {
    // Toggle kelas 'sidebar-active' pada daftarGuru saat toggle sidebar diklik
    daftarGuru.classList.toggle("sidebar-active");
  });
});



// Ambil elemen tombol "Daftar Guru" dan elemen daftar guru
var daftarGuruButton = document.getElementById("daftarGuruButton");
var daftarGuru = document.getElementById("daftarGuru");

// Tambahkan event listener untuk tombol "Daftar Guru"
daftarGuruButton.addEventListener("click", function () {
  // Toggle tampilan daftar guru
  if (daftarGuru.style.display === "none") {
    daftarGuru.style.display = "block";
  } else {
    daftarGuru.style.display = "none";
  }
});

function registrasi(nama, email, buttonElement) {
  // Persiapkan data untuk dikirim
  const data = {
    email: email,
    nama: nama,
    user_type: 'guru' // Tambahkan user type 'guru'
  };

  // Konfigurasi pengiriman permintaan
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  // Kirim permintaan AJAX ke endpoint '/register_guru'
  fetch("/register_guru", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // Tangani respons dari server
      if (data.status === "success") {
        // Jika pendaftaran berhasil, tampilkan pesan sukses saja
        alert(data.message);
        // Buat tombol baru untuk berbagi link kredensial
        const shareButton = document.createElement("button");
        shareButton.innerHTML = '<i class="fas fa-share"></i>';
        shareButton.onclick = function () {
          shareCredentials(nama, email);
        };
        buttonElement.parentNode.insertBefore(
          shareButton,
          buttonElement.nextSibling
        );
        buttonElement.remove();
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    });
}

function shareCredentials(nama, email) {
  var credentialsLink = "http://127.0.0.1:5000/show_credentials?user_type=guru&email=" + encodeURIComponent(email); // Tambahkan user type dan email
  var whatsappUrl =
    "https://api.whatsapp.com/send?text=" + encodeURIComponent(credentialsLink);

  window.open(whatsappUrl, "_blank");
};



window.addEventListener("load", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const hapusDataSuccess = urlParams.get("hapusDataSuccess");
  if (hapusDataSuccess === "true") {
    daftarGuru.style.display = "block";
  };
});

function hapusData(nama) {
  console.log("Menghapus guru dengan nama:", nama); // Periksa nama guru

  if (confirm("Apakah Anda yakin ingin menghapus data guru ini?")) {
    // Jika pengguna mengonfirmasi, kirim permintaan POST untuk menghapus data
    fetch("/hapus-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "guru_nama=" + encodeURIComponent(nama), // Menggunakan nama guru
    })
      .then((response) => {
        if (response.ok) {
          // Jika penghapusan berhasil, muat ulang halaman dengan menambahkan parameter URL
          window.location.href =
            window.location.pathname + "?hapusDataSuccess=true";
        } else {
          throw new Error("Gagal menghapus data guru.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Terjadi kesalahan. Gagal menghapus data guru.");
      });
  }
}
