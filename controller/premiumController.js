const User = require("../model/User");
const Expense = require("../model/Expense");
const sequelize = require("../db");

const getLeaderBoard = async (req, res) => {

    try {

        const leaderboard = await User.findAll({

            attributes: [

                "name",

               "totalExpense"
            ],

            order:[
                ["totalExpense","DESC"]
            ]

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