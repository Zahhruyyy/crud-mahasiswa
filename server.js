const express = require("express");
const mysql = require("mysql2");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static("public"));

// koneksi ke data base
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_kampus",
});

db.connect((err) => {
  if (err) {
    console.error("Koneksi gagal:", err.message);
    return;
  }
  console.log("Terhubung ke database MySQL!");
});

// API Endpoint sederhana
app.get("/api/mahasiswa", (req, res) => {
  db.query("SELECT * FROM mahasiswa ORDER BY id DESC", (err, results) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    res.json({ success: true, data: results });
  });
});

// Validasi data mahasiswa wajib diisi
const validateMhs = (data) => {
  const { nim, nama, jurusan, email } = data;
  if (!nim || !nama || !jurusan || !email) {
    return "Semua field (NIM, Nama, Jurusan, Email) harus diisi.";
  }
  return null;
};

// 2. Tambah data mahasiswa
app.post("/api/mahasiswa", (req, res) => {
  const { nama, nim, jurusan, email } = req.body;
  const error = validateMhs({ nim, nama, jurusan, email });
  if (error) return res.status(400).json({ success: false, message: error });

  const sql =
    "INSERT INTO mahasiswa (nama, nim, jurusan, email) VALUES (?, ?, ?, ?)";
  db.query(sql, [nama, nim, jurusan, email], (err, result) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    res.json({
      success: true,
      message: "Data mahasiswa berhasil ditambahkan!",
    });
  });
});

// 3. Edit data mahasiswa
app.put("/api/mahasiswa/:id", (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "ID tidak boleh kosong." });

  const { nim, nama, jurusan, email } = req.body;
  const error = validateMhs({ nim, nama, jurusan, email });
  if (error) return res.status(400).json({ success: false, message: error });

  const sql =
    "UPDATE mahasiswa SET nim = ?, nama = ?, jurusan = ?, email = ? WHERE id = ?";

  db.query(sql, [nim, nama, jurusan, email, id], (err, result) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    res.json({
      success: true,
      message: "Data mahasiswa berhasil diperbarui!",
    });
  });
});

// 4. Hapus data mahasiswa
app.delete("/api/mahasiswa/:id", (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json({ success: false, message: "ID tidak boleh kosong." });

  db.query("DELETE FROM mahasiswa WHERE id = ?", [id], (err, result) => {
    if (err)
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    res.json({
      success: true,
      message: "Data mahasiswa berhasil dihapus!",
    });
  });
});

app.listen(port, () => {
  console.log("Server berjalan pada port:  ", port);
});
