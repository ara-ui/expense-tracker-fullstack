const User=require('../model/User');

const createUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({
                message:"All fields are required",
            });
        }
        const user=await User.create({
            name,
            email,
            password
        });
        
        res.status(201).json({
            success:true,
            message:"User created successfuly",
            user,
        });

    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
            
        });
    }
}

module.exports={createUser};
