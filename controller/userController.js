const User = require('../model/User');
const Expense = require("../model/Expense");
const S3Service = require("../services/S3Service");
const bcrypt = require("bcrypt");
const jwt=require('jsonwebtoken');


//token generation func
function generateAccessToken(id, name, isPremiumUser){

    return jwt.sign(
        {
            userId:id,
            name:name,
            isPremiumUser:isPremiumUser
        },
        process.env.JWT_SECRET
    );

};

//createuser


const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({
            where: {
                email
            }
        });

        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "User already exists"
            });

        }

        // HASH PASSWORD to store while creating a user
        bcrypt.hash(password, 10, async (err, hash) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });
            }

            const user = await User.create({
                name,
                email,
                password: hash
            });

            res.status(201).json({
                success: true,
                message: "User created successfully",
                user,
            });

        });

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message,

        });
    }
}


const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        bcrypt.compare(password, user.password, (err, result) => {

            if (err) {

                return res.status(500).json({
                    success: false,
                    message: "Something went wrong"
                });

            }

            if (!result) {

                return res.status(401).json({
                    success: false,
                    message: "User not authorized"
                });

            }

            // Password matched
            return res.status(200).json({

                success: true,

                message: "Login Successful",

                token: generateAccessToken(

                    user.id,

                    user.name,

                    user.isPremiumUser

                )

            });

        });

    }

    catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,

            message: "Something went wrong"

        });

    }

};

//income part starts here

const updatedincome=async(req,res)=>{
    try{
        const{monthlyIncome}=req.body;

        req.user.monthlyIncome=monthlyIncome;
        await req.user.save();

        res.status(200).json({
            success:true,
            monthlyIncome:req.user.monthlyIncome
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}


//get income

const getincome=async (req,res)=>{
    try{
        res.status(200).json({
            success:true,
            monthlyIncome:req.user.monthlyIncome
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
}



const downloadExpenses = async (req, res) => {

    try {

        if (!req.user.isPremiumUser) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const expenses = await Expense.findAll({
            where: {
                userId: req.user.id
            }
        });

        const data = JSON.stringify(expenses);

        const filename = `Expenses/User-${req.user.id}/${Date.now()}.txt`;

        const fileURL = await S3Service.uploadToS3(data, filename);

        return res.status(200).json({
            success: true,
            fileURL
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });

    }

};
module.exports = { createUser, loginUser,updatedincome ,getincome,downloadExpenses};