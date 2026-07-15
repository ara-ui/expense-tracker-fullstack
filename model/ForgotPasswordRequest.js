const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ForgotPasswordRequest = sequelize.define("ForgotPasswordRequest", {

    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }

});

module.exports = ForgotPasswordRequest;