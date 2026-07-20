
const express=require('express');
const router=express.Router();

const {createUser,loginUser,updatedincome,getincome,downloadExpenses}=require('../controller/userController');
const authenticate = require('../middleware/authentication');

router.post('/',createUser);
router.post('/login',loginUser);

router.get(
    "/download",authenticate,downloadExpenses);

module.exports=router;

