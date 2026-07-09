const express=require('express');
const router=express.Router();

const {
    addExpense,
    getExpenses,
    deleteExpense
}=require('../controller/expenseController');


router.post('/addexpense',addExpense);

router.get('/getexpenses',getExpenses);

router.delete('/deleteexpense/:id',deleteExpense);

module.exports=router;