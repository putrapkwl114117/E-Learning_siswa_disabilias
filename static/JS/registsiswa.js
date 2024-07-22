function daftarData(NISN) {
  var userType = "siswa"; // Deklarasi userType sebagai 'siswa'

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/daftar-siswa", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      var status = xhr.status;
      if (status >= 200 && status < 400) {
        var response = JSON.parse(xhr.responseText);
        alert(
          "Siswa berhasil didaftarkan.\nUsername: " +
            response.username +
            "\nPassword: " +
            response.password
        );

        // Mengubah tombol menjadi tombol "share"
        var daftarData = document.querySelector(
          `button[onclick="daftarData('${NISN}')"]`
        );
        daftarData.innerHTML = '<i class="fas fa-share"></i>';
        daftarData.setAttribute(
          "onclick",
          `bagikanKredensial('${response.username}', '${response.password}')`
        );
      } else {
        alert("Gagal mendaftarkan siswa. Silakan coba lagi.");
      }
    }
  };

  // Ambil nama siswa dari elemen input (sesuaikan dengan ID elemen yang benar)
  var name = document.getElementById("name" + NISN).value;

  var data = JSON.stringify({ NISN: NISN, name: name, user_type: userType });
  xhr.send(data);
}

function bagikanKredensial(username, password) {
  var credentialsUrl =
    window.location.origin +
    `/show_credentials?username=${encodeURIComponent(
      username
    )}&password=${encodeURIComponent(password)}`;
  var message = `Username: ${username}\nPassword: ${password}\nAkses melalui tautan berikut: ${credentialsUrl}`;
  var whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
}
