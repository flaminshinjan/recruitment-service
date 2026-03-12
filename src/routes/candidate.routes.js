const express = require("express");
const candidateController = require("../controllers/candidate.controller");

const router = express.Router();

router.post("/", candidateController.create);
router.get("/", candidateController.list);
router.get("/:id", candidateController.getById);

module.exports = router;
