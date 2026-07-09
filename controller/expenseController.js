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
            category
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

        await Expense.destroy({
            where:{
                id
            }
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