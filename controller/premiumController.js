const User=require('../model/User');
const Expense=require('../model/Expense');

const getLeaderBoard=async (req,res)=>{
    try{
        const users=await User.findAll();

        const leaderboard=[];

        for(const user of users){
            const expenses=await Expense.findAll({
                where:{
                    UserId:user.id
                }
            });
            let totalExpense=0;

            expenses.forEach(expense=>{
                totalExpense += Number(expense.amount);
            });
            leaderboard.push({
                name:user.name,
                totalExpense
            });
        }
        leaderboard.sort((a, b) => b.totalExpense - a.totalExpense);

        res.status(200).json(leaderboard);
    }
    catch(err){
        console.log(err)

        res.status(500).json({
            success:false,
            message:err.message
        });
    }
};
module.exports={getLeaderBoard};