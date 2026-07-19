const { Op } = require("sequelize");
const { Expense } = require("../model");

const getReport=async (req,res)=>{

    try{

        const {type,date}=req.query;

        let startDate;
        let endDate;

        switch(type){

            case "daily":
                startDate=new Date(date);
                endDate=new Date(date);
                endDate.setDate(endDate.getDate()+1);

                break;

            case "weekly":

            startDate=new Date(date);
            endDate=new Date(date);
            endDate.setDate(endDate.getDate() +7);

                break;

            case "monthly":
                startDate=new Date(date);
                endDate= new Date(startDate);
                endDate.setMonth(endDate.getMonth()+1);
                break;

            case "yearly":
                startDate=new Date(date);
                endDate=new Date(startDate);
                endDate.setFullYear(endDate.getFullYear()+1);
                break;
            default:
                return res.status(400).json({
                    success:false,
                    message:"Invalid report type"
                });
        }

        const expenses=await Expense.findAll({
            where:{
                UserId:req.user.id,
                createdAt:{
                    [Op.gte]:startDate,
                    [Op.lt]:endDate
                }
            },
            order:[["createdAt","DESC"]]
        });
        const totalExpense = expenses.reduce((sum, expense) => {

            return sum + Number(expense.amount);

        }, 0);

        res.status(200).json({

            success: true,

            expenses,

            totalExpense

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Something went wrong"

        });

    }

};

module.exports = {

    getReport

};
