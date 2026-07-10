# SISTEM MANAJEMEN PEMINJAMAN LAB INFORMATIKA
**Versi: 4.0 - Admin-Student Separation Version (Portable Bundle)**

Selamat datang di kode sumber sistem portal peminjaman lab UMSIDA. Folder ini dirancang khusus untuk kemudahan instalasi (Zero-Installation / Portable One-Folder Bundle) berbasis **JDK 21**, **Tomcat 10**, **MariaDB Portable**, dan **Jakarta EE (Servlet/JSP)**.

---

### 📂 Struktur Direktori Portable
```text
/LabSystem_Portable/
│
├── /jdk-21/                        <-- JDK 21 Portable Binaries
├── /apache-tomcat-10/              <-- Tomcat 10 Portable Server
├── /mariadb-portable/              <-- MariaDB Portable Engine
├── /webapps/
│   └── ROOT/
│       ├── /student/               <-- UI Mahasiswa (denah_lab.jsp)
│       ├── /admin/                 <-- UI Admin Control Center (panel_hardware.jsp)
│       ├── /js/                    <-- AJAX Request Handler
│       └── /WEB-INF/
│           ├── /classes/           <-- Compiled Java (.class)
│           │   └── com/lab/
│           │       ├── controller/ <-- Servlets (StudentServlet, AdminServlet, ReportServlet)
│           │       ├── dao/        <-- Data Access Objects (UserDAO, LabDAO, PeminjamanDAO, ReportDAO)
│           │       └── util/       <-- DBConnection (HikariCP), PDFGenerator (iText)
│           ├── /lib/               <-- JAR Dependencies
│           └── web.xml             <-- Deployment Descriptor
└── run.bat                         <-- Orchestrator Script (Double click untuk menjalankan semua servis)
```

---

### 💾 Skema Database (MariaDB Portable)
Jalankan script SQL berikut pada instance MariaDB Anda:

```sql
CREATE DATABASE IF NOT EXISTS db_lab_peminjaman;
USE db_lab_peminjaman;

-- Table t_mahasiswa
CREATE TABLE t_mahasiswa (
    nim VARCHAR(12) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telp VARCHAR(15) NOT NULL,
    kelas VARCHAR(10) NOT NULL,
    role ENUM('STUDENT', 'ASLAB') DEFAULT 'STUDENT'
);

-- Table t_aslab (Admin Credentials)
CREATE TABLE t_aslab (
    id_aslab VARCHAR(10) PRIMARY KEY,
    nim VARCHAR(12),
    password VARCHAR(100) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    FOREIGN KEY (nim) REFERENCES t_mahasiswa(nim) ON DELETE CASCADE
);

-- Table t_lab
CREATE TABLE t_lab (
    id_lab VARCHAR(10) PRIMARY KEY,
    nama_lab VARCHAR(100) NOT NULL,
    status_lab ENUM('OPEN', 'CLOSED') DEFAULT 'OPEN'
);

-- Table t_pc
CREATE TABLE t_pc (
    id_pc VARCHAR(20) PRIMARY KEY,
    id_lab VARCHAR(10),
    no_pc INT NOT NULL,
    status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') DEFAULT 'AVAILABLE',
    ip_address VARCHAR(15) NOT NULL,
    spek_cpu VARCHAR(50) NOT NULL,
    spek_ram VARCHAR(20) NOT NULL,
    spek_ssd VARCHAR(20) NOT NULL,
    FOREIGN KEY (id_lab) REFERENCES t_lab(id_lab) ON DELETE CASCADE
);

-- Table t_peminjaman
CREATE TABLE t_peminjaman (
    id_pinjam VARCHAR(20) PRIMARY KEY,
    nim VARCHAR(12),
    id_pc VARCHAR(20),
    tgl_pinjam DATE NOT NULL,
    jam_mulai TIME NOT NULL,
    jam_selesai TIME NOT NULL,
    keperluan TEXT NOT NULL,
    no_telp VARCHAR(15) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
    FOREIGN KEY (nim) REFERENCES t_mahasiswa(nim),
    FOREIGN KEY (id_pc) REFERENCES t_pc(id_pc)
);
```

---

### 💻 Petunjuk Eksekusi run.bat (Orchestrator)
Isi berkas `run.bat` di root folder:
```batch
@echo off
title UMSIDA Lab Management System - Orchestrator
echo [!] Memulai MariaDB Portable...
start "" "%~dp0mariadb-portable\bin\mysqld.exe" --defaults-file="%~dp0mariadb-portable\my.ini" --standalone

echo [!] Memeriksa koneksi database...
timeout /t 5

echo [!] Mendeploy aplikasi ke Tomcat...
xcopy /s /y "%~dp0webapps\ROOT" "%~dp0apache-tomcat-10\webapps\ROOT\"

echo [!] Menjalankan Tomcat 10 Server...
set "JAVA_HOME=%~dp0jdk-21"
set "CATALINA_HOME=%~dp0apache-tomcat-10"
call "%CATALINA_HOME%\bin\startup.bat"

echo [✓] Sukses! Buka http://localhost:8080/ untuk mengakses Portal.
pause
```

---

### 📄 Catatan Integrasi dan Library (.jar)
Pastikan library berikut berada di dalam folder `/WEB-INF/lib/` untuk kelancaran kompilasi:
1. `mariadb-java-client-3.1.2.jar`
2. `HikariCP-5.0.1.jar`
3. `slf4j-api-2.0.7.jar` & `slf4j-simple-2.0.7.jar`
4. `jakarta.servlet.jsp.jstl-3.0.1.jar` & `jakarta.servlet.jsp.jstl-api-3.0.0.jar`
5. `itextpdf-5.5.13.3.jar` (Engine Cetak PDF Surat & Laporan)
