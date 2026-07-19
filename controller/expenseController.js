const Expense=require('../model/Expense');
const aiService = require("../services/aiService");
const User = require("../model/User");
const sequelize = require("../db");


const addExpense=async(req,res)=>{
    let t;

    try{

     t = await sequelize.transaction();

        const {amount,description}=req.body;

        if(!amount || !description ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        

        //get category from ai

        let category="Other";

        try{
            category=await aiService.getCategory(description);
        }catch(err){
            console.log("AI Error:",err.message);
        }

        const expense= await Expense.create({
            amount,
            description,
            category,
            UserId:req.user.id
        },
        {
            transaction: t
});

        //adding total expense in user table 
       const user = await User.findByPk(req.user.id,{
    transaction: t
});

        await user.update({
            totalExpense: Number(user.totalExpense) + Number(amount)
        },
    {
    transaction: t
});

        await t.commit();

        res.status(201).json({
            success:true,
            message:"Expense Added",
            expense
        });

        

    }
    catch(err){
        await t.rollback();

        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};

//get expenses

const getExpenses=async(req,res)=>{
    try{
        //pagination

        const page=Number(req.query.page)|| 1;
        const ITEMS_PER_PAGE = Number(req.query.limit) || 10;
        const offset=(page -1) *ITEMS_PER_PAGE;

        const totalExpenses=await Expense.count({
            where:{
                UserId:req.user.id
            }
        });


        const expenses=await Expense.findAll({
            where:{
                UserId:req.user.id
            },
            order:[["id","DESC"]],
            limit:ITEMS_PER_PAGE,
            offset:offset
        });


        res.status(200).json({
            success:true,
            expenses,
            currentPage:page,
            hasNextPage:ITEMS_PER_PAGE*page < totalExpenses,
            nextPage:page+1,
            hasPreviousPage:page >1,
            previousPage:page-1,
            lastPage:Math.ceil(totalExpenses/ITEMS_PER_PAGE)
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
const deleteExpense = async (req, res) => {
    let t;

    try {

        
        t =await sequelize.transaction();

        const expense = await Expense.findOne({
            where: {
                id: req.params.id,
                UserId: req.user.id
            }
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        await expense.destroy({
            transaction:t
        });

        const user = await User.findByPk(req.user.id,{
    transaction: t
});

        await user.update({
            totalExpense: Number(user.totalExpense) - Number(expense.amount)
        },{
            transaction:t
        });

        await t.commit();

        res.status(200).json({
            success: true,
            message: "Expense deleted"
        });

    } catch (err) {
        await t.rollback();

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports={
    addExpense,
    getExpenses,
    deleteExpense
}