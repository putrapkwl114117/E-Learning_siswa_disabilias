// Inisialisasi originalDataSiswa sebagai objek kosong
let originalDataSiswa = {};

function openModal(NISN) {
  var modalId = "myModal1" + NISN;
  var formContainer = document.getElementById(modalId);
  if (formContainer) {
    formContainer.style.display = "block";
  } else {
    console.error("Modal dengan id " + modalId + " tidak ditemukan.");
  }
}

// Fungsi untuk menutup modal dan formulir
function closeModal() {
  var formContainer = document.getElementById("myModal1");
  if (formContainer) {
    formContainer.style.display = "none";
  } else {
    console.error("Form container tidak ditemukan.");
  }
}

function openEditModal(NISN) {
  fetch(`/get-siswa?NISN=${NISN}`)
    .then((response) => response.json())
    .then((data) => {
      // Simpan data asli dalam originalData
      originalDataSiswa = { ...data };
      console.log(data);

      // Isi nilai input dengan data siswa yang akan diedit
      document.getElementById(`name${NISN}`).value = data.name;
      document.getElementById(`jenis_kelamin${NISN}`).value =
        data.jenis_kelamin;
      document.getElementById(`ttl${NISN}`).value = data.ttl;
      document.getElementById(`agama${NISN}`).value = data.agama;
      document.getElementById(`address_siswa${NISN}`).value =
        data.address_siswa;
      document.getElementById(`jenis_disabilitas${NISN}`).value =
        data.jenis_disabilitas;
      document.getElementById(`nama_ayah${NISN}`).value = data.nama_ayah;
      document.getElementById(`pekerjaan_ayah${NISN}`).value =
        data.pekerjaan_ayah;
      document.getElementById(`nama_ibu${NISN}`).value = data.nama_ibu;
      document.getElementById(`pekerjaan_ibu${NISN}`).value =
        data.pekerjaan_ibu;
      document.getElementById(`address_ortu${NISN}`).value = data.address_ortu;
      document.getElementById(`notlp${NISN}`).value = data.notlp;
      document.getElementById(`NISN${NISN}`).value = data.NISN;
      document.getElementById(`kelas${NISN}`).value = data.kelas;
      document.getElementById(`tahun_masuk${NISN}`).value = data.tahun_masuk;

      // Tampilkan modal
      openModal(NISN);
    })
    .catch((error) => console.error("Error:", error));
}

function saveChanges(NISN) {
  // Dapatkan nilai input dari elemen-elemen modal
  var editedName = document.getElementById(`name${NISN}`).value;
  var editedTTL = document.getElementById(`ttl${NISN}`).value;
  var editedJenisKelamin = document.getElementById(
    `jenis_kelamin${NISN}`
  ).value;
  var editedAgama = document.getElementById(`agama${NISN}`).value;
  var editedAddressSiswa = document.getElementById(
    `address_siswa${NISN}`
  ).value;
  var editedJenisDisabilitas = document.getElementById(
    `jenis_disabilitas${NISN}`
  ).value;
  var editedNamaAyah = document.getElementById(`nama_ayah${NISN}`).value;
  var editedPekerjaanAyah = document.getElementById(
    `pekerjaan_ayah${NISN}`
  ).value;
  var editedNamaIbu = document.getElementById(`nama_ibu${NISN}`).value;
  var editedPekerjaanIbu = document.getElementById(
    `pekerjaan_ibu${NISN}`
  ).value;
  var editedAddressOrtu = document.getElementById(`address_ortu${NISN}`).value;
  var editedNoTelp = document.getElementById(`notlp${NISN}`).value;
  var editedKelas = document.getElementById(`kelas${NISN}`).value;
  var editedTahunMasuk = document.getElementById(`tahun_masuk${NISN}`).value;

  // Buat objek data untuk dikirim ke server
  var data = {
    NISN: NISN,
    name: editedName,
    ttl: editedTTL,
    jenis_kelamin: editedJenisKelamin,
    agama: editedAgama,
    address_siswa: editedAddressSiswa,
    jenis_disabilitas: editedJenisDisabilitas,
    nama_ayah: editedNamaAyah,
    pekerjaan_ayah: editedPekerjaanAyah,
    nama_ibu: editedNamaIbu,
    pekerjaan_ibu: editedPekerjaanIbu,
    address_ortu: editedAddressOrtu,
    notlp: editedNoTelp,
    kelas: editedKelas,
    tahun_masuk: editedTahunMasuk,
  };

  var requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Pastikan tipe konten disetel sebagai application/json
    },
    body: JSON.stringify(data),
  };

  fetch("/edit-siswa", requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Gagal memperbarui data siswa.");
      }
    })
    .then((data) => {
      alert(data.message);
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    });
}
