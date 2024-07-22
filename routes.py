from flask import Flask, render_template, redirect, request, session, url_for, flash,jsonify
from pymongo import MongoClient
from werkzeug.security import check_password_hash, generate_password_hash
import secrets
import string
from bson.objectid import ObjectId
import random
import re
from bson import json_util
request
from datetime import datetime
from flask_wtf import FlaskForm
from wtforms import StringField, TextAreaField, validators


app = Flask(__name__)
app.secret_key = 'pongkowulu114117'

# Koneksi ke MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['putra']  


# Fungsi untuk membuat koleksi jika belum ada
def create_collection(collection_name):
    if collection_name not in db.list_collection_names():
        db.create_collection(collection_name)

# Memastikan koleksi admin ada
create_collection('admin')

users_collection = db['admin']


@app.route('/assign_student_to_class', methods=['POST'])
def assign_student_to_class():
    try:
        # Ambil data dari form
        student_ids_with_class = request.form.getlist('studentIds[]')  # Mengambil multiple studentIds
        class_id = request.form.get('classId')

        # Loop melalui setiap siswa yang dipilih dan tambahkan ID kelas ke array kelasIds siswa
        for student_id_with_class in student_ids_with_class:
            student_id, class_id = student_id_with_class.split(':')
            db.siswa.update_one(
                {'_id': ObjectId(student_id)},
                {'$addToSet': {'kelasIds': class_id}}
            )

        print(f"Added students {student_ids_with_class} to class {class_id}")  # Debugging log

        # Redirect ke halaman dashboard guru
        return redirect(url_for('dashboard_guru'))

    except Exception as e:
        print(f"Error occurred: {e}")
        # Redirect ke halaman dashboard guru jika terjadi kesalahan
        return redirect(url_for('dashboard_guru'))
    
@app.route('/api/students', methods=['GET'])
def get_students():
    try:
        disability_filter = request.args.get('disability', 'all')
        grade_level_filter = request.args.get('gradeLevel', 'all')

        # Bangun kueri berdasarkan filter yang diberikan
        query = {}
        if disability_filter != 'all':  # Check for 'all'
            query['jenis_disabilitas'] = disability_filter
        if grade_level_filter != 'all':  # Check for 'all'
            query['kelas'] = grade_level_filter

        # Ambil daftar siswa sesuai dengan kueri
        students = db.siswa.find(query, {'_id': 1, 'name': 1, 'kelas': 1})

        # Konversi ObjectId menjadi string dan tambahkan ke dalam list
        students_list = []
        for student in students:
            student['_id'] = str(student['_id'])  # Konversi ObjectId menjadi string
            students_list.append(student)

        # Return JSON response with 'students' property
        return jsonify({'students': students_list})
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': 'An error occurred while fetching students'}), 500

@app.route('/api/kelas', methods=['GET'])
def get_kelas():
    try:
        kelas = list(db.new_class.find({}, {'_id': 1, 'namaKelas': 1, 'jenisKelas': 'new_class'}))
        kelas_khusus = list(db.new_class_khusus.find({}, {'_id': 1, 'namaKelas': 1, 'jenisKelas': 'new_class_khusus'}))
        # Mengonversi ObjectId menjadi string sebelum mengirimkan respons JSON
        kelas = [{**kelas_item, '_id': str(kelas_item['_id'])} for kelas_item in kelas]
        kelas_khusus = [{**kelas_item, '_id': str(kelas_item['_id'])} for kelas_item in kelas_khusus]
        return jsonify({'kelas': kelas + kelas_khusus})
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': 'An error occurred while fetching classes'}), 500




@app.route('/')
def index():
    # Mengecek apakah pengguna sudah login
    if 'username' in session:
        # Mengambil nama pengguna dari session
        username = session['username']
        return render_template('index.html', username=username)
    else:
        return render_template('index.html')

    
@app.route('/membaca')
def membaca():
    # Mengecek apakah pengguna sudah login
        return render_template('membaca.html')
@app.route('/dsh')
def dsh():
    # Mengecek apakah pengguna sudah login
        return render_template('index.html')
@app.route('/materi.html')
def materi():
    # Mengecek apakah pengguna sudah login
        return render_template('materi.html')

@app.route('/dashboard_admin')
def dashboard_admin():
    if 'username' not in session or session.get('role') != 'admin':
        return redirect(url_for('index'))

    try:
        # Ambil data guru dari koleksi "guru"
        data_guru = list(db.guru.find())

        # Ambil data siswa dari koleksi "siswa"
        data_siswa = list(db.siswa.find())

        # Buat link langsung ke halaman show_credentials
        credentials_link = url_for('show_credentials', _external=True)

        # Melewatkan pesan berhasil ke template
        success_message = session.pop('success_message', None)

        return render_template('dashboardadmin.html', data_guru=data_guru, data_siswa=data_siswa, success_message=success_message, credentials_link=credentials_link)

    except Exception as e:
        # Mengembalikan pesan error jika terjadi kesalahan
        return render_template('error.html', error=str(e))


@app.route('/submit-data', methods=['POST'])
def submit_data():
    if 'username' not in session:
        flash('Anda harus login untuk mengakses halaman ini.', 'error')
        return redirect(url_for('index'))

    nama = request.form.get('nama', '').strip()
    ttl = request.form.get('ttl', '').strip()
    nip = request.form.get('nip', '').strip()
    jenis_kelamin = request.form.get('jenis_kelamin', '').strip()
    tingkatan = request.form.get('tingkatan', '').strip()
    waktu_pengabdian = request.form.get('waktu_pengabdian', '').strip()
    email = request.form.get('email', '').strip()
    posisi = request.form.get('posisi', '').strip()

    # Validasi input
    if not nama or not ttl or not nip or not jenis_kelamin or not tingkatan or not waktu_pengabdian or not email or not posisi:
        flash('Semua kolom harus diisi.', 'error')
        return redirect(url_for('dashboard_admin'))

    try:
        # Membuat koleksi "guru" jika belum ada
        create_collection('guru')

        # Simpan data ke koleksi "guru"
        result = db.guru.insert_one({
            'nama': nama,
            'ttl': ttl,
            'nip': nip,
            'jenis_kelamin': jenis_kelamin,
            'tingkatan': tingkatan,
            'waktu_pengabdian': waktu_pengabdian,
            'posisi': posisi,
            'email': email
        })
        if result.inserted_id:
            flash('Data guru berhasil disimpan.', 'success')
        else:
            flash('Gagal menyimpan data guru.', 'error')
        return redirect(url_for('dashboard_admin'))  # Redirect setelah penyimpanan berhasil
    except Exception as e:
        app.logger.error(f'Error saving guru data: {e}')
        flash('Gagal menyimpan data guru.', 'error')
        return redirect(url_for('dashboard_admin'))  # Redirect jika terjadi kesalahan
    

@app.route('/get_guru')
def get_guru():
    guru_email = request.args.get('email')  # Mengambil email dari parameter query
    app.logger.info(f'Received request for guru with Email: {guru_email}')
    
    if db is not None:
        guru_data = db.guru.find_one({'email': guru_email})  # Menggunakan email untuk mencari data guru
        if guru_data:
            # Konversi ObjectId menjadi string sebelum mengirimkan respons JSON
            guru_data['_id'] = str(guru_data['_id'])
            app.logger.info('Guru data found:', guru_data)
            return jsonify(guru_data), 200  # Mengembalikan data guru dengan status 200 OK
        else:
            app.logger.error('Guru data not found for Email:', guru_email)
            return jsonify({'error': 'Guru not found'}), 404  # Mengembalikan respons 404 jika data guru tidak ditemukan
    else:
        app.logger.error('Database connection error')
        return jsonify({'error': 'Database connection error'}), 500  # Mengembalikan respons 500 jika ada masalah dengan koneksi database

@app.route('/edit-data', methods=['POST'])
def edit_data():
    if 'username' not in session:
        return jsonify({"message": "Anda harus login untuk mengakses halaman ini."}), 401

    try:
        # Ambil data dari payload JSON
        data = request.json

        guru_email = data.get('guru_email')
        nama = data.get('nama', '').strip()
        ttl = data.get('ttl', '').strip()
        jenis_kelamin = data.get('jenis_kelamin', '').strip()
        tingkatan = data.get('tingkatan', '').strip()
        waktu_pengabdian = data.get('waktu_pengabdian', '').strip()
        posisi = data.get('posisi', '').strip()

        # Lakukan pembaruan data di database
        guru = db.guru.find_one({'email': guru_email})
        if not guru:
            return jsonify({"message": "Gagal memperbarui data guru. Data tidak ditemukan."}), 404

        update_data = {} 
        if nama:
            update_data['nama'] = nama
        if ttl:
            update_data['ttl'] = ttl
        if jenis_kelamin:
            update_data['jenis_kelamin'] = jenis_kelamin
        if tingkatan:
            update_data['tingkatan'] = tingkatan
        if waktu_pengabdian:
            update_data['waktu_pengabdian'] = waktu_pengabdian
        if posisi:
            update_data['posisi'] = posisi

        if update_data:
            # Lakukan pembaruan hanya jika ada perubahan data
            result = db.guru.update_one({'email': guru_email}, {'$set': update_data})
            if result.modified_count > 0:
                return jsonify({"message": "Data guru berhasil diperbarui."}), 200
            else:
                return jsonify({"message": "Tidak ada perubahan yang dilakukan."}), 200
        else:
            return jsonify({"message": "Tidak ada perubahan yang dilakukan."}), 200

    except Exception as e:
        app.logger.error(f'Error updating guru data: {e}')
        return jsonify({"message": "Gagal memperbarui data guru."}), 500

@app.route('/hapus-data', methods=['POST'])

def hapus_data():
    if 'username' not in session:
        return jsonify({"message": "Anda harus login untuk mengakses halaman ini."}), 401

    # Ambil nama guru dari data yang akan dihapus dari request POST
    guru_nama = request.form.get('guru_nama')

    try:
        # Hapus data guru berdasarkan nama
        result = db.guru.delete_one({'nama': guru_nama})
        if result.deleted_count > 0:
            return jsonify({"message": "Data guru berhasil dihapus."}), 200
        else:
            return jsonify({"message": "Gagal menghapus data guru."}), 400
    except Exception as e:
        app.logger.error(f'Error deleting guru data: {e}')
        return jsonify({"message": "Gagal menghapus data guru."}), 500


