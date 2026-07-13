const User = require("../model/User");
const Expense = require("../model/Expense");
const sequelize = require("../db");

const getLeaderBoard = async (req, res) => {

    try {

        const leaderboard = await User.findAll({

            attributes: [

                "id",

                "name",

                [
                    sequelize.fn(
                        "SUM",
                        sequelize.col("Expenses.amount")
                    ),
                    "totalExpense"
                ]

            ],

            include: [

                {
                    model: Expense,
                    attributes: []
                }

            ],

            group: ["User.id"],

            order: [[sequelize.literal("totalExpense"), "DESC"]]

        });

        res.status(200).json(leaderboard);

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

module.exports = {
    getLeaderBoard
};