const express = require("express");
const router = express.Router();

const passwordController = require("../controller/password");

router.post("/forgotpassword", passwordController.forgotPassword);

module.exports = router;