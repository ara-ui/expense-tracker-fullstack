const User = require("../model/User");
const mailService = require("../services/mailService");
const ForgotPasswordRequest = require("../model/ForgotPasswordRequest");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");




exports.forgotPassword = async (req, res) => {
   

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

      

        const user = await User.findOne({
            where: { email }
        });


        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const id=uuidv4();
        await ForgotPasswordRequest.create({
            id:id,
            isActive:true,
            UserId:user.id
        });
      


        await mailService.sendMail(email,id);
        

        return res.status(200).json({
            message: "Reset Password Link sent successfully"
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Something went wrong"
        });

    }

};



exports.resetPassword = async (req, res) => {

    try {

        const id = req.params.id;

        const request = await ForgotPasswordRequest.findOne({
            where: {
                id: id,
                isActive: true
            }
        });

        if (!request) {

            return res.status(400).send("Invalid or Expired Reset Link");

        }

        res.sendFile(
            require("path").join(__dirname, "../public/resetpassword.html")
        );

    }
    catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Something went wrong"
        });

    }

};


exports.updatePassword = async(req,res)=>{

    try{

        const id = req.params.id;

        const { password } = req.body;

        const request = await ForgotPasswordRequest.findOne({

            where:{
                id:id,
                isActive:true
            },

            include: User

        });

        if(!request){

            return res.status(400).json({

                message:"Invalid or Expired Link"

            });

        }

        const hashedPassword = await bcrypt.hash(password,10);

        await User.update(

            {

                password:hashedPassword

            },

            {

                where:{
                    id:request.UserId
                }

            }

        );

        request.isActive=false;

        await request.save();

        return res.status(200).json({

            message:"Password Updated Successfully"

        });

    }

    catch(err){

        console.log(err);

        return res.status(500).json({

            message:"Something went wrong"

        });

    }

}