const images = {
  Kelas: ["class1.jpg", "class2.jpg", "class3.jpg"],
  Tugas: ["task1.jpg", "task2.jpg", "task3.jpg"],
  Materi: ["material1.jpg", "material2.jpg", "material3.jpg"],
};

document.querySelectorAll(".card").forEach((card, index) => {
  let category = card.getAttribute("aria-label");
  let imgElement = card.querySelector(".responsive-img");
  let imgIndex = 0;
  setInterval(() => {
    imgElement.src = images[category][imgIndex];
    imgIndex = (imgIndex + 1) % images[category].length;
  }, 3000); // Ganti gambar setiap 3 detik
});
