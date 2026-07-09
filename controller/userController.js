const User=require('../model/User');

const createUser=async(req,res)=>{
    const {name,email,password}=req.body;
    try{
        if(!name || !email || !password){
            return res.status(400).json({
                message:"All fields are required",
            });
        }

        const existingUser = await User.findOne({
            where: {
                email
            }
        });

        if(existingUser){

        return res.status(409).json({
            success:false,
            message:"User already exists"
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

        console.log(err);
        
        res.status(500).json({
            success:false,
            message:err.message,
            
        });
    }
}


const loginUser=async(req,res)=>{
    try{

    
    const {email,password}=req.body;

    const user=await User.findOne({
        where:{email}
    });
    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        });
    }
    if(user.password!=password){
        return res.status(401).json({
            success:false,
            message:"Invalid password"
        });
    }
    res.status(200).json({
        success:true,
        message:"Login successful"
    });
}catch(err){
res.status(500).json({
    success:false,
    message:"Something went wrong"
    });
    }
}

module.exports={createUser, loginUser};
