const express = require("express");
const searchController = require("../controllers/search.controller");

const router = express.Router();

router.get("/candidates", searchController.searchCandidates);

module.exports = router;
