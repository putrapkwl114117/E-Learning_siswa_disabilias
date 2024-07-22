document.addEventListener("DOMContentLoaded", function () {
  loadDashboard();
});

function loadDashboard() {
  axios
    .get("/get_kelas_dan_siswa")
    .then((response) => {
      displayDashboard(response.data);
    })
    .catch((error) => console.error("Error fetching dashboard data:", error));
}

function displayDashboard(data) {
  const kelasInfo = document.getElementById("kelas-info");
  kelasInfo.innerHTML = `<p>Kelas: ${data.kelas.namaKelas} - Tingkat: ${data.kelas.tingkat}</p>`;

  const siswaList = document.getElementById("siswa-list");
  siswaList.innerHTML = ""; // Clear existing content

  data.siswa.forEach((siswa) => {
    const listItem = document.createElement("li");
    listItem.textContent = siswa.name;
    siswaList.appendChild(listItem);
  });
}

// Function to close form when clicking outside
function closeForm(event) {
    const addStudentForm = document.getElementById("add-student-form");
    if (!addStudentForm.contains(event.target)) {
        addStudentForm.style.display = "none";
    }
}

// Add event listener to document
document.addEventListener("click", closeForm);

function showForm() {
  var modal = document.getElementById("add-student-form");
  modal.style.display = "block";

  // Mengatur kelas CSS untuk mengubah ukuran tabel
  var table = document.getElementById("table-container");
  table.classList.add("small-table");
}

function closeForm() {
  var modal = document.getElementById("add-student-form");
  modal.style.display = "none";

  // Hapus kelas CSS untuk mengembalikan ukuran tabel ke ukuran normal
  var table = document.getElementById("table-container");
  table.classList.remove("small-table");
}
