// File: public/script.js - Logika Client-Side JavaScript CRUD
document.addEventListener("DOMContentLoaded", () => {
  // 1. Tangkap Elemen DOM
  const mhsForm = document.getElementById("mhsForm");
  const mhsIdInput = document.getElementById("mhsId");
  const nimInput = document.getElementById("nim");
  const namaInput = document.getElementById("nama");
  const jurusanInput = document.getElementById("jurusan");
  const emailInput = document.getElementById("email");
  const btnSubmit = document.getElementById("btnSubmit");
  const btnCancel = document.getElementById("btnCancel");
  const formTitle = document.getElementById("formTitle");
  const alertMessage = document.getElementById("alertMessage");
  const mhsTableBody = document.getElementById("mhsTableBody");

  let listMahasiswa = []; // Menyimpan state data mahasiswa lokal untuk proses edit

  // Helper: Escape HTML untuk mencegah XSS
  const escapeHtml = (text) => {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  };

  // Fungsi Menampilkan Notifikasi Alert
  const showAlert = (message, type = "success") => {
    alertMessage.textContent = message;
    alertMessage.className = `alert alert-${type}`;
    alertMessage.style.display = "block";
    setTimeout(() => {
      alertMessage.style.display = "none";
    }, 4000);
  };

  // 2. READ: Ambil dan Tampilkan Data Mahasiswa
  const loadMahasiswa = async () => {
    try {
      const res = await fetch("/api/mahasiswa");
      const result = await res.json();

      if (result.success) {
        listMahasiswa = result.data;
        mhsTableBody.innerHTML = "";

        if (listMahasiswa.length === 0) {
          mhsTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b;">Belum ada data mahasiswa.</td></tr>`;
          return;
        }

        listMahasiswa.forEach((mhs, index) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHtml(mhs.nim)}</td>
            <td>${escapeHtml(mhs.nama)}</td>
            <td>${escapeHtml(mhs.jurusan)}</td>
            <td>${escapeHtml(mhs.email)}</td>
            <td>
              <button class="btn-action btn-edit" data-id="${mhs.id}">Edit</button>
              <button class="btn-action btn-delete" data-id="${mhs.id}">Hapus</button>
            </td>
          `;
          mhsTableBody.appendChild(tr);
        });
      }
    } catch (err) {
      console.error(err);
      showAlert("Gagal memuat data dari server", "error");
    }
  };

  // 3. CREATE & UPDATE: Submit Formulir mhsForm
  mhsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      nim: nimInput.value.trim(),
      nama: namaInput.value.trim(),
      jurusan: jurusanInput.value,
      email: emailInput.value.trim(),
    };

    const id = mhsIdInput.value;
    const isEdit = Boolean(id);
    const url = isEdit ? `/api/mahasiswa/${id}` : "/api/mahasiswa";
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (result.success) {
        showAlert(result.message);
        resetForm();
        loadMahasiswa();
      } else {
        showAlert("Terjadi kesalahan: " + result.message, "error");
      }
    } catch (err) {
      console.error(err);
      showAlert("Gagal mengirim data ke server", "error");
    }
  });

  // 4. DELETE & EDIT: Tangani Event Klik pada Tabel (Event Delegation)
  mhsTableBody.addEventListener("click", async (e) => {
    const id = Number(e.target.dataset.id);
    if (!id) return;

    // Mode Edit: Isi form otomatis
    if (e.target.classList.contains("btn-edit")) {
      const targetMhs = listMahasiswa.find((m) => m.id === id);
      if (targetMhs) {
        nimInput.value = targetMhs.nim;
        mhsIdInput.value = targetMhs.id;
        namaInput.value = targetMhs.nama;
        jurusanInput.value = targetMhs.jurusan;
        emailInput.value = targetMhs.email;
        formTitle.textContent = "Edit Data Mahasiswa";
        btnSubmit.textContent = "Perbarui Mahasiswa";
        btnCancel.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    // Mode Delete: Hapus data via HTTP DELETE
    else if (e.target.classList.contains("btn-delete")) {
      if (confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) {
        try {
          const res = await fetch(`/api/mahasiswa/${id}`, {
            method: "DELETE",
          });
          const result = await res.json();
          if (result.success) {
            showAlert(result.message);
            loadMahasiswa();
          } else {
            showAlert("Gagal menghapus: " + result.message, "error");
          }
        } catch (err) {
          console.error(err);
          showAlert("Gagal menghapus data dari server", "error");
        }
      }
    }
  });

  // 5. Reset Form ke Mode Tambah
  const resetForm = () => {
    mhsForm.reset();
    mhsIdInput.value = "";
    formTitle.textContent = "Tambah Mahasiswa Baru";
    btnSubmit.textContent = "Simpan Mahasiswa";
    btnCancel.style.display = "none";
  };

  btnCancel.addEventListener("click", resetForm);

  // Ambil data pertama kali saat halaman dimuat
  loadMahasiswa();
});
