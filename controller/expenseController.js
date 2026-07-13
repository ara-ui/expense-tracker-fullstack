const Expense=require('../model/Expense');

const addExpense=async(req,res)=>{
    try{

        
        const {amount,description,category}=req.body;

        if(!amount || !description || !category){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        const expense= await Expense.create({
            amount,
            description,
            category,
            UserId:req.user.id
        });

        //adding total expense in user table 
        await req.user.update({

        totalExpense:
            Number(req.user.totalExpense) + Number(amount)

        });

        res.status(201).json({
            success:true,
            message:"Expense Added",
            expense
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

//get expenses

const getExpenses=async(req,res)=>{
    try{
        const expenses=await Expense.findAll({
            where:{
                UserId:req.user.id
            },
            order:[["id","DESC"]]
        });
        res.status(200).json({
            success:true,
            expenses
        });
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

//delete expenses

const deleteExpense=async(req,res)=>{
    try{
        const id=req.params.id;

        const expense=await Expense.findOne({
            where:{
                id:req.params.id,
                UserId:req.user.id
            }
        });

        if(!expense){
            return res.status(404).json({
                success:false,
                message:"Expense not found"
            });
        }

        await expense.destroy();
     
        //updating total expense in user table after one expense deleted
        await req.user.update({
            totalExpense:Number(req.user.totalExpense)-Number(expense.amount)
        });

        res.status(200).json({
            success:true,
            message:"Expense deleted"
        });
    
    }catch(err){
        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

module.exports={
    addExpense,
    getExpenses,
    deleteExpense
}