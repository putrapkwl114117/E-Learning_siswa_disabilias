function hapusDataSiswa(NISN) {
  if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", "/hapus-siswa", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        var status = xhr.status;
        if (status >= 200 && status < 400) {
          var response = JSON.parse(xhr.responseText);
          alert(response.message);
          window.location.href = "dashboard_admin"; 
        } else {
          alert("Gagal menghapus data siswa. Silakan coba lagi.");
          window.location.href = "dashboard_admin"; 
        }
      }
    };

    var data = JSON.stringify({ NISN: NISN });
    xhr.send(data);
  }
}
