

function toggleMateriContent() {
  // Temukan elemen konten daftar materi
  var daftarMateriContainer = document.getElementById("daftar-materi");

  // Ganti properti display dari konten daftar materi
  if (daftarMateriContainer.style.display === "none") {
    daftarMateriContainer.style.display = "block";
  } else {
    daftarMateriContainer.style.display = "none";
  }
}


document.addEventListener("DOMContentLoaded", function () {
  var overlay = document.getElementById("overlay");
  var contentToToggle = document.getElementById("contentToToggle");
  var kelasUmumElement = document.getElementById("kelasUmum");
  var kelasKhususElement = document.getElementById("kelasKhusus");
  var formKelasElement = document.getElementById("formKelas");
  var formKelas1Element = document.getElementById("formKelas1");
  var tambahKelasButton = document.getElementById("tambahKelas");
  var dropdownKelas = document.getElementById("dropdownKelas");
  var tingkatKelas = document.getElementById("tingkatKelas");

  var namaGuruDropdown2 = document.getElementById("namaGuru2");
  var namaGuruDropdown1 = document.getElementById("namaGuru1");
  var tingkatKelasDropdown = document.getElementById("tingkatKelas1");
  var jenisDisabilitasDropdown = document.getElementById("jenisDisabilitas");

  // Event listener untuk kelasUmumElement
  kelasUmumElement.addEventListener("click", function () {
    formKelasElement.style.display = "block";
    formKelas1Element.style.display = "none"; // Sembunyikan form kelas khusus
    dropdownKelas.style.display = "none";
    fetch("/get_guru_data")
      .then((response) => response.json())
      .then((data) => {
        // Mengisi dropdown nama guru
        namaGuruDropdown2.innerHTML = "";
        data.forEach((guru) => {
          var option = document.createElement("option");
          option.text = guru.nama;
          option.value = guru.nama;
          namaGuruDropdown2.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching kelas data:", error));

    fetch("/form_with_dynamic_options")
      .then((response) => response.json())
      .then((data) => {
        // Menghapus opsi yang sudah ada sebelumnya
        tingkatKelas.innerHTML = "";
        // Mengisi dropdown dengan opsi dari data yang diperoleh dari server
        data.forEach((kelas) => {
          var option = document.createElement("option");
          option.text = kelas;
          option.value = kelas;
          tingkatKelas.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching guru data:", error));
  });
  // Event listener untuk kelasKhususElement
  kelasKhususElement.addEventListener("click", function () {
    formKelas1Element.style.display = "block";
    formKelasElement.style.display = "none"; // Sembunyikan form kelas umum
    dropdownKelas.style.display = "none"; // Menyembunyikan dropdown saat "Kelas Khusus" diklik

    // Mengisi form kelas khusus dengan data dari database
    fetch("/get_guru_data")
      .then((response) => response.json())
      .then((data) => {
        // Mengisi dropdown nama guru
        namaGuruDropdown1.innerHTML = "";
        data.forEach((guru) => {
          var option = document.createElement("option");
          option.text = guru.nama;
          option.value = guru.nama;
          namaGuruDropdown1.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching guru data:", error));

    fetch("/get_siswa_data")
      .then((response) => response.json())
      .then((data) => {
        // Mengisi dropdown tingkat kelas
        tingkatKelasDropdown.innerHTML = "";
        data.forEach((siswa) => {
          var option = document.createElement("option");
          option.text = siswa.kelas; // Pastikan properti 'tingkat_kelas' ada di data
          option.value = siswa.kelas;
          tingkatKelasDropdown.appendChild(option);
        });

        // Mengisi dropdown jenis disabilitas
        jenisDisabilitasDropdown.innerHTML = "";
        data.forEach((siswa) => {
          var option = document.createElement("option");
          option.text = siswa.jenis_disabilitas;
          option.value = siswa.jenis_disabilitas;
          jenisDisabilitasDropdown.appendChild(option);
        });
      })
      .catch((error) => console.error("Error fetching siswa data:", error));
  });

  // ...

  // Fungsi untuk toggle overlay dan konten
  function toggleContent() {
    var isHidden = overlay.style.display === "none";
    overlay.style.display = isHidden ? "block" : "none";
    contentToToggle.style.display = isHidden ? "block" : "none";
  }

  // Event listener untuk tambahKelasButton
  tambahKelasButton.addEventListener("click", function () {
    var isHidden = dropdownKelas.style.display === "none";
    dropdownKelas.style.display = isHidden ? "block" : "none";
    if (isHidden) {
    }
  });

  // Event listener untuk menangkap perubahan pada dropdown
  dropdownKelas.addEventListener("change", function () {
    var selectedKelas = dropdownKelas.value;
    document.getElementById("tingkatKelas").value = selectedKelas;
  });

  // Event listener untuk close button form kelas umum
  document.getElementById("closeBtn").addEventListener("click", function () {
    formKelasElement.style.display = "none";
  });

  // Event listener untuk close button form kelas khusus
  document.getElementById("closeBtn1").addEventListener("click", function () {
    formKelas1Element.style.display = "none";
  });
});

// Event listener untuk tombol hapus
function hapusKelas(id) {
  // Lakukan konfirmasi sebelum menghapus
  if (confirm("Apakah Anda yakin ingin menghapus kelas ini?")) {
    // Buat permintaan DELETE ke server
    fetch(`/delete_kelas/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Jika penghapusan berhasil, berikan umpan balik kepada pengguna
          alert("Kelas berhasil dihapus.");
          // Reload halaman
          location.reload();
        } else {
          alert("Terjadi kesalahan saat menghapus kelas.");
        }
      })
      .catch((error) => {
        console.error("Error deleting class:", error);
        alert("Terjadi kesalahan saat menghapus kelas.");
      });
  }
}


