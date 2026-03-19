const Note = require("../models/noteModel");

exports.getAllNotes = (req, res) => {
  Note.getAll((err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

exports.addNote = (req, res) => {
  Note.create(req.body, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Note added!" });
  });
};

exports.updateNote = (req, res) => {
  Note.update(req.params.id, req.body, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Note updated!" });
  });
};

exports.deleteNote = (req, res) => {
  Note.delete(req.params.id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Note deleted!" });
  });
};
