// Periksa dukungan API Web Speech
if ("webkitSpeechRecognition" in window && "speechSynthesis" in window) {
  const recognition = new webkitSpeechRecognition();
  const synthesis = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();

  let isRecognitionActive = false;

  // Konfigurasi pengenalan suara
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "id-ID";

  recognition.onresult = function (event) {
    const result = event.results[event.resultIndex][0].transcript.toLowerCase();
    processCommand(result);
  };

  recognition.onerror = function (event) {
    console.error(event.error);
    utterance.text = "Maaf, terjadi kesalahan saat mengenali suara.";
    synthesis.speak(utterance);
  };

  recognition.onend = function () {
    if (isRecognitionActive) {
      recognition.start();
    }
  };

  // Fungsi untuk memproses perintah suara
  function processCommand(command) {
    if (command.includes("dashboard")) {
      window.location.href = "#"; // Ganti dengan URL dashboard Anda
    } else if (command.includes("admin")) {
      showOverlay(); // Fungsi yang sudah ada untuk admin
    } else if (command.includes("belajar membaca")) {
        window.location.href = "/membaca";  // Fungsi yang sudah ada untuk admin
    } else if (command.includes("guru")) {
      showOverlay1(); // Fungsi yang sudah ada untuk guru
    } else if (command.includes("siswa")) {
      window.location.href = "#"; // Ganti dengan URL siswa Anda
    } else if (command.includes("sign out")) {
      window.location.href = "index.html";
    } else if (command.includes("nonaktifkan asisten")) {
      stopRecognition();
    } else {
      utterance.text = "Perintah tidak dikenal. Coba lagi.";
      synthesis.speak(utterance);
    }
  }

  // Fungsi untuk mengatur atribut suara
  function setVoiceAttributes() {
    utterance.pitch = 1; // Suara normal
    utterance.rate = 1; // Kecepatan normal
    utterance.volume = 1; // Volume maksimum
  }

  // Fungsi untuk memulai pengenalan suara
  function startRecognition() {
    if (!isRecognitionActive) {
      isRecognitionActive = true;
      recognition.start();
      utterance.text = "Asisten suara diaktifkan. Apa yang bisa saya bantu?";
      setVoiceAttributes();
      synthesis.speak(utterance);
      document.getElementById("voiceAssistantBtn").textContent =
        "Nonaktifkan Asisten Suara";
    } else {
      stopRecognition();
    }
  }

  // Fungsi untuk menghentikan pengenalan suara
  function stopRecognition() {
    if (isRecognitionActive) {
      isRecognitionActive = false;
      recognition.stop();
      utterance.text = "Asisten suara dinonaktifkan.";
      setVoiceAttributes();
      synthesis.speak(utterance);
      document.getElementById("voiceAssistantBtn").textContent =
        "Aktifkan Asisten Suara";
    }
  }

  // Tambahkan event listener ke tombol
  document
    .getElementById("voiceAssistantBtn")
    .addEventListener("click", startRecognition);
} else {
  console.warn("Web Speech API tidak didukung di browser ini.");
  alert("Web Speech API tidak didukung di browser ini.");
}
