const jwt=require('jsonwebtoken');
const {User}=require('../model');

const authenticate=async (req,res,next)=>{
    try{
        const token=req.header("Authorization");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //console.log("Decoded Token:", decoded);

        const user=await User.findByPk(decoded.userId);

        //console.log("Logged in User:", user.id, user.name);

        req.user=user;
        next();
    }
    catch(err){
        return res.status(401).json({
            message:"User not Authorized"
        });
    }

}

module.exports=authenticate;