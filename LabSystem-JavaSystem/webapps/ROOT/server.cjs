var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
var DB_FILE = import_path.default.join(__dirname, "database.json");
app.use(import_express.default.json());
function generateSeedData() {
  const firstNames = [
    "Ahmad",
    "Budi",
    "Citra",
    "Dwi",
    "Eko",
    "Fajar",
    "Gita",
    "Hari",
    "Indah",
    "Joko",
    "Kartika",
    "Lukman",
    "Mega",
    "Nur",
    "Ony",
    "Putu",
    "Rian",
    "Siti",
    "Teguh",
    "Utami",
    "Vera",
    "Wawan",
    "Yeni",
    "Zainal",
    "Aditya",
    "Bayu",
    "Candra",
    "Diana",
    "Elga",
    "Farhan",
    "Guntur",
    "Hesti",
    "Irma",
    "Junaedi",
    "Kurnia",
    "Lestari",
    "Maulana",
    "Nanda",
    "Oki",
    "Pratama",
    "Riza",
    "Saputra",
    "Tri",
    "Wahyu",
    "Yulia",
    "Zulfikar",
    "Hanif",
    "Kevin",
    "Aldo",
    "Bella",
    "Daniel",
    "Elsa",
    "Felix",
    "Grace",
    "Hendra",
    "Ivan",
    "Jessica",
    "Kenji",
    "Lisa",
    "Mario",
    "Nadia",
    "Oscar",
    "Putri",
    "Randy",
    "Siska",
    "Tedy",
    "Ulfa",
    "Vina",
    "Wendy",
    "Yanto"
  ];
  const lastNames = [
    "Fauzi",
    "Santoso",
    "Lestari",
    "Wijaya",
    "Saputra",
    "Kusuma",
    "Siregar",
    "Nasution",
    "Ginting",
    "Harahap",
    "Lubis",
    "Tanjung",
    "Hutapea",
    "Pangaribuan",
    "Simanjuntak",
    "Panjaitan",
    "Siahaan",
    "Situmorang",
    "Sitorus",
    "Nababan",
    "Nainggolan",
    "Marpaung",
    "Sinaga",
    "Manurung",
    "Ambarita",
    "Silalahi",
    "Purba",
    "Sipayung",
    "Saragih",
    "Damanik",
    "Sumbayak",
    "Girsang",
    "Haloho",
    "Manik",
    "Tambunan",
    "Sibarani",
    "Silaen",
    "Pakpahan",
    "Sidabutar",
    "Sitompul",
    "Simatupang",
    "Hidayat",
    "Pratama",
    "Nugroho",
    "Setiawan",
    "Wibowo",
    "Ramadhan",
    "Saputro",
    "Gunawan",
    "Budiman",
    "Kurniawan",
    "Susanto",
    "Cahyono",
    "Prasetyo",
    "Utomo",
    "Raharjo",
    "Subagyo",
    "Hartono",
    "Hadi",
    "Wulandari",
    "Fitriani",
    "Hasanah",
    "Astuti",
    "Rahmawati",
    "Sari",
    "Safitri",
    "Hidayah"
  ];
  const classes = ["IF-A1", "IF-B1", "IF-C1", "IF-A2", "IF-B2", "IF-C2"];
  const students = [];
  const aslabs = [];
  const cohorts = ["20", "21", "22", "23", "24", "25", "26"];
  cohorts.forEach((cohort) => {
    const numAslabs = 6 + Math.floor(Math.random() * 3);
    const aslabIndices = /* @__PURE__ */ new Set();
    while (aslabIndices.size < numAslabs) {
      const randIdx = 1 + Math.floor(Math.random() * 80);
      aslabIndices.add(randIdx);
    }
    let aslabCounter = 1;
    for (let idx = 1; idx <= 80; idx++) {
      const nim = `${cohort}1080200${String(idx).padStart(3, "0")}`;
      const fName = firstNames[(idx + parseInt(cohort) * 7) % firstNames.length];
      const lName = lastNames[(idx * 3 + parseInt(cohort) * 11) % lastNames.length];
      const nama = `${fName} ${lName}`;
      const email = `${fName.toLowerCase()}.${lName.toLowerCase()}${idx}@univ.ac.id`.replace(/[^a-zA-Z0-9.@]/g, "");
      const phonePrefixes = ["0812", "0822", "0857", "0899", "0813", "0856"];
      const prefix = phonePrefixes[(idx + parseInt(cohort)) % phonePrefixes.length];
      const suffix = String(Math.floor(1e7 + Math.random() * 9e7)).slice(0, 8);
      const telp = prefix + suffix;
      const kelas = classes[(idx + parseInt(cohort)) % classes.length];
      const isAslab = aslabIndices.has(idx);
      students.push({
        nim,
        nama,
        email,
        telp,
        kelas,
        role: isAslab ? "ASLAB" : "STUDENT"
      });
      if (isAslab) {
        const id_aslab = `ASLAB-${cohort}-${String(aslabCounter++).padStart(2, "0")}`;
        aslabs.push({
          id_aslab,
          nim,
          password: "aslab",
          // Standardized password for prototype
          nama
        });
      }
    }
  });
  const t_lab = [
    { id_lab: "LAB-01", nama_lab: "Laboratorium Rekayasa Perangkat Lunak (RPL)", status_lab: "OPEN" },
    { id_lab: "LAB-02", nama_lab: "Laboratorium Jaringan & Keamanan Komputer", status_lab: "OPEN" },
    { id_lab: "LAB-03", nama_lab: "Laboratorium Multimedia & Kecerdasan Buatan (AI)", status_lab: "OPEN" },
    { id_lab: "LAB-04", nama_lab: "Laboratorium Pemrograman & Komputasi Awan (Cloud)", status_lab: "OPEN" },
    { id_lab: "LAB-05", nama_lab: "Laboratorium Sistem Tertanam (Embedded Systems) & IoT", status_lab: "OPEN" },
    { id_lab: "LAB-06", nama_lab: "Laboratorium Sistem Informasi & Basis Data", status_lab: "OPEN" },
    { id_lab: "LAB-07", nama_lab: "Laboratorium Keamanan Siber & Kriptografi", status_lab: "OPEN" },
    { id_lab: "LAB-08", nama_lab: "Laboratorium Komputer Dasar & Grafika Komputer", status_lab: "OPEN" }
  ];
  const t_pc = [];
  const specs = [
    { cpu: "Intel Core i7-12700", ram: "16 GB DDR4", ssd: "512 GB NVMe" },
    { cpu: "Intel Core i5-13400F", ram: "16 GB DDR4", ssd: "512 GB NVMe" },
    { cpu: "AMD Ryzen 7 5700X", ram: "32 GB DDR4", ssd: "1 TB NVMe" }
  ];
  for (let l = 1; l <= 8; l++) {
    const id_lab = `LAB-0${l}`;
    for (let p = 1; p <= 20; p++) {
      const spec = specs[(p + l) % specs.length];
      const ip = `192.168.${l}0.${10 + p}`;
      let initialStatus = "AVAILABLE";
      const randVal = Math.random();
      if (randVal < 0.05) {
        initialStatus = "MAINTENANCE";
      } else if (randVal < 0.12) {
        initialStatus = "OCCUPIED";
      }
      t_pc.push({
        id_pc: `${id_lab}-PC-${String(p).padStart(2, "0")}`,
        id_lab,
        no_pc: p,
        status: initialStatus,
        ip_address: ip,
        spek: spec
      });
    }
  }
  const t_peminjaman = [];
  const t_audit_log = [
    { id: "LOG-INIT", timestamp: (/* @__PURE__ */ new Date()).toISOString(), user: "Admin Utama", action: "SYSTEM_START", details: "Inisialisasi sistem dengan 8 Laboratorium & 560 data Mahasiswa terdaftar (Angkatan 2020-2026)" }
  ];
  for (let b = 1; b <= 5; b++) {
    const nonAslabs = students.filter((s) => s.role === "STUDENT");
    const student = nonAslabs[Math.floor(Math.random() * nonAslabs.length)];
    const pc = t_pc[Math.floor(Math.random() * t_pc.length)];
    let status = "COMPLETED";
    if (b === 1) {
      status = "PENDING";
    } else if (b === 2) {
      status = "APPROVED";
      pc.status = "OCCUPIED";
    }
    t_peminjaman.push({
      id_pinjam: `PMJ-${100 + b}`,
      nim: student.nim,
      nama: student.nama,
      id_pc: pc.id_pc,
      id_lab: pc.id_lab,
      no_pc: pc.no_pc,
      tgl_pinjam: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      jam_mulai: "08:00",
      jam_selesai: "11:00",
      keperluan: ["Pengerjaan Tugas Akhir", "Praktikum Mandiri", "Riset AI", "Belajar Pemrograman"][b % 4],
      no_telp: student.telp,
      status
    });
    t_audit_log.push({
      id: `LOG-PMJ-${b}`,
      timestamp: new Date(Date.now() - b * 36e5).toISOString(),
      user: student.nama,
      action: "SUBMIT_PEMINJAMAN",
      details: `Mengajukan peminjaman PC-${pc.no_pc} di ${pc.id_lab}. Status: ${status}`
    });
  }
  return {
    t_mahasiswa: students,
    t_aslab: aslabs,
    t_lab,
    t_pc,
    t_peminjaman,
    t_audit_log
  };
}
var db;
if (import_fs.default.existsSync(DB_FILE)) {
  try {
    const raw = import_fs.default.readFileSync(DB_FILE, "utf-8");
    db = JSON.parse(raw);
    if (!db.t_lab || db.t_lab.length < 8 || !db.t_mahasiswa || db.t_mahasiswa.length < 500) {
      console.log("Mendeteksi database versi lama/kurang lengkap. Melakukan migrasi database baru...");
      db = generateSeedData();
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    }
  } catch (e) {
    console.error("Error membaca database.json, menggunakan generator data", e);
    db = generateSeedData();
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  }
} else {
  db = generateSeedData();
  import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}
function saveDb() {
  try {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
  } catch (e) {
    console.error("Gagal menyimpan database.json", e);
  }
}
function logAudit(user, action, details) {
  const log = {
    id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    user,
    action,
    details
  };
  db.t_audit_log.unshift(log);
  saveDb();
}
app.post("/api/auth/login", (req, res) => {
  const { nim, password, isAdmin } = req.body;
  if (isAdmin) {
    const aslab = db.t_aslab.find(
      (a) => (a.nim === nim || a.id_aslab === nim) && a.password === password
    );
    if (aslab) {
      logAudit(aslab.nama, "LOGIN", "Login berhasil sebagai Administrator/Asisten Laboratorium");
      return res.json({
        success: true,
        user: {
          nim: aslab.nim,
          nama: aslab.nama,
          role: "ASLAB",
          id_aslab: aslab.id_aslab
        }
      });
    }
    return res.status(401).json({ success: false, message: "Kredensial Admin/Aslab tidak valid." });
  } else {
    const nimRegex = /^([2][0-6])1080200([0-9]{3})$/;
    if (!nimRegex.test(nim)) {
      return res.status(400).json({
        success: false,
        message: "Format NIM tidak valid! Gunakan format NIM 12-digit (Contoh: 211080200123)"
      });
    }
    let student = db.t_mahasiswa.find((m) => m.nim === nim);
    if (!student) {
      student = {
        nim,
        nama: "Mahasiswa (" + nim.slice(-3) + ")",
        email: `mhs_${nim.slice(-4)}@univ.ac.id`,
        telp: "08123456789",
        kelas: "IF-B1",
        role: "STUDENT"
      };
      db.t_mahasiswa.push(student);
      saveDb();
      logAudit(student.nama, "REGISTER_AUTO", `Registrasi otomatis mahasiswa baru NIM ${nim}`);
    }
    logAudit(student.nama, "LOGIN", "Login berhasil sebagai Mahasiswa");
    return res.json({
      success: true,
      user: {
        ...student,
        role: "STUDENT"
        // Force role to STUDENT so they can book PCs, and prevent passwordless admin login
      }
    });
  }
});
app.get("/api/labs", (req, res) => {
  res.json(db.t_lab);
});
app.put("/api/labs/:id/switch", (req, res) => {
  const { id } = req.params;
  const { status_lab, adminName } = req.body;
  const lab = db.t_lab.find((l) => l.id_lab === id);
  if (!lab) {
    return res.status(404).json({ success: false, message: "Lab tidak ditemukan." });
  }
  lab.status_lab = status_lab;
  if (status_lab === "CLOSED") {
  }
  saveDb();
  logAudit(
    adminName || "Administrator",
    "MASTER_SWITCH",
    `Mengubah status akses ${lab.nama_lab} menjadi [${status_lab}]`
  );
  res.json({ success: true, lab });
});
app.get("/api/pcs", (req, res) => {
  const { id_lab } = queryParams(req.url);
  let pcs = db.t_pc;
  if (id_lab) {
    pcs = pcs.filter((pc) => pc.id_lab === id_lab);
  }
  res.json(pcs);
});
app.put("/api/pcs/:id", (req, res) => {
  const { id } = req.params;
  const { status, cpu, ram, ssd, adminName } = req.body;
  const pc = db.t_pc.find((p) => p.id_pc === id);
  if (!pc) {
    return res.status(404).json({ success: false, message: "PC tidak ditemukan." });
  }
  let oldStatus = pc.status;
  if (status) pc.status = status;
  if (cpu) pc.spek.cpu = cpu;
  if (ram) pc.spek.ram = ram;
  if (ssd) pc.spek.ssd = ssd;
  saveDb();
  logAudit(
    adminName || "Administrator",
    "UPDATE_PC",
    `Update PC ${pc.no_pc} di ${pc.id_lab}. Status: ${oldStatus} -> ${pc.status}. Spek: ${pc.spek.cpu}, ${pc.spek.ram}, ${pc.spek.ssd}`
  );
  res.json({ success: true, pc });
});
app.post("/api/pcs/mass-update", (req, res) => {
  const { ids, status, adminName } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ success: false, message: "Pilih PC yang akan di-update." });
  }
  let count = 0;
  db.t_pc.forEach((pc) => {
    if (ids.includes(pc.id_pc)) {
      pc.status = status;
      count++;
    }
  });
  saveDb();
  logAudit(
    adminName || "Administrator",
    "MASS_UPDATE_PC",
    `Update masal ${count} PC menjadi [${status}]`
  );
  res.json({ success: true, count });
});
app.get("/api/peminjaman", (req, res) => {
  res.json(db.t_peminjaman);
});
app.post("/api/peminjaman", (req, res) => {
  const { nim, id_pc, tgl_pinjam, jam_mulai, jam_selesai, keperluan, no_telp, nama, id_lab, no_pc } = req.body;
  const student = db.t_mahasiswa.find((m) => m.nim === nim);
  if (!student) {
    return res.status(404).json({ success: false, message: "Data mahasiswa belum terdaftar." });
  }
  const lab = db.t_lab.find((l) => l.id_lab === id_lab);
  if (lab?.status_lab === "CLOSED") {
    return res.status(403).json({ success: false, message: "Akses Laboratorium ini sedang ditutup oleh Admin!" });
  }
  const pc = db.t_pc.find((p) => p.id_pc === id_pc);
  if (!pc) {
    return res.status(404).json({ success: false, message: "PC tidak ditemukan." });
  }
  if (pc.status !== "AVAILABLE") {
    return res.status(400).json({ success: false, message: "PC ini sedang tidak tersedia untuk dipinjam." });
  }
  const existingActive = db.t_peminjaman.find(
    (p) => p.nim === nim && (p.status === "PENDING" || p.status === "APPROVED")
  );
  if (existingActive) {
    return res.status(400).json({
      success: false,
      message: "Anda masih memiliki transaksi aktif (Pending / Disetujui). Mohon selesaikan dahulu."
    });
  }
  const newPeminjaman = {
    id_pinjam: `PMJ-${Date.now().toString().slice(-6)}`,
    nim,
    nama: nama || student.nama,
    id_pc,
    id_lab,
    no_pc,
    tgl_pinjam,
    jam_mulai,
    jam_selesai,
    keperluan,
    no_telp,
    status: "PENDING"
  };
  db.t_peminjaman.unshift(newPeminjaman);
  saveDb();
  logAudit(student.nama, "SUBMIT_PEMINJAMAN", `Mengajukan peminjaman PC-${no_pc} di ${id_lab}`);
  res.json({ success: true, peminjaman: newPeminjaman });
});
app.put("/api/peminjaman/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, adminName } = req.body;
  const pmj = db.t_peminjaman.find((p) => p.id_pinjam === id);
  if (!pmj) {
    return res.status(404).json({ success: false, message: "Peminjaman tidak ditemukan." });
  }
  const oldStatus = pmj.status;
  pmj.status = status;
  const pc = db.t_pc.find((p) => p.id_pc === pmj.id_pc);
  if (pc) {
    if (status === "APPROVED") {
      pc.status = "OCCUPIED";
    } else if (status === "COMPLETED" || status === "REJECTED") {
      pc.status = "AVAILABLE";
    }
  }
  saveDb();
  logAudit(
    adminName || "Administrator",
    status === "APPROVED" ? "APPROVE_PEMINJAMAN" : status === "REJECTED" ? "REJECT_PEMINJAMAN" : "COMPLETE_PEMINJAMAN",
    `Status peminjaman ${pmj.id_pinjam} (${pmj.nama}) diubah: ${oldStatus} -> ${status}`
  );
  res.json({ success: true, peminjaman: pmj });
});
app.post("/api/pcs/:id/shutdown", (req, res) => {
  const { id } = req.params;
  const { alasan, adminName } = req.body;
  const pc = db.t_pc.find((p) => p.id_pc === id);
  if (!pc) {
    return res.status(404).json({ success: false, message: "PC tidak ditemukan." });
  }
  const activeReservation = db.t_peminjaman.find((p) => p.id_pc === id && (p.status === "APPROVED" || p.status === "PENDING"));
  if (activeReservation) {
    activeReservation.status = "REJECTED";
    activeReservation.keperluan = activeReservation.keperluan + ` [DIMATIKAN SEPIHAK: ${alasan || "Melanggar aturan"}]`;
  }
  pc.status = "OFFLINE";
  saveDb();
  logAudit(
    adminName || "Administrator",
    "FORCE_SHUTDOWN",
    `Mematikan PC ${pc.no_pc} di ${pc.id_lab} secara paksa dengan alasan: ${alasan || "Melanggar aturan"}`
  );
  res.json({ success: true, message: "PC berhasil dimatikan secara paksa.", pc });
});
app.post("/api/pcs/:id/force-release", (req, res) => {
  const { id } = req.params;
  const { adminName } = req.body;
  const pc = db.t_pc.find((p) => p.id_pc === id);
  if (!pc) {
    return res.status(404).json({ success: false, message: "PC tidak ditemukan." });
  }
  const activeReservation = db.t_peminjaman.find((p) => p.id_pc === id && p.status === "APPROVED");
  if (activeReservation) {
    activeReservation.status = "COMPLETED";
  }
  pc.status = "AVAILABLE";
  saveDb();
  logAudit(
    adminName || "Administrator",
    "FORCE_RELEASE",
    `Memaksa pembebasan PC ${pc.no_pc} di ${pc.id_lab} ke status AVAILABLE`
  );
  res.json({ success: true, message: "PC berhasil dibebaskan.", pc });
});
app.get("/api/history", (req, res) => {
  res.json(db.t_audit_log);
});
app.post("/api/ping/all", (req, res) => {
  const { id_lab } = req.body;
  let pcs = db.t_pc;
  if (id_lab) {
    pcs = pcs.filter((pc) => pc.id_lab === id_lab);
  }
  const pingResults = pcs.map((pc) => {
    let latency = 0;
    let status_ping = "ONLINE";
    let downloadSpeed = 0;
    let uploadSpeed = 0;
    if (pc.status === "MAINTENANCE" || pc.status === "OFFLINE") {
      status_ping = "OFFLINE";
      latency = 0;
      downloadSpeed = 0;
      uploadSpeed = 0;
    } else {
      const rand = Math.random();
      if (rand < 0.05) {
        status_ping = "OFFLINE";
        latency = 0;
        downloadSpeed = 0;
        uploadSpeed = 0;
      } else if (rand < 0.15) {
        status_ping = "SLOW";
        latency = Math.floor(Math.random() * 200) + 120;
        if (Math.random() < 0.5) {
          // SLOW (Red) - download speed < 1.0 Mbps
          downloadSpeed = parseFloat((Math.random() * 0.7 + 0.2).toFixed(1));
        } else {
          // MODERATE (Yellow) - download speed 1.5 - 6.0 Mbps
          downloadSpeed = parseFloat((Math.random() * 4.5 + 1.5).toFixed(1));
        }
        uploadSpeed = parseFloat((Math.random() * 2 + 0.5).toFixed(1));
      } else {
        status_ping = "ONLINE";
        latency = Math.floor(Math.random() * 15) + 3;
        downloadSpeed = parseFloat((Math.random() * 100 + 50).toFixed(1));
        uploadSpeed = parseFloat((Math.random() * 50 + 20).toFixed(1));
      }
    }
    return {
      id_pc: pc.id_pc,
      no_pc: pc.no_pc,
      ip_address: pc.ip_address,
      status_ping,
      latency,
      downloadSpeed,
      uploadSpeed
    };
  });
  res.json({ success: true, pingResults });
});
app.get("/api/reports/summary", (req, res) => {
  const { month, year } = queryParams(req.url);
  let filteredReservations = db.t_peminjaman;
  if (month && year) {
    filteredReservations = db.t_peminjaman.filter((p) => {
      const date = new Date(p.tgl_pinjam);
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const y = String(date.getFullYear());
      return m === month && y === year;
    });
  }
  const totalPinjam = filteredReservations.length;
  const labCounts = {};
  filteredReservations.forEach((p) => {
    const labName = db.t_lab.find((l) => l.id_lab === p.id_lab)?.nama_lab || p.id_lab;
    labCounts[labName] = (labCounts[labName] || 0) + 1;
  });
  let labTerpopuler = "-";
  let maxLabCount = 0;
  Object.entries(labCounts).forEach(([name, count]) => {
    if (count > maxLabCount) {
      maxLabCount = count;
      labTerpopuler = name;
    }
  });
  const pcCounts = {};
  filteredReservations.forEach((p) => {
    const pcKey = `${db.t_lab.find((l) => l.id_lab === p.id_lab)?.nama_lab.split(" ")[1] || p.id_lab} - PC ${String(p.no_pc).padStart(2, "0")}`;
    pcCounts[pcKey] = (pcCounts[pcKey] || 0) + 1;
  });
  let pcTerpopuler = "-";
  let maxPcCount = 0;
  Object.entries(pcCounts).forEach(([pc, count]) => {
    if (count > maxPcCount) {
      maxPcCount = count;
      pcTerpopuler = pc;
    }
  });
  res.json({
    totalPinjam,
    labTerpopuler,
    pcTerpopuler,
    peminjaman: filteredReservations
  });
});
function queryParams(url) {
  const result = {};
  const queryIdx = url.indexOf("?");
  if (queryIdx === -1) return result;
  const pairs = url.slice(queryIdx + 1).split("&");
  pairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key) result[decodeURIComponent(key)] = decodeURIComponent(value || "");
  });
  return result;
}
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Mounted Vite dev server middleware.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "LabSystem-JavaSystem", "webapps", "ROOT");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
