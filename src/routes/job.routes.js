const express = require("express");
const jobController = require("../controllers/job.controller");

const router = express.Router();

router.post("/", jobController.create);
router.get("/", jobController.list);
router.get("/:id", jobController.getById);

module.exports = router;
