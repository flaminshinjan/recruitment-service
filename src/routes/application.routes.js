const express = require("express");
const applicationController = require("../controllers/application.controller");

const router = express.Router();

router.post("/", applicationController.apply);
router.get("/", applicationController.list);

module.exports = router;
