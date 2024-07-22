document.addEventListener("DOMContentLoaded", function () {
  // Memanggil fungsi untuk menampilkan jadwal mapel saat halaman dimuat
  tampilkanJadwalMapel();
});

// Fungsi untuk menampilkan jadwal mapel
function tampilkanJadwalMapel() {
  // Mendapatkan div jadwalMapel
  const jadwalMapelDiv = document.getElementById("jadwalMapel");
  // Mengosongkan konten div jadwalMapel
  jadwalMapelDiv.innerHTML = "";

  // Mengambil data jadwal mapel dari endpoint
  fetch("/get_jadwal_mapel_data")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch jadwal mapel data");
      }
      return response.json();
    })
    .then((jadwalMapelData) => {
      // Membuat tabel untuk menampilkan jadwal mapel
      const table = document.createElement("table");
      // Membuat header tabel
      const headerRow = table.insertRow();
      const headers = [
        "Nama Mapel",
        "Hari",
        "Kelas",
        "Jam Mulai",
        "Jam Selesai",
      ];
      headers.forEach((headerText) => {
        const header = document.createElement("th");
        header.textContent = headerText;
        headerRow.appendChild(header);
      });

      // Menambahkan data jadwal mapel ke dalam tabel
      jadwalMapelData.forEach((jadwal) => {
        const row = table.insertRow();
        const values = [
          jadwal.nama_mapel,
          jadwal.hari,
          jadwal.kelas,
          jadwal.jam_mulai,
          jadwal.jam_selesai,
        ];
        values.forEach((val, index) => {
          const cell = row.insertCell();
          cell.textContent = val;
          // Set warna latar belakang untuk kolom hari
          if (index === 1) {
            cell.style.backgroundColor = tentukanWarnaLatarBelakang(
              jadwal.hari
            );
          }
          // Set warna latar belakang untuk kolom jam mulai dan jam selesai
          if (index === 3 || index === 4) {
            cell.style.backgroundColor = tentukanWarnaLatarBelakang(
              jadwal.hari,
              parseInt(jadwal.jam_mulai),
              parseInt(jadwal.jam_selesai)
            );
          }
        });
      });

      // Menambahkan tabel ke dalam div jadwalMapel
      jadwalMapelDiv.appendChild(table);
    })
    .catch((error) => {
      console.error("Error fetching jadwal mapel data:", error);
    });
}

// Fungsi untuk menentukan warna latar belakang berdasarkan hari dan jam saat ini
function tentukanWarnaLatarBelakang(hari, jamMulai, jamSelesai) {
  const hariSaatIni = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
  });
  const jamSaatIni = new Date().getHours();

  // Jika hari dijadwalkan sama dengan hari saat ini dan jam saat ini berada di antara jam mulai dan jam selesai
  if (
    hari.toLowerCase() === hariSaatIni.toLowerCase() &&
    jamMulai <= jamSaatIni &&
    jamSaatIni < jamSelesai
  ) {
    return "lightblue"; // Atur warna latar belakang saat jadwal sedang berlangsung
  } else {
    return "white"; // Atur warna latar belakang default
  }
}
