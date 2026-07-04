const {Sequelize}=require('sequelize');

const sequelize = new Sequelize('expense_app_full','root','admin123',{
    
    host:'localhost',
    dialect:'mysql'
});

sequelize.authenticate()
.then(()=>
    console.log("Database connected"))
.catch((err)=>
    console.log(err));

module.exports=sequelize;


