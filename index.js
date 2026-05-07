require("dotenv").config();
const express = require("express");
const cors = require("cors");
const noteRoutes = require("./routes/noteRoutes");
const app = express();
app.use(cors());
app.use(express.json());

// Mapping Routes
app.use("/api/notes", noteRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
