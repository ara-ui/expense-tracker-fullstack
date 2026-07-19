const express=require("express");
const router=express.Router();

const {getReport}=require('../controller/reportsController');
const authenticate=require('../middleware/authentication');

router.get("/report",authenticate,getReport);

module.exports=router;
