
$(document).ready(function () {
  // Ambil elemen daftarGuru
  var daftarSiswa = document.getElementById("daftarSiswa");
  // Ambil elemen toggle sidebar
  var headerToggle = document.getElementById("header-toggle");

  // Tambahkan event listener untuk memantau klik pada toggle sidebar
  headerToggle.addEventListener("click", function () {
    // Toggle kelas 'sidebar-active' pada daftarGuru saat toggle sidebar diklik
    daftarSiswa.classList.toggle("sidebar-active");
  });
});

// Ambil elemen tombol "Daftar Guru" dan elemen daftar guru
var daftarSiswaButton = document.getElementById("daftarSiswaButton");
var daftarSiswa = document.getElementById("daftarSiswa");

// Tambahkan event listener untuk tombol "Daftar Guru"
daftarSiswaButton.addEventListener("click", function () {
  // Toggle tampilan daftar guru
  if (daftarSiswa.style.display === "none") {
    daftarSiswa.style.display = "block";
  } else {
    daftarSiswa.style.display = "none";
  }
});


$(document).ready(function () {
  // Fungsi untuk validasi nomor telepon
  function validatePhoneNumber(phoneNumber) {
    return /^\d{12}$/.test(phoneNumber);
  }

  // Fungsi untuk menangani pengiriman formulir
  function submitForm() {
    var formData = {
      name: $("#name").val(),
      jenis_kelamin: $("#jenis_kelamin").val(),
      ttl: $("#ttl").val(),
      agama: $("#agama").val(),
      address_siswa: $("#address_siswa").val(),
      jenis_disabilitas: $("#jenis_disabilitas").val(),
      nama_ayah: $("#nama_ayah").val(),
      pekerjaan_ayah: $("#pekerjaan_ayah").val(),
      nama_ibu: $("#nama_ibu").val(),
      pekerjaan_ibu: $("#pekerjaan_ibu").val(),
      notlp: $("#notlp").val(),
      address_ortu: $("#address_ortu").val(),
      NISN: $("#NISN").val(),
      kelas: $("#kelas").val(),
      tahun_masuk: $("#tahun_masuk").val(),
    };

    // Validasi nomor telepon sebelum mengirim data ke server
    if (!validatePhoneNumber(formData.notlp)) {
      alert(
        "Nomor telepon harus terdiri dari 12 angka dan harus berupa angka."
      );
      return false; // Menghentikan pengiriman formulir jika validasi gagal
    }

    // Mengirimkan data ke server menggunakan AJAX
    $.ajax({
      type: "POST",
      url: "/submit-form",
      data: formData,
      success: function (response) {
        alert(response.message);
        // Jika sukses, alihkan ke halaman dashboard_admin
        window.location.href =
          "/dashboard_admin?message=" + encodeURIComponent(response.message);
      },
      error: function (xhr, status, error) {
        console.error(error);
        alert("Terjadi kesalahan saat mengirim data ke server.");
        // Jika gagal, tetap di halaman saat ini
        window.location.href =
          "/dashboard_admin?message=Terjadi%20kesalahan%20saat%20menyimpan%20data.";
      },
    });

    return false; // Menghentikan pengiriman formulir secara tradisional
  }

  // Menangani pengiriman formulir saat tombol "Simpan" diklik
  $("#msform").submit(submitForm);
});


