const express = require("express");
const router = express.Router();

const passwordController = require("../controller/password");

router.post("/forgotpassword", passwordController.forgotPassword);

router.get('/resetpassword/:id',passwordController.resetPassword);

router.post(
    "/updatepassword/:id",
    passwordController.updatePassword
);

module.exports = router;