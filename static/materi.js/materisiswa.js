document.addEventListener("DOMContentLoaded", function () {
  var cardsContainer = document.getElementById("cardsContainerCustom");
  var materiContainer = document.getElementById("daftar-materi");

  // Fungsi untuk mengambil semua materi dari server
  function ambilMateri() {
    console.log("Mengambil data materi...");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/ambil-materi", true); // Endpoint untuk mengambil semua materi
    xhr.onload = function () {
      if (xhr.status === 200) {
        console.log("Data materi berhasil diambil.");
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
        cardTitle.textContent = item.judul; // Hanya gunakan judul materi di cardTitle
        cardBody.appendChild(cardTitle);


      var cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      var guruInfo = document.createElement("p");
      guruInfo.classList.add("card-text");
      guruInfo.textContent = "Guru: " + item.nama_guru;
      cardBody.appendChild(guruInfo);

      var kelasInfo = document.createElement("p");
      kelasInfo.classList.add("card-text");
      kelasInfo.textContent = "Kelas: " + item.tingkat_kelas;
      cardBody.appendChild(kelasInfo);

      var cardImage = document.createElement("img"); // Create an image element
      cardImage.setAttribute(
        "src",
        `https://picsum.photos/200/300?random=${Math.random()}`
      ); // Set the image source to a random image from Lorem Picsum
      cardImage.setAttribute("alt", "Random Image"); // Set the image alt text
      cardImage.style.width = "100%"; // Set image width to 100%
      cardBody.appendChild(cardImage); // Append the image to the card body

      var viewButton = document.createElement("button");
      viewButton.classList.add("viewmateri");
      viewButton.textContent = "Pelajari"; // Change the button text to "Pelajari"
      viewButton.addEventListener("click", function () {
        window.open(`/materi.html?materiId=${item._id}`, "_blank");
      });
      cardBody.appendChild(viewButton);

      card.appendChild(cardBody);
      cardsContainer.appendChild(card); // Append the card to the cards container
    });
  }

  // Ambil semua materi saat halaman dimuat
  ambilMateri();
});
