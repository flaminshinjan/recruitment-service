const express = require("express");
const candidateRoutes = require("./candidate.routes");
const jobRoutes = require("./job.routes");
const applicationRoutes = require("./application.routes");
const searchRoutes = require("./search.routes");

const router = express.Router();

router.use("/candidates", candidateRoutes);
router.use("/jobs", jobRoutes);
router.use("/applications", applicationRoutes);
router.use("/search", searchRoutes);

module.exports = router;
