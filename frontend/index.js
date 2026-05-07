const getApiBase = () =>
  `https://tcc-tugas3-backend-361164671321.us-central1.run.app/api/notes`;

// Variabel global untuk menyimpan data catatan agar fitur search lancar
let allNotes = [];

const overlay = document.querySelector("#modal-overlay");
const formNote = document.querySelector("#note-form");
const textareaIsi = document.querySelector("#isi");
const searchInput = document.querySelector("#search-input");

document.addEventListener("DOMContentLoaded", () => {
  getNotes();
});

// --- MANAJEMEN MODAL --
function openModal(modalId) {
  overlay.classList.remove("hidden");
  document
    .querySelectorAll(".modal-panel")
    .forEach((p) => p.classList.add("hidden"));
  document.querySelector(`#${modalId}`).classList.remove("hidden");
}

function closeModal() {
  overlay.classList.add("hidden");
  resetForm();
}

const resetForm = () => {
  formNote.reset();
  document.querySelector("#note-id").value = "";
  document.querySelector("#form-title").innerText = "Catatan Baru";
  textareaIsi.style.height = "auto";
};

// Auto-resize textarea
textareaIsi.addEventListener("input", function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
});

// Tombol Tambah
document
  .querySelector("#btn-add-note")
  .addEventListener("click", () => openModal("modal-form"));

// --- FITUR SEARCH (PERBAIKAN) ---
searchInput.addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();

  // Memfilter dari variabel allNotes (tanpa panggil API lagi)
  const filteredNotes = allNotes.filter(
    (note) =>
      note.judul.toLowerCase().includes(searchTerm) ||
      note.isi.toLowerCase().includes(searchTerm),
  );

  renderNotesGrid(filteredNotes);
});

// --- AMBIL DATA DARI SERVER ---
async function getNotes() {
  try {
    const url = getApiBase();
    console.log("Mengambil data dari:", url);

    const response = await axios.get(url);
    // Simpan data ke variabel global agar bisa di-search nanti
    allNotes = response.data || [];
    renderNotesGrid(allNotes);
  } catch (error) {
    console.error("Gagal ambil data:", error);
  }
}

// --- RENDER GRID ---
function renderNotesGrid(notes) {
  const grid = document.querySelector("#notes-grid");
  grid.innerHTML = "";

  if (notes.length === 0) {
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #8e8e93; padding: 50px;">Tidak ada catatan ditemukan.</p>';
    return;
  }

  notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.onclick = () => openDetail(note);

    card.innerHTML = `
            <h3>${note.judul}</h3>
            <p>${note.isi}</p>
            <span class="note-date">${new Date(note.tanggal_dibuat).toLocaleDateString("id-ID")}</span>
        `;
    grid.appendChild(card);
  });
}

// --- FLOW DETAIL, EDIT, HAPUS ---
function openDetail(note) {
  document.querySelector("#detail-judul").innerText = note.judul;
  document.querySelector("#detail-isi").innerText = note.isi;
  document.querySelector("#detail-tanggal").innerText = new Date(
    note.tanggal_dibuat,
  ).toLocaleDateString("id-ID");

  document.querySelector("#btn-edit-note").onclick = () => openEdit(note);
  document.querySelector("#btn-delete-prompt").onclick = () => {
    document.querySelector("#btn-confirm-delete").onclick = () =>
      finalDelete(note.id);
    openModal("modal-confirm");
  };

  openModal("modal-detail");
}

function openEdit(note) {
  document.querySelector("#note-id").value = note.id;
  document.querySelector("#judul").value = note.judul;
  textareaIsi.value = note.isi;
  textareaIsi.style.height = textareaIsi.scrollHeight + "px";
  document.querySelector("#form-title").innerText = "Edit Catatan";
  openModal("modal-form");
}

formNote.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.querySelector("#note-id").value;
  const judul = document.querySelector("#judul").value;
  const isi = textareaIsi.value;

  try {
    if (id === "") {
      await axios.post(getApiBase(), { judul, isi });
    } else {
      await axios.put(`${getApiBase()}/${id}`, { judul, isi });
    }
    closeModal();
    getNotes(); // Refresh data dan variabel allNotes
  } catch (error) {
    alert("Gagal menyimpan catatan.");
  }
});

async function finalDelete(id) {
  try {
    await axios.delete(`${getApiBase()}/${id}`);
    closeModal();
    getNotes(); // Refresh data
  } catch (error) {
    console.error("Gagal hapus:", error);
  }
}
