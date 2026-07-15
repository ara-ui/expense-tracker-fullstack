const User=require('./User');
const Expense=require('./Expense');
const Order=require('./Order');

const ForgotPasswordRequest=require('./ForgotPasswordRequest');



User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

module.exports={User,Order,Expense,ForgotPasswordRequest};
