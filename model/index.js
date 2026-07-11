const User=require('./User');
const Expense=require('./Expense');
const Order=require('./Order');


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

module.exports={User,Order,Expense};
