# SISTEM PORTAL MANAJEMEN LAB INFORMATIKA
**Versi: 5.0 - Portable JSON-Based Bundle (Zero-Installation & Offline Ready)**

Selamat datang di kode sumber sistem portal peminjaman dan manajemen lab informatika. Sistem ini dirancang untuk kemudahan demonstrasi offline dan lokal tanpa memerlukan instalasi database server rumit seperti MariaDB atau MySQL. Aplikasi ini berjalan secara portable menggunakan **JDK 21**, **Apache Tomcat 10**, dan teknologi **Jakarta EE (Servlet/JSP)** yang dipadukan dengan frontend modern berbasis **React & Tailwind CSS**.

---

### 📂 Struktur Direktori LabSystem-JavaSystem
```text
/LabSystem-JavaSystem/
│
├── /webapps/
│   └── ROOT/
│       ├── /assets/                <-- Frontend terkompilasi (React JS & CSS Tailwind)
│       ├── /WEB-INF/
│       │   ├── /classes/           <-- Folder output kompilasi (.class)
│       │   │   └── com/lab/
│       │   │       ├── controller/ <-- ApiServlet.java (Endpoint API Request Handler)
│       │   │       └── util/       <-- DBConnection.java (Operasi I/O database.json)
│       │   ├── /lib/               <-- Library JAR dependencies (gson-2.10.1.jar)
│       │   └── web.xml             <-- Deployment Descriptor (Mapping API & JSP Fallback)
│       │
│       ├── index.jsp               <-- Halaman utama Tomcat (Welcome File yang me-load React)
│       ├── index.html              <-- Halaman utama lingkungan Node.js (Preview online)
│       ├── database.json           <-- Penyimpanan data utama (JSON-based lightweight DB)
│       ├── server.cjs              <-- Mock Express Server (Hanya digunakan untuk preview AI Studio)
│       └── favicon.svg             <-- Favicon aplikasi
│
└── run.bat                         <-- Batas Orchestrator (Cukup double-click untuk compile & run otomatis)
```

---

### 💾 Mekanisme Penyimpanan Data (database.json)
Aplikasi ini menggunakan **JSON File-Based Database** (`database.json`) yang diletakkan di dalam folder `/webapps/ROOT/`. 
- **DBConnection.java** membaca dan menulis langsung file `database.json` secara real-time.
- **Keuntungan**:
  1. **Zero-Setup**: Anda tidak perlu menginstall MySQL, PostgreSQL, atau MariaDB di komputer lokal.
  2. **Mudah Dipindahkan**: Cukup salin seluruh folder ini ke laptop lain, jalankan `run.bat`, dan semua data peminjaman, lab, PC, dan aslab Anda akan tetap utuh.
  3. **Kecepatan**: Sangat responsif untuk demonstrasi instan/offline.

---

### 💻 Petunjuk Menjalankan di Lokal / Offline (Windows)

Untuk menjalankan aplikasi ini secara lokal di komputer Anda, ikuti langkah mudah berikut:

1. **Siapkan JDK & Tomcat Portable** (Atau gunakan instalasi yang sudah ada di sistem Anda):
   - Letakkan folder JDK Anda (namai foldernya `jdk21` atau `jdk`) satu folder dengan `run.bat`.
   - Letakkan folder Apache Tomcat 10 Anda (namai foldernya `apache-tomcat` atau `tomcat`) satu folder dengan `run.bat`.
   - *Alternatif*: Jika JDK dan Tomcat sudah terinstall di sistem Windows Anda dan terdaftar di Environment Variables (`JAVA_HOME` & `CATALINA_HOME`), file `run.bat` akan mendeteksinya secara otomatis!

2. **Jalankan Aplikasi**:
   - Double-click file `run.bat` di root direktori.
   - Script akan otomatis mendownload library `gson-2.10.1.jar` jika belum ada di folder `lib`.
   - Script akan mengkompilasi file-file Java Servlet (`ApiServlet.java` & `DBConnection.java`) ke dalam folder `classes`.
   - Script akan melakukan deploy file ke folder Tomcat dan menjalankan server Tomcat.

3. **Akses Aplikasi**:
   - Buka browser dan ketik alamat: **`http://localhost:8080`**
   - Anda siap melakukan demonstrasi secara offline penuh!

---

### 📄 Informasi Akun Default untuk Demo:
- **Login Mahasiswa**: Gunakan salah satu NIM Mahasiswa yang ada di database (contoh: `251080200071`, `211080200045`, `261080200010`, dll).
- **Login Aslab (Admin Control Center)**: 
  - Masuk ke tab **Login Admin**.
  - Masukkan NIM: **`admin`**
  - Masukkan Password: **`admin`**
  - Anda akan diarahkan ke Dashboard Control Center dengan fitur lengkap seperti: Monitoring PC secara realtime, mematikan/menyalakan PC, menyetujui peminjaman, dan cetak Berita Acara (Official Report).

---

### 🛠️ Fitur-Fitur Utama Aplikasi:
1. **Interactive Lab Floor Plan**: Visualisasi layout komputer (PC) di setiap laboratorium dengan status warna (Hijau: Tersedia, Biru: Digunakan, Merah/Kuning: Maintenance/Offline).
2. **Real-time Booking System**: Mahasiswa dapat memilih PC kosong, mengisi form peminjaman, dan mengajukan secara instan.
3. **Admin & Aslab Control Center**: 
   - Menyetujui atau menolak pengajuan peminjaman mahasiswa secara langsung.
   - Fitur **Force Release** (membebaskan PC yang terpakai).
   - Fitur **Shutdown PC / Sesi Berakhir** (mematikan PC yang melanggar ketentuan, otomatis mengubah status PC jadi OFFLINE dan membatalkan peminjaman aktif).
   - Fitur **Mass Update** (mengubah status banyak PC sekaligus).
   - Fitur **Network/Ping Testing**: Simulasi ping semua PC di lab untuk memonitoring kecepatan download, upload, latency, dan status koneksi secara real-time.
4. **Cetak Berita Acara**: Cetak dokumen Berita Acara resmi (Official Report) secara rapi (cetak ramah printer/PDF) lengkap dengan tanda tangan Ketua Aslab dan Dosen Jaga.
