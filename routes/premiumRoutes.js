const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authentication");

const {getLeaderBoard} = require("../controller/premiumController");

router.get(
    "/leaderboard",
    authenticate,
    getLeaderBoard
);

module.exports = router;