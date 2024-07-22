Spesifikasi Persyaratan Perangkat Lunak
untuk
DistStudy

Versi 1.0 disetujui

25 Maret 2024 


1.1	Tujuan
Dokumen ini bertujuan untuk menentukan persyaratan perangkat lunak untuk Perancangan dan pengembangan Aplikasi Web Media Pembelajaran Siswa Disabilita. Tujuannya adalah memberikan panduan yang jelas kepada tim pengembang tentang apa yang harus dibangun dan menyediakan dasar yang solid untuk komunikasi antara anggota tim pengembang, pemangku kepentingan, dan pihak terkait lainnya. Dokumen ini juga akan digunakan sebagai bahan acuan dalam proses pengembangan dan sebagai bahan evaluasi pada saat proses pengembangan perangkat lunak atau di akhir pengembangannya.


1.2	Konvensi Dokumen
Dokumen ini mengikuti standar tipografi dan format yang ditetapkan oleh Universitas Jenderal Achmad Yani Yogyakarta untuk memastikan konsistensi dan kejelasan. Adopsi konvensi ini bertujuan untuk memudahkan pembaca dalam menavigasi dokumen, memahami informasi, dan menemukan persyaratan yang relevan dengan cepat dan efisien. Berikut adalah beberapa konvensi dokumen yang diikuti:

•	Font dan Format Teks
Digunakan font yang mudah dibaca dan format teks yang konsisten di seluruh dokumen untuk menjaga kejelasan dan konsistensi.

•	Penomoran Halaman
Setiap halaman memiliki nomor halaman yang terletak di bagian bawah atau atas halaman, membantu pembaca untuk merujuk ke bagian-bagian tertentu dengan mudah.

•	Struktur Terorganisir
Dokumen disusun dengan struktur yang terorganisir, dimulai dari bagian pendahuluan hingga bagian-bagian terkait seperti ruang lingkup produk, persyaratan fungsional, dan lainnya. Setiap bagian memiliki judul yang jelas untuk membedakan antara satu bagian dengan yang lainnya.

•	Penggunaan Gaya Bahasa yang Konsisten
Gaya bahasa yang konsisten digunakan di seluruh dokumen untuk menjaga keseragaman dan memudahkan pemahaman. Penggunaan istilah yang tepat dan konsisten juga diperhatikan.

•	Format Persyaratan Fungsional
Persyaratan fungsional ditulis dalam format yang jelas dan terstruktur, dengan nomor urut atau tag yang unik untuk mengidentifikasi setiap persyaratan. Setiap persyaratan harus ringkas, lengkap, tidak ambigu, dan dapat diverifikasi.

•	Referensi yang Jelas
Setiap referensi yang digunakan dalam dokumen, seperti dokumen visi dan ruang lingkup, standar antarmuka pengguna, dan dokumen spesifikasi teknis, disertakan dengan informasi yang jelas tentang judul, penulis, dan nomor versi.


1.3	Audiens yang dituju dan Saran Bacaan
Audiens yang dituju untuk dokumen ini meliputi berbagai pihak yang terlibat dalam pengembangan, pengujian, dan penggunaan perangkat lunak Aplikasi Web Media Pembelajaran Siswa Disabilitas. Saran bacaan dapat disesuaikan dengan kebutuhan masing-masing audiens. Berikut adalah audiens yang dituju dan saran bacaan untuk masing-masing:


1.3.1 Pengembang Perangkat Lunak
Saran Bacaan: 
Buku panduan pengembangan web, tutorial Flask dan MongoDB, dokumentasi API pihak ketiga untuk pengenalan penggunaan API AI untuk mengonversi teks menjadi audio dan video.

1.3.2 Manajer Proyek
Saran Bacaan:
Buku atau artikel tentang manajemen proyek perangkat lunak, panduan manajemen risiko, dan sumber daya tentang penyusunan jadwal proyek.

