const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3040;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running without error...");
});

app.listen(port, () => {
  console.log(`Server running on Port : ${port}`);
});