@app.route('/simpan_jadwal', methods=['POST'])
def simpan_jadwal():
    try:
        # Ambil data dari form
        nama_mapel = request.form['namaMapel']
        nama_guru = request.form['namaGuru']
        kelas = request.form['kelas']
        hari = request.form['hari']
        jam_mulai = request.form['jamMulai']
        jam_selesai = request.form['jamSelesai']

        # Simpan data ke koleksi 'jadwal_mapel'
        db.jadwal_mapel.insert_one({
            'nama_mapel': nama_mapel,
            'nama_guru': nama_guru,
            'kelas': kelas,
            'hari': hari,
            'jam_mulai': jam_mulai,
            'jam_selesai': jam_selesai
        })

          # Redirect ke halaman dashboard admin dengan pesan konfirmasi
        return redirect(url_for('dashboard_admin', message='Jadwal mata pelajaran berhasil disimpan.'))
    except Exception as e:
        # Tampilkan pesan kesalahan jika terjadi masalah
        return jsonify({'error': str(e)}), 500

@app.route('/get_jadwal_mapel_data', methods=['GET'])
def get_jadwal_mapel_data():
    try:
        # Ambil semua data jadwal mapel dari koleksi 'jadwal_mapel'
        jadwal_mapel_data = list(db.jadwal_mapel.find())

        # Ubah ObjectId menjadi string untuk setiap dokumen
        for jadwal in jadwal_mapel_data:
            jadwal['_id'] = str(jadwal['_id'])

        # Kembalikan data dalam format JSON
        return jsonify(jadwal_mapel_data), 200
    except Exception as e:
        # Tangani kesalahan jika terjadi masalah
        return jsonify({'error': str(e)}), 500

@app.route('/register_guru', methods=['POST'])
def register_guru():
    if request.method == 'POST':
        # Dapatkan data dari permintaan JSON
        data = request.get_json()

        # Dapatkan data dari JSON
        email = data.get('email')
        nama = data.get('nama')

        # Validasi input
        if not email or not nama:
            return jsonify({'status': 'error', 'message': 'Semua kolom harus diisi.'})

        try:
            # Cek apakah koleksi sudah ada
            if 'registguru' not in db.list_collection_names():
                db.create_collection('registguru')

            # Generate username dari nama
            username = generate_username(nama)

            # Generate password acak
            password = generate_password()

            # Simpan data ke koleksi "registguru"
            db.registguru.insert_one({
                'email': email,
                'nama': nama,
                'username': username,
                'password': password
            })

            # Kirim respons berhasil
            return jsonify({'status': 'success', 'message': 'Guru berhasil didaftarkan.', 'username': username, 'password': password})

        except Exception as e:
            app.logger.error(f'Error saving guru data: {e}')
            return jsonify({'status': 'error', 'message': 'Gagal mendaftarkan guru.'})

    # Jika tidak ada data yang diterima, kembalikan respons dengan status error
    return jsonify({'status': 'error', 'message': 'Metode tidak diizinkan.'})

def generate_username(nama):
    # Menghapus spasi dan mengonversi huruf kecil
    username = nama.lower().replace(' ', '')
    return username

def generate_password(length=12):
    # Menggunakan karakter alfanumerik dan simbol
    characters = string.ascii_letters + string.digits + string.punctuation
    # Menghasilkan password acak
    password = ''.join(secrets.choice(characters) for i in range(length))
    return password

@app.route('/loginguru', methods=['POST'])
def loginguru():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        if not username or not password:
            flash('Semua kolom harus diisi.', 'error')
            return redirect(url_for('index'))

        try:
            # Cari guru berdasarkan username
            guru = db.registguru.find_one({'username': username})

            if guru and guru['password'] == password:
                # Simpan informasi guru di sesi
                session['username'] = username
                session['nama'] = guru['nama']  # Simpan nama guru di sesi jika diperlukan
                session['role'] = 'guru'  # Menetapkan peran sebagai guru
                return redirect(url_for('dashboard_guru'))

            else:
                flash('Username atau password tidak valid.', 'error')
                return redirect(url_for('index'))

        except Exception as e:
            app.logger.error(f'Error during login: {e}')
            flash('Gagal melakukan login.', 'error')
            return redirect(url_for('index'))

@app.route('/dashboard_guru')
def dashboard_guru():
    if 'username' not in session or session.get('role') != 'guru':
        return redirect(url_for('index'))

    try:
       # Pastikan semua kelas memiliki atribut _id
        kelas_data_umum = list(db.new_class.find({'_id': {'$exists': True}}))
        kelas_data_khusus = list(db.new_class_khusus.find({'_id': {'$exists': True}}))
        kelas_data = kelas_data_umum + kelas_data_khusus

        # Render template dengan menyediakan kelas_data
        return render_template('dashboardguru.html', username=session['username'], kelas_data=kelas_data)
    except Exception as e:
        app.logger.error(f'Error fetching kelas data: {e}')
        return render_template('error.html', error='Gagal mengambil data kelas.')

