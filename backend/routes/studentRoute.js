const express = require("express");

const router = express.Router();

const { createStudent } = require("../services/studentService");

router.post("/", createStudent);

module.exports = router;
