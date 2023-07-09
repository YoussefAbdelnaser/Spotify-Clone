require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const connection = require("./db");

const app = express();

connection();

const port = process.env.PORT;
app.listen(port, console.log("server connected"));
