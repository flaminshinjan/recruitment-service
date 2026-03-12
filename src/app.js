const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const routes = require("./routes");

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());
app.use("/", routes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

module.exports = app;
