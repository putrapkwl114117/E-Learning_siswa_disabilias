function fetchStudents() {
  const disability = document.getElementById("disability").value;
  const gradeLevel = document.getElementById("gradeLevel").value;

  fetch(`/api/students?disability=${disability}&gradeLevel=${gradeLevel}`)
    .then((response) => response.json())
    .then((data) => {
      console.log('Students data:', data); // Debugging line
      if (!Array.isArray(data.students)) {
        throw new TypeError('Expected students to be an array');
      }
      const students = data.students;
      const studentCheckboxes = document.getElementById("studentCheckboxes");
      studentCheckboxes.innerHTML = ""; // Clear previous content

      students.forEach((student) => {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "studentIds[]"; // Menggunakan array untuk menyimpan multiple studentIds
        checkbox.value = student._id;
        checkbox.setAttribute("data-name", student.name); // Menyimpan nama siswa di data-name
        let label = document.createElement("label");
        label.textContent = student.name;
        studentCheckboxes.appendChild(checkbox);
        studentCheckboxes.appendChild(label);
        studentCheckboxes.appendChild(document.createElement("br"));
      });

      const filterResultInfo = document.getElementById("filter-result-info");
      filterResultInfo.textContent = `Ditemukan ${students.length} hasil yang sesuai dengan filter.`;
    })
    .catch((error) => {
      console.error("Error fetching students:", error);
    });
}

function fetchKelas() {
  fetch('/api/kelas')
    .then((response) => response.json())
    .then((data) => {
      console.log('Kelas data:', data); // Debugging line
      if (!Array.isArray(data.kelas)) {
        throw new TypeError('Expected data.kelas to be an array');
      }
      const kelas = data.kelas;
      const classIdSelect = document.getElementById("classId");
      classIdSelect.innerHTML = ""; // Clear previous content

      kelas.forEach((kelasItem) => {
        let option = document.createElement("option");
        option.value = kelasItem._id;
        option.textContent = kelasItem.namaKelas;
        classIdSelect.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching kelas:", error);
    });
}

function showForm() {
  document.getElementById("add-student-form").style.display = "block";
}

function closeForm() {
  document.getElementById("add-student-form").style.display = "none";
}

function updateClassType() {
  // Ambil ID kelas yang dipilih
  const classId = document.getElementById("classId").value;

  // Ambil semua checkbox siswa yang dipilih
  const studentCheckboxes = document.querySelectorAll(
    '#studentCheckboxes input[type="checkbox"]:checked'
  );

  // Persiapkan array untuk menyimpan ID siswa yang dipilih
  const studentIdsArray = [];
  studentCheckboxes.forEach((checkbox) => {
    studentIdsArray.push(checkbox.value);
  });

  // Pastikan ada siswa yang dipilih sebelum mengirimkan formulir
  if (studentIdsArray.length === 0) {
    alert("Pilih setidaknya satu siswa.");
    return;
  }

  // Buat objek FormData untuk mengirimkan data ke server
  const formData = new FormData();
  studentIdsArray.forEach((studentId) => {
    formData.append("studentIds[]", `${studentId}:${classId}`);
  });

  // Kirim formulir dengan data yang diperbarui
  fetch("/assign_student_to_class", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Gagal menambahkan siswa ke kelas");
      }
      // Refresh halaman setelah berhasil menambahkan siswa ke dalam kelas
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error menambahkan siswa ke kelas:", error);
      // Tampilkan pesan kesalahan jika gagal menambahkan siswa ke dalam kelas
      alert("Gagal menambahkan siswa ke kelas");
    });
}


function applyFilters() {
  fetchStudents();
  fetchKelas();
}
