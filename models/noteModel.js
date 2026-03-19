const db = require("../config/db");

const Note = {
  getAll: (callback) => {
    db.query("SELECT * FROM notes ORDER BY tanggal_dibuat DESC", callback);
  },
  create: (data, callback) => {
    db.query(
      "INSERT INTO notes (judul, isi) VALUES (?, ?)",
      [data.judul, data.isi],
      callback,
    );
  },
  update: (id, data, callback) => {
    db.query(
      "UPDATE notes SET judul = ?, isi = ? WHERE id = ?",
      [data.judul, data.isi, id],
      callback,
    );
  },
  delete: (id, callback) => {
    db.query("DELETE FROM notes WHERE id = ?", [id], callback);
  },
};

module.exports = Note;
