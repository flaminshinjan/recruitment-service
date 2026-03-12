const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const { ensureIndex } = require("./config/elasticsearch");
const candidateRoutes = require("./routes/candidate.routes");
const jobRoutes = require("./routes/job.routes");
const applicationRoutes = require("./routes/application.routes");
const searchRoutes = require("./routes/search.routes");

const app = express();

app.use(cors());
app.use(morgan("combined"));
app.use(express.json());

app.use("/candidates", candidateRoutes);
app.use("/jobs", jobRoutes);
app.use("/applications", applicationRoutes);
app.use("/search", searchRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

ensureIndex().catch(() => {});

module.exports = app;
