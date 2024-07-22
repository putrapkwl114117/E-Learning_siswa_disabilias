document.addEventListener("DOMContentLoaded", function () {
  var materiContainer = document.getElementById("daftar-materi");
  var initialContent = document.getElementById("initialContent");
  var rosterTable = document.getElementById("rostertable");
  var kelasContent = document.getElementById("table-container");
   var taskFormContainer = document.getElementById("taskFormContainer");

  // Fungsi untuk mengambil semua materi dari server
  function ambilMateri() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/ambil-materi", true); // Endpoint untuk mengambil semua materi
    xhr.onload = function () {
      if (xhr.status === 200) {
        var materi = JSON.parse(xhr.responseText);
        tampilkanMateri(materi);
      } else {
        console.error("Gagal mengambil data materi.");
      }
    };
    xhr.send();
  }

  // Fungsi untuk menampilkan semua materi dalam daftar
  function tampilkanMateri(materi) {
    var colors = [
      "#ffadad",
      "#ffd6a5",
      "#fdffb6",
      "#caffbf",
      "#9bf6ff",
      "#a0c4ff",
      "#bdb2ff",
      "#ffc6ff",
    ]; // Daftar warna

    materiContainer.innerHTML = ""; // Kosongkan konten sebelumnya

    materi.forEach(function (item) {
      var card = document.createElement("div");
      card.classList.add("card");

      // Set warna latar belakang acak
      var randomColor = colors[Math.floor(Math.random() * colors.length)];
      card.style.backgroundColor = randomColor;

      var cardHeader = document.createElement("div");
      cardHeader.classList.add("card-header");
      cardHeader.textContent = item.judul;
      card.appendChild(cardHeader);

      var cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      var cardTitle = document.createElement("h5");
      cardTitle.classList.add("card-title");
      cardTitle.textContent = item.judul;
      cardBody.appendChild(cardTitle);

      var cardContent = document.createElement("p");
      cardContent.classList.add("card-text");
      cardContent.textContent = item.konten;
      cardBody.appendChild(cardContent);

      var guruInfo = document.createElement("p");
      guruInfo.classList.add("card-text");
      guruInfo.textContent = "Nama Guru: " + item.nama_guru;
      cardBody.appendChild(guruInfo);

      var kelasInfo = document.createElement("p");
      kelasInfo.classList.add("card-text");
      kelasInfo.textContent = "Tingkat Kelas: " + item.tingkat_kelas;
      cardBody.appendChild(kelasInfo);

      var viewButton = document.createElement("button");
      viewButton.classList.add("viewmateri");
      viewButton.textContent = "Mengajar";
      viewButton.addEventListener("click", function () {
        window.open(`/materi.html?materiId=${item._id}`, "_blank");
      });
      cardBody.appendChild(viewButton);

      card.appendChild(cardBody);
      materiContainer.appendChild(card);
    });
  }

  // Fungsi untuk menampilkan materi dan menyembunyikan konten lain
  function showMateri() {
    initialContent.style.display = "none"; // Sembunyikan initialContent
    rosterTable.style.display = "none"; // Sembunyikan rosterTable
    kelasContent.style.display = "none"; // Sembunyikan kelasContent
    materiContainer.style.display = "block"; // Tampilkan kontainer materi
    ambilMateri();
  }

  // Fungsi untuk menampilkan tabel roster dan menyembunyikan konten lain
  function showRoster() {
    initialContent.style.display = "block"; // Sembunyikan initialContent
    materiContainer.style.display = "none"; // Sembunyikan kontainer materi
    kelasContent.style.display = "none"; // Sembunyikan kelasContent
    rosterTable.style.display = "block"; // Tampilkan rosterTable
  }


  // Fungsi untuk menampilkan konten awal dan menyembunyikan konten lain
  function showInitialContent() {
    initialContent.style.display = "block"; // Tampilkan initialContent
    materiContainer.style.display = "none"; // Sembunyikan kontainer materi
    rosterTable.style.display = "block"; // Sembunyikan rosterTable
  }

  // Event listener untuk menu Dashboard
  document
    .getElementById("dashboardMenu")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Mencegah aksi default dari link
      // Cek apakah materi atau tabel sedang ditampilkan, jika ya, jangan lakukan apa-apa
      if (
        materiContainer.style.display === "none" ||
        rosterTable.style.display === "block"
      ) {
        return;
      } // Jika tidak, tampilkan konten awal
      showInitialContent();
    });

  // Event listener untuk menu Materi
  document
    .getElementById("materiMenu")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Mencegah aksi default dari link
      showMateri();
    });

  // Event listener untuk menu Roster (tabel)
  document
    .getElementById("rosterMenu")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Mencegah aksi default dari link
      showRoster();
    });

  // Event listener untuk kembali ke konten awal
  document
    .getElementById("homeMenu")
    .addEventListener("click", function (event) {
      event.preventDefault(); // Mencegah aksi default dari link
        showInitialContent();

    });
});

