const User=require('./User');
const Expense=require('./Expense');

User.hasMany(Expense);
Expense.belongsTo(User);

module.exports={User,Expense};
