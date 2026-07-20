require("dotenv").config();

const PORT = process.env.PORT;
const express=require('express');
const app=express();
const sequelize=require('./db');
const cors=require('cors');
const path=require('path');

require('./model');

const morgan = require("morgan");
const fs = require("fs");


const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

const userRoutes=require('./routes/userRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const purchaseRoutes = require("./routes/purchaseRoutes");
const premiumRoutes = require("./routes/premiumRoutes");
const passwordRoutes = require("./routes/password");
const reportsRoutes = require("./routes/reportsRoutes");









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
app.use("/expense", reportsRoutes);

//sync database

sequelize.sync().then(()=>{
    console.log("Table created succesfully");
    
    app.listen(PORT,()=>{
    console.log("Server is running.");
    });
    

})
.catch((err)=>{
    console.log(err);
});


