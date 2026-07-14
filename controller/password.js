const User = require("../model/User");
const mailService = require("../services/mailService");

exports.forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        console.log("Received email:", email);

        const user = await User.findOne({
            where: { email }
        });


        console.log("User found:", user);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await mailService.sendMail(email);

        return res.status(200).json({
            message: "Mail sent successfully"
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Something went wrong"
        });

    }

};