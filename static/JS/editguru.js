// Inisialisasi originalData sebagai objek kosong
let originalData = {};

// Fungsi untuk menampilkan modal dan formulir
function openModal1() {
  var overlay = document.getElementById("overlay4");
  var formContainer = document.getElementById("formContainer4");
  overlay.style.display = "block"; 
  formContainer.style.display = "block"; 
}

// Fungsi untuk menutup modal dan formulir
function closeModal1() {
  var overlay = document.getElementById("overlay4");
  var formContainer = document.getElementById("formContainer4");
  overlay.style.display = "none"; 
  formContainer.style.display = "none";
}

function openEditModal1(email) {
  fetch(`/get_guru?email=${email}`)
    .then((response) => response.json())
    .then((data) => {
      // Simpan data asli dalam originalData
      originalData = { ...data };

      // Isi nilai input dengan data guru yang akan diedit
      document.getElementById("edit_nama_" + email).value = data.nama;
      document.getElementById("edit_ttl_" + email).value = data.ttl;
      document.getElementById("edit_nip_" + email).value = data.nip;
      document.getElementById("edit_jenis_kelamin_" + email).value =
        data.jenis_kelamin;
      document.getElementById("edit_tingkatan_" + email).value = data.tingkatan;
      document.getElementById("edit_waktu_pengabdian_" + email).value =
        data.waktu_pengabdian;
      document.getElementById("edit_posisi_" + email).value = data.posisi;
      document.getElementById("edit_email_" + email).value = data.email;

      // Tampilkan modal
      openModal1();
    })
    .catch((error) => console.error("Error:", error));
}

function saveChanges1(email) {
  // Dapatkan nilai input dari elemen-elemen modal
  var editedNama = document.getElementById("edit_nama_" + email).value;
  var editedTTL = document.getElementById("edit_ttl_" + email).value;
  var editedNIP = document.getElementById("edit_nip_" + email).value;
  var editedJenisKelamin = document.getElementById("edit_jenis_kelamin_" + email).value;
  var editedTingkatan = document.getElementById(
    "edit_tingkatan_" + email
  ).value;
  var editedWaktuPengabdian = document.getElementById(
    "edit_waktu_pengabdian_" + email
  ).value;
  var editedPosisi = document.getElementById("edit_posisi_" + email).value;

  // Buat objek data untuk dikirim ke server
  var data = {
    guru_email: email,
    nama: editedNama,
    ttl: editedTTL,
    nip: editedNIP,
    jenis_kelamin: editedJenisKelamin,
    tingkatan: editedTingkatan,
    waktu_pengabdian: editedWaktuPengabdian,
    posisi: editedPosisi,
  };

  // Kirim permintaan penyimpanan ke server
  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch("/edit-data", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    });
}

// Panggil fungsi untuk menutup modal ketika tombol Close ditekan
document.querySelectorAll(".close3").forEach((item) => {
  item.addEventListener("click", function () {
    closeModal();
  });
});
