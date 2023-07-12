require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users.js");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");

const app = express();

connection();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/login", authRoutes);
app.use("/api/songs", songRoutes);

const port = process.env.PORT;
app.listen(port, console.log("server connected"));
