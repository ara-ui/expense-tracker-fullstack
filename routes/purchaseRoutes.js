const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authentication");

const {

    purchasePremium,

    updateTransactionStatus,

    failedTransaction

} = require("../controller/purchaseController");

router.get(

    "/premiummembership",

    authenticate,

    purchasePremium

);

router.post(

    "/updatetransactionstatus",

    authenticate,

    updateTransactionStatus

);

router.post(

    "/failedtransaction",

    authenticate,

    failedTransaction

);

module.exports = router;