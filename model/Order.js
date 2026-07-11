const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Order = sequelize.define("Order",{

    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },

    orderId:{
        type:DataTypes.STRING,
        allowNull: true
    },

    paymentId:{
        type:DataTypes.STRING,
        allowNull: true
    },

    status:{
        type:DataTypes.STRING,
        allowNull: false
    }

});

module.exports = Order;