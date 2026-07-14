require("dotenv").config();

const express=require('express');
const sequelize=require('./db');
const cors=require('cors');
const path=require('path');

require('./model');

const userRoutes=require('./routes/userRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const purchaseRoutes = require("./routes/purchaseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const passwordRoutes = require("./routes/password");




const app=express();




//middlewares
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));


//routes

app.use('/users',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase', purchaseRoutes);
app.use("/premium", premiumRoutes);
app.use("/password", passwordRoutes);

//sync database

sequelize.sync({alter:true}).then(()=>{
    console.log("Table created succesfully");
    
    app.listen(3000,()=>{
    console.log("Server is running on port 3000");
    });
    console.log("BREVO KEY:", process.env.BREVO_API_KEY);

})
.catch((err)=>{
    console.log(err);
});


