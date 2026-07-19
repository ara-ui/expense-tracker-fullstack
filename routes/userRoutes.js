
const express=require('express');
const router=express.Router();

const {createUser,loginUser,updatedincome,getincome}=require('../controller/userController');
const authenticate = require('../middleware/authentication');

router.post('/',createUser);
router.post('/login',loginUser);

router.put('/income',authenticate,updatedincome);
router.get( "/income",authenticate,getincome);

module.exports=router;