@app.route('/tambah_tugas', methods=['POST'])
def tambah_tugas():
    try:
        # Ambil data dari form
        nama_tugas = request.form.get('taskName')
        kelas_id = request.form.get('class')
        isi_tugas = request.form.get('taskContent')
        deadline = request.form.get('deadline')

        # Buat dokumen untuk disimpan di MongoDB
        new_task = {
            'namaTugas': nama_tugas,
            'kelasId': kelas_id,
            'isiTugas': isi_tugas,
            'deadline': deadline  # Anda bisa menyesuaikan format tanggal sesuai kebutuhan
        }

        # Simpan dokumen ke koleksi 'tasks' di database MongoDB
        db.tasks.insert_one(new_task)

        # Redirect ke halaman utama setelah berhasil menyimpan tugas
        return redirect(url_for('dashboard_guru'))

    except Exception as e:
        # Jika terjadi kesalahan, Anda bisa menangani dengan cara yang sesuai, misalnya, menampilkan pesan kesalahan
        print(f"Error occurred: {e}")
        return redirect(url_for('index'))  # atau tampilkan halaman dengan pesan error


@app.route('/form_with_dynamic_options')
def form_with_dynamic_options():
    try:
        # Ambil data tingkat kelas yang unik dari koleksi siswa
        unique_kelas = db.siswa.distinct("kelas")
        return jsonify(unique_kelas)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
@app.route('/get_siswa_by_tingkat_kelas/<tingkat_kelas>', methods=['GET'])
def get_siswa_by_tingkat_kelas(tingkat_kelas):
    try:
        app.logger.info(f'Mengambil data siswa untuk tingkat kelas: {tingkat_kelas}')
        siswa_data = list(db.siswa.find({"kelas": tingkat_kelas}, {"name": 1, "kelas": 1, "_id": 1}))
        siswa_data_serialized = json_util.dumps(siswa_data)  # Mengonversi ObjectId menjadi string
        app.logger.info(f'Data siswa yang ditemukan: {siswa_data_serialized}')
        return siswa_data_serialized, 200, {'Content-Type': 'application/json'}
    except Exception as e:
        app.logger.error(f'Error fetching siswa data: {e}')
        return jsonify([]), 500
    

@app.route('/get_kelas_dan_siswa/<kelas_id>')
def get_kelas_dan_siswa(kelas_id):
    try:
        # Ambil data kelas dari koleksi 'new_class' berdasarkan ID kelas
        kelas = db.new_class.find_one({'_id': kelas_id})
        if not kelas:
            return jsonify({'error': 'Kelas tidak ditemukan'}), 404
        
        # Ambil data siswa dari koleksi 'credentialsSiswa' berdasarkan kelas
        siswa = db.credentialsSiswa.find({'kelas': kelas['kelas']})

        # Format hasil sesuai dengan format yang diberikan
        result = {
            'kelas': kelas,
            'siswa': list(siswa)
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': 'Gagal mengambil data kelas dan siswa.'}), 500

@app.route('/get_kelas_by_siswa/<siswa_id>', methods=['GET'])
def get_kelas_by_siswa(siswa_id):
    try:
        # Konversi siswa_id menjadi ObjectId
        siswa_id_obj = ObjectId(siswa_id)
        app.logger.info(f'Fetching classes for siswa_id: {siswa_id}')

        # Mengambil semua relasi kelas untuk siswa yang sedang login
        relasi_kelas = list(db.siswa_kelas.find({'siswa_id': siswa_id_obj}))
        kelas_ids = [rel['kelas_id'] for rel in relasi_kelas]
        
        # Mengambil detail kelas dari koleksi new_class
        kelas_list = list(db.new_class.find({'_id': {'$in': kelas_ids}}))
        
        # Konversi ObjectId ke string sebelum mengirimkan respons
        for kelas in kelas_list:
            kelas['_id'] = str(kelas['_id'])

        app.logger.info(f'Found {len(kelas_list)} kelas for siswa {siswa_id}')
        
        # Mengembalikan data kelas dalam format JSON
        return jsonify({'kelas': kelas_list}), 200
    except Exception as e:
        app.logger.error(f'Error fetching classes for siswa: {e}')
        return jsonify({'error': 'Gagal mengambil data kelas untuk siswa.'}), 500


@app.route('/add_class', methods=['POST'])
def add_class():
    try:
        # Ambil data dari form
        nama_kelas = request.form.get('namaKelas')
        nama_guru = request.form.get('namaGuru')
        jenis_kelas = request.form.get('jenisKelas')
        tingkat_kelas = request.form.get('tingkatKelas')

        # Buat ID unik untuk tingkat kelas
        id_tingkat_kelas = f"{jenis_kelas}-{tingkat_kelas}-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        # Buat dokumen untuk disimpan di MongoDB
        new_class = {
            'namaKelas': nama_kelas,
            'namaGuru': nama_guru,
            'tingkatKelas': tingkat_kelas,
            'jenisKelas': jenis_kelas,
            'idTingkatKelas': id_tingkat_kelas  # Tambahkan ID tingkat kelas
        }

        # Simpan dokumen ke koleksi 'new_class' di database 'putra'
        db.new_class.insert_one(new_class)

        # Redirect ke halaman dashboardguru
        return redirect(url_for('dashboard_guru'))

    except Exception as e:
        print(f"Error occurred: {e}")
        # Redirect ke halaman dashboardguru jika terjadi kesalahan
        return redirect(url_for('dashboard_guru'))

@app.route('/add_class_khusus', methods=['POST'])
def add_class_khusus():
    try:
        # Ambil data dari form
        nama_kelas = request.form.get('namaKelas')
        nama_guru = request.form.get('namaGuru')
        jenis_kelas = request.form.get('jenisKelas')
        tingkat_kelas = request.form.get('tingkatKelas')
        jenis_disabilitas = request.form.get('jenisDisabilitas')

        # Buat ID unik untuk tingkat kelas
        id_tingkat_kelas = f"{jenis_kelas}-{tingkat_kelas}-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        # Buat dokumen untuk disimpan di MongoDB
        new_class_khusus = {
            'namaKelas': nama_kelas,
            'namaGuru': nama_guru,
            'jenisKelas': jenis_kelas,
            'tingkatKelas': tingkat_kelas,
            'jenisDisabilitas': jenis_disabilitas,
            'idTingkatKelas': id_tingkat_kelas  # Tambahkan ID tingkat kelas
        }

        # Simpan dokumen ke koleksi 'new_class_khusus' di database 'putra'
        db.new_class_khusus.insert_one(new_class_khusus)

        # Redirect ke halaman dashboardguru
        return redirect(url_for('dashboard_guru'))

    except Exception as e:
        print(f"Error occurred: {e}")
        # Redirect ke halaman dashboardguru jika terjadi kesalahan
        return redirect(url_for('dashboard_guru'))


# ambil  guru berdasarkan nama
@app.route('/get_guru_data', methods=['GET'])
def get_guru_data():
    try:
        # Ambil data dari koleksi 'guru'
        guru_data = list(db.guru.find({}, {'_id': 0, 'nama': 1}))
        return jsonify(guru_data)
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': 'Terjadi kesalahan saat mengambil data guru'}), 500

@app.route('/get_siswa_data', methods=['GET'])
def get_siswa_data():
    try:
        # Ambil data dari koleksi 'siswa'
        siswa_data = list(db.siswa.find({}, {'_id': 0, 'jenis_disabilitas': 1, 'kelas': 1}))
        return jsonify(siswa_data)
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': 'Terjadi kesalahan saat mengambil data siswa'}), 500


@app.route('/get_kelas_khusus_data', methods=['GET'])
def get_kelas_khusus_data():
    try:
        # Ambil data dari koleksi 'new_class_khusus'
        kelas_khusus_data = list(db.new_class_khusus.find({}, {'_id': 0}))
        return jsonify(kelas_khusus_data)
    except Exception as e:
        print(f"Error occurred: {e}")
        return jsonify({'error': 'Terjadi kesalahan saat mengambil data kelas khusus'}), 500

@app.route('/delete_kelas/<id>', methods=['DELETE'])
def delete_kelas(id):
    try:
        # Cek apakah dokumen dengan ID yang diberikan ada di koleksi new_class
        kelas = db.new_class.find_one({'_id': ObjectId(id)})
        
        # Jika ditemukan, hapus dari koleksi new_class
        if kelas:
            result = db.new_class.delete_one({'_id': ObjectId(id)})
            if result.deleted_count == 1:
                return jsonify({'message': 'Kelas berhasil dihapus dari koleksi new_class'}), 200
            else:
                return jsonify({'error': 'Gagal menghapus kelas dari koleksi new_class'}), 500
        else:
            # Jika tidak ditemukan, hapus dari koleksi new_class_khusus
            result = db.new_class_khusus.delete_one({'_id': ObjectId(id)})
            if result.deleted_count == 1:
                return jsonify({'message': 'Kelas berhasil dihapus dari koleksi new_class_khusus'}), 200
            else:
                return jsonify({'error': 'Gagal menghapus kelas dari koleksi new_class_khusus'}), 500
    except Exception as e:
        return jsonify({'error': 'Terjadi kesalahan saat menghapus kelas'}), 500


@app.route('/show_credentials', methods=['GET'])
def show_credentials():
    # Ambil data dari parameter
    user_type = request.args.get('user_type')

    if user_type == 'guru':
        # Ambil data guru dari database
        email = request.args.get('email')
        guru_data = list(db.registguru.find({'email': email}))
        if guru_data:
            username = guru_data[0].get('username', '')
            password = guru_data[0].get('password', '')
            return jsonify({'status': 'success', 'username': username, 'password': password})
        else:
            return jsonify({'status': 'error', 'message': 'Guru tidak ditemukan.'})
    elif user_type == 'siswa':
        # Ambil data siswa dari database
        nisn = request.args.get('nisn')
        siswa_data = list(db.credentialsiswa.find({'nisn': nisn}))
        if siswa_data:
            username = siswa_data[0].get('username', '')
            password = siswa_data[0].get('password', '')
            return jsonify({'status': 'success', 'username': username, 'password': password})
        else:
            return jsonify({'status': 'error', 'message': 'Siswa tidak ditemukan.'})
    else:
        return jsonify({'status': 'error', 'message': 'Tipe pengguna tidak valid.'})


#tambah data siswa 
@app.route('/submit-form', methods=['POST'])
def submit_form():
    if request.method == 'POST':
        # Mengambil data dari permintaan POST
        data = request.form
        
        # Validasi data
        if not all(key in data for key in ['name', 'jenis_kelamin', 'ttl', 'agama', 'address_siswa', 'jenis_disabilitas', 'nama_ayah', 'pekerjaan_ayah', 'nama_ibu', 'pekerjaan_ibu',  'notlp',  'address_ortu', 'NISN', 'kelas', 'tahun_masuk']):
            return jsonify({'status': 'error', 'message': 'Semua kolom harus diisi.'}), 400

        # Validasi nomor telepon
        if not re.match(r'^\d{12}$', data['notlp']):
            return jsonify({'status': 'error', 'message': 'Nomor telepon harus terdiri dari 12 angka dan harus berupa angka.'}), 400

        try:
            # Simpan data ke database
            result = db.siswa.insert_one({
                'name': data['name'],
                'jenis_kelamin': data['jenis_kelamin'],
                'ttl': data['ttl'],
                'agama': data['agama'],
                'address_siswa': data['address_siswa'],
                'jenis_disabilitas': data['jenis_disabilitas'],
                'nama_ayah': data['nama_ayah'],
                'pekerjaan_ayah': data['pekerjaan_ayah'],
                'nama_ibu': data['nama_ibu'],
                'pekerjaan_ibu': data['pekerjaan_ibu'],
                'notlp': data['notlp'],
                'address_ortu': data['address_ortu'],
                'NISN': data['NISN'],
                'kelas': data['kelas'],
                'tahun_masuk': data['tahun_masuk']
        
            })

            if result.inserted_id:
                    # Redirect ke halaman dashboard_admin dengan pesan sukses
                    return redirect(url_for('dashboard_admin', message='Data berhasil disimpan.'))

            else:
                # Redirect ke halaman dashboard_admin dengan pesan gagal
                return redirect(url_for('dashboard_admin', message='Gagal menyimpan data.'))

        except Exception as e:
            # Redirect ke halaman dashboard_admin dengan pesan error
            return redirect(url_for('dashboard_admin', message=str(e)))

    # Redirect ke halaman dashboard_admin dengan pesan metode tidak diizinkan
    return redirect(url_for('dashboard_admin', message='Metode tidak diizinkan.'))


@app.route('/get-siswa', methods=['GET'])
def get_siswa():
    try:
        NISN = request.args.get('NISN')  # Mengambil NISN dari query parameter
        siswa = db.siswa.find_one({'NISN': NISN})
        if siswa:
            # Konversi _id menjadi string sebelum di-JSON-serializable
            siswa['_id'] = str(siswa['_id'])
            return jsonify(siswa), 200
        else:
            return jsonify({"message": "Data siswa tidak ditemukan."}), 404
    except Exception as e:
        app.logger.error(f'Error fetching siswa data: {e}')
        return jsonify({"message": "Gagal mengambil data siswa."}), 500


@app.route('/edit-siswa', methods=['POST'])
def edit_datasiswa():
    if 'username' not in session:
        return jsonify({"message": "Anda harus login untuk mengakses halaman ini."}), 401

    try:
        # Ambil data dari payload JSON
        data = request.json

        if not data:
            return jsonify({"message": "Tidak ada data dalam permintaan."}), 400

        NISN = data.get('NISN')

        # Pastikan NISN tersedia dalam data
        if not NISN:
            return jsonify({"message": "NISN tidak ditemukan dalam permintaan."}), 400

        # Ambil data siswa dari database
        siswa = db.siswa.find_one({'NISN': NISN})
        if not siswa:
            return jsonify({"message": "Gagal memperbarui data siswa. Data tidak ditemukan."}), 404

        # Update hanya atribut yang diberikan dalam permintaan
        update_data = {key: value for key, value in data.items() if key != 'NISN'}

        # Lakukan pembaruan hanya jika ada perubahan data
        if update_data:
            result = db.siswa.update_one({'NISN': NISN}, {'$set': update_data})
            if result.modified_count > 0:
                return jsonify({"message": "Data Siswa berhasil diperbarui."}), 200
            else:
                return jsonify({"message": "Tidak ada perubahan yang dilakukan."}), 200
        else:
            return jsonify({"message": "Tidak ada perubahan yang dilakukan."}), 200

    except Exception as e:
        app.logger.error(f'Error updating siswa data: {e}')
        return jsonify({"message": f"Terjadi kesalahan dalam memperbarui data siswa: {e}"}), 500

# hapus data siswa
@app.route('/hapus-siswa', methods=['DELETE'])
def hapus_siswa():
    if 'username' not in session:
        return jsonify({"message": "Anda harus login untuk mengakses halaman ini."}), 401

    try:
        data = request.get_json()
        NISN = data.get('NISN')

        if not NISN:
            return jsonify({"message": "NISN tidak ditemukan."}), 400

        result = db.siswa.delete_one({'NISN': NISN})

        if result.deleted_count > 0:
            return jsonify({"message": "Data siswa berhasil dihapus."}), 200
        else:
            return jsonify({"message": "Data siswa tidak ditemukan."}), 404
    except Exception as e:
        app.logger.error(f'Error deleting siswa data: {e}')
        return jsonify({"message": "Gagal menghapus data siswa."}), 500

# registrasi siswa 
@app.route('/daftar-siswa', methods=['POST'])
def daftar_siswa():
    try:
        data = request.get_json()
        NISN = data.get('NISN')
        name = data.get('name')

        if not NISN or not name:
            return jsonify({"message": "NISN atau nama siswa tidak ditemukan."}), 400

        # Buat password acak
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

        # Cek apakah siswa dengan NISN yang sama sudah ada
        existing_siswa = db.siswa.find_one({'NISN': NISN})

        if existing_siswa:
            # Jika sudah ada, lakukan pembaruan pada dokumen tersebut
            update_result = db.siswa.update_one(
                {'NISN': NISN},
                {'$set': {
                    'password': password
                }}
            )

            return jsonify({"message": "Data siswa berhasil diperbarui.", "NISN": NISN}), 200
        else:
            # Jika belum ada, tambahkan data siswa baru
            siswa_data = {
                'NISN': NISN,
                'name': name,
                'username': NISN,  # Gunakan NISN sebagai username
                'password': password  # Simpan password yang telah dibuat
            }
            db.siswa.insert_one(siswa_data)

            return jsonify({"message": "Siswa baru berhasil didaftarkan.", "NISN": NISN}), 200
    except Exception as e:
        app.logger.error(f'Error registering siswa: {e}')
        return jsonify({"message": "Gagal mendaftarkan siswa."}), 500

@app.route('/tambah-materi', methods=['GET', 'POST'])
def add_materi():
    if 'username' not in session:
        flash('Anda harus login untuk mengakses halaman ini.', 'error')
        return redirect(url_for('index'))

    if request.method == 'POST':
        judul = request.form.get('judul', '').strip()
        konten = request.form.get('isi_materi', '').strip()
        nama_guru = request.form.get('nama_guru', '').strip()
        tingkat_kelas = request.form.get('tingkat_kelas', '').strip()

        if not judul or not konten or not nama_guru or not tingkat_kelas:
            flash('Semua kolom harus diisi.', 'error')
            return redirect(url_for('dashboard_guru'))

        try:
            # Cari kelas berdasarkan tingkat_kelas
            kelas = db.new_class.find_one({'tingkatKelas': tingkat_kelas})
            if not kelas:
                flash('Kelas tidak ditemukan.', 'error')
                return redirect(url_for('dashboard_guru'))

            # Simpan materi ke dalam kelas yang sesuai
            result = db.materi.insert_one({
                'judul': judul,
                'konten': konten,
                'nama_guru': nama_guru,
                'tingkat_kelas': tingkat_kelas,
                'kelas_id': kelas['_id']  # Simpan ID kelas ke dalam materi
            })

            if result.inserted_id:
                flash('Materi berhasil disimpan.', 'success')
            else:
                flash('Gagal menyimpan materi.', 'error')
            return redirect(url_for('dashboard_guru'))
        except Exception as e:
            app.logger.error(f'Error saving materi data: {e}')
            flash('Gagal menyimpan materi.', 'error')
            return redirect(url_for('dashboard_guru'))

    return render_template('tambahmeteri.html')

@app.route('/ambil-materi', methods=['GET'])
def ambil_materi():
    try:
        materi = db.materi.find()  # Mengambil semua materi dari database
        materi_list = []  # List untuk menyimpan data materi

        for materi_item in materi:
            materi_data = {
                '_id': str(materi_item['_id']),
                'judul': materi_item['judul'],
                'konten': materi_item['konten'],
                'nama_guru': materi_item['nama_guru'],
                'tingkat_kelas': materi_item['tingkat_kelas']
            }
            materi_list.append(materi_data)

        return jsonify(materi_list)  # Mengembalikan data materi dalam format JSON
    except Exception as e:
        app.logger.error(f'Error: {e}')
        return jsonify({'error': 'Gagal mengambil data materi'}), 500

@app.route('/ambil-materi/<materi_id>', methods=['GET'])
def ambil_materi_by_id(materi_id):
    try:
        object_id = ObjectId(materi_id)
    except Exception as e:
        return jsonify({'error': 'ID materi tidak valid'}), 400

    try:
        materi = db.materi.find_one({'_id': object_id})
        if not materi:
            return jsonify({'error': 'Materi tidak ditemukan'}), 404

        # Konversi ObjectId menjadi string sebelum mengirim sebagai respons JSON
        materi['_id'] = str(materi['_id'])

        # Pastikan semua atribut materi dapat di-JSON-serialisasi
        for key in materi.keys():
            if isinstance(materi[key], ObjectId):
                materi[key] = str(materi[key])

        return jsonify(materi), 200
    except Exception as e:
        app.logger.error(f'Error: {e}')  # Log pesan kesalahan
        return jsonify({'error': 'Terjadi kesalahan saat mengambil data materi'}), 500

@app.route('/loginsiswa', methods=['GET', 'POST'])
def login_siswa():
    if request.method == 'POST':
        nisn = request.form['NISN']
        password = request.form['password']

        # Periksa kredensial di database
        user = db.siswa.find_one({'NISN': nisn, 'password': password})

        if user:
            session['nisn'] = nisn  # Simpan NISN pengguna di sesi
            flash('Login berhasil!', 'success')
            return redirect(url_for('dashboard_siswa'))
        else:
            flash('NISN atau password salah.', 'danger')
            return redirect(url_for('index'))

    return render_template('index.html')


@app.route('/dashboard_siswa')
def dashboard_siswa():
    try:
        # Ambil NISN siswa dari sesi
        nisn = session.get('nisn')
        if not nisn:
            return redirect(url_for('index'))

        # Dapatkan data siswa berdasarkan NISN
        siswa = db.siswa.find_one({'NISN': nisn})
        if not siswa:
            return render_template('dashboard_siswa.html', message='Siswa tidak ditemukan')

        # Dapatkan detail kelas dari dokumen siswa
        kelas_ids = siswa.get('kelasIds', [])
        if kelas_ids:
            kelas_details = []
            materi_list = []  # Tambahkan list untuk menampung data materi
            tugas_list = []  # Tambahkan list untuk menampung data tugas

            for kelas_id in kelas_ids:
                kelas = db.new_class.find_one({'_id': ObjectId(kelas_id)})
                if kelas:
                    # Konversi _id menjadi string
                    kelas['_id'] = str(kelas['_id'])
                    kelas_details.append(kelas)

                    # Dapatkan materi yang terkait dengan kelas ini
                    materi = db.materi.find({'kelas_id': ObjectId(kelas_id)})
                    for materi_item in materi:
                        materi_item['_id'] = str(materi_item['_id'])
                        materi_item['kelas_id'] = str(materi_item['kelas_id'])
                        materi_list.append(materi_item)

                    # Dapatkan tugas yang terkait dengan kelas ini
                    tugas = db.tasks.find({'kelasId': str(kelas_id)})
                    for tugas_item in tugas:
                        tugas_item['_id'] = str(tugas_item['_id'])
                        tugas_list.append(tugas_item)

            # Debug print untuk melihat data sebelum dikirim ke template
            print(f"Kelas details: {kelas_details}")
            print(f"Materi list: {materi_list}")
            print(f"Tugas list: {tugas_list}")

            if kelas_details:
                return render_template('dashboard_siswa.html', kelas=kelas_details, materi=materi_list, tugas=tugas_list)
            else:
                return render_template('dashboard_siswa.html', message='Kelas tidak ditemukan')
        else:
            return render_template('dashboard_siswa.html', message='Siswa belum memiliki kelas')
    except Exception as e:
        print(f"Error occurred: {e}")
        return render_template('dashboard_siswa.html', message='Gagal mengambil data kelas siswa')

@app.route('/register', methods=['POST'])
def register():
    email = request.form.get('email', '').strip()
    username = request.form.get('username', '').strip()
    password = request.form.get('password', '').strip()
    confirm_password = request.form.get('confirmPassword', '').strip()

    # Validasi input
    if not email or not username or not password or not confirm_password:
        flash('Semua kolom harus diisi.', 'error')
        return redirect(url_for('index'))

    if password != confirm_password:
        flash('Password dan konfirmasi password tidak cocok.', 'error')
        return redirect(url_for('index'))

    # Periksa apakah username sudah ada
    if users_collection.find_one({'username': username}):
        flash('Username sudah ada.', 'error')
        return redirect(url_for('index'))

    # Hashing password
    hashed_password = generate_password_hash(password)

    # Memasukkan data ke koleksi
    try:
        result = users_collection.insert_one({
            'email': email,
            'username': username,
            'password': hashed_password,
            'role': 'admin'  # Menetapkan peran sebagai admin
        })
        if result.inserted_id:
            flash('Registrasi berhasil. Silakan login.', 'success')
            return redirect(url_for('index'))
        else:
            flash('Gagal melakukan registrasi.', 'error')
            return redirect(url_for('index'))
    except Exception as e:
        app.logger.error(f'Error registering user: {e}')
        flash('Gagal melakukan registrasi.', 'error')
        return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def login():
    if 'username' in session and session.get('role') == 'admin':
        return redirect(url_for('dashboard_admin'))

    username = request.form.get('username', '').strip()
    password = request.form.get('password', '').strip()

    # Validasi input
    if not username or not password:
        flash('Semua kolom harus diisi.', 'error')
        return redirect(url_for('index'))

    # Memeriksa apakah ada admin dengan username yang sesuai
    user = users_collection.find_one({'username': username}, {'_id': 0, 'username': 1, 'password': 1})
    if user and check_password_hash(user['password'], password):
        session['username'] = user['username']
        session['role'] = 'admin'  # Menyimpan peran admin di sesi
        # Jika login berhasil, arahkan ke dashboard admin
        return redirect(url_for('dashboard_admin'))
    else:
        flash('Invalid username or password!', 'error')
        return redirect(url_for('index'))


@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('role', None)  # Menghapus peran dari sesi saat logout
    return redirect(url_for('index'))








if __name__ == '__main__':
    app.run(debug=True)