1.3.3 Guru
Saran Bacaan:
Panduan pengguna untuk Aplikasi Web Media Pembelajaran Siswa Disabilita, sumber daya tentang pendekatan pembelajaran inklusif, dan materi pelatihan tentang penggunaan teknologi dalam pendidikan khusus.

1.3.4 Siswa
Saran Bacaan:
Panduan pengguna untuk aplikasi web, tutorial atau panduan singkat tentang cara menggunakan fitur-fitur aplikasi, dan sumber daya pendukung untuk belajar secara mandiri.

1.3.5 Orang Tua Siswa
Saran Bacaan:
Informasi tentang manfaat pendidikan inklusif, panduan pengguna untuk aplikasi web, dan sumber daya tentang cara mendukung pembelajaran anak dengan disabilitas.

1.3.6 Pihak Terkait Lainnya (Staf Administrasi Sekolah, Pakar Pendidikan Khusus, dll)
Saran Bacaan: 
Dokumen visi dan ruang lingkup proyek, laporan progres proyek, dan sumber daya tentang pendekatan inklusif dalam pendidikan.

1.4	Ruang Lingkup Produk
Ruang Lingkup Produk Aplikasi Web Media Pembelajaran Siswa Disabilita mencakup berbagai fitur dan fungsionalitas yang dirancang untuk menciptakan lingkungan pembelajaran yang inklusif dan disesuaikan dengan kebutuhan siswa penyandang disabilitas. Berikut adalah gambaran singkat tentang ruang lingkup produk:

1.4.1 Konten Pembelajaran Disesuaikan
Guru dapat membuat, mengelola, dan menyajikan konten pembelajaran yang disesuaikan dengan kebutuhan siswa penyandang disabilitas. Ini termasuk teks, gambar, audio, dan video yang dapat diakses oleh siswa dengan berbagai tingkat kemampuan.

1.4.2 Fasilitas Interaktif 
Aplikasi ini menyediakan fasilitas interaktif, seperti tugas, kuis, dan aktivitas pembelajaran lainnya, yang dapat diakses dan diselesaikan oleh siswa sesuai dengan kemampuan mereka.

1.4.3 Manajemen Kelas
Guru dapat membuat kelas sesuai dengan tingkat kesulitan dan kebutuhan siswa. Mereka dapat mengelola konten pembelajaran, memberikan tugas, dan melacak kemajuan siswa dalam kelas.

1.4.4 Kehadiran dan Evaluasi
Guru dapat mencatat kehadiran siswa, membuat catatan tentang kinerja mereka, dan memberikan penilaian sesuai dengan progres belajar mereka.

1.4.5 Akses Orang Tua
Orang tua siswa memiliki akses untuk melacak kemajuan belajar anak mereka melalui aplikasi ini. Mereka dapat melihat hasil evaluasi, kehadiran, dan konten pembelajaran yang disediakan.

1.4.6 Integrasi Teknologi AI
Aplikasi ini akan mengintegrasikan teknologi kecerdasan buatan (AI) pihak ketiga untuk mengonversi teks menjadi audio dan video pembelajaran, sehingga siswa dapat memilih cara belajar yang paling sesuai dengan kebutuhan mereka.



![image](https://github.com/user-attachments/assets/1bd58b50-20e4-4ee4-bb43-e1e048c5cd52)

![image](https://github.com/user-attachments/assets/e29d0162-c86c-428f-a658-33f19a5dcf11)

![image](https://github.com/user-attachments/assets/61433c77-787a-46ed-b4e2-c856be5f4411)

![image](https://github.com/user-attachments/assets/ad2d6030-f270-4e80-b4f6-39839c3af03f)

![image](https://github.com/user-attachments/assets/bc2cb4c8-2a3d-40aa-862e-5f23f0c292c9)


![image](https://github.com/user-attachments/assets/47f0f98c-8fd2-4c24-b3fa-5a9229c9fa1e)


![image](https://github.com/user-attachments/assets/bee90b77-7fcc-4ef1-a841-8ef390ecfc1c)




contact me:
Whatsapp >>> 082314969109
email    >>> putrapongkowulu@gmail.com





