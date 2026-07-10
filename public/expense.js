const form = document.getElementById("expenseForm");

const expenseList = document.getElementById("expenseList");

// Load all expenses

window.addEventListener("DOMContentLoaded", getExpenses);

// Submit Form

form.addEventListener("submit", addExpense);

// Add Expense

async function addExpense(e){

    e.preventDefault();

    const expense = {

        amount: document.getElementById("amount").value,

        description: document.getElementById("description").value,

        category: document.getElementById("category").value

    };

    try{
        const token=localStorage.getItem("token");
        const response = await axios.post(

            "http://localhost:3000/expense/addexpense",

            expense,
            {
                headers:{
                    Authorization:token
                }
            }

        );

        showExpense(response.data.expense);

        form.reset();

    }

    catch(err){

        console.log(err);

    }

}

// Get Expenses

async function getExpenses(){

    try{
        const token = localStorage.getItem("token");

        const response = await axios.get(

            "http://localhost:3000/expense/getexpenses",
             {
                headers:{
                    Authorization:token
                }
            }

        );

        expenseList.innerHTML = "";

        response.data.expenses.forEach(showExpense);

    }

    catch(err){

        console.log(err);

    }

}

// Show Expense

function showExpense(expense){

    const li = document.createElement("li");

    li.innerHTML = `

        ${expense.amount} - ${expense.category} - ${expense.description}

        <button class="delete-btn"

        onclick="deleteExpense(${expense.id},this)">

        Delete Expense

        </button>

    `;

    expenseList.appendChild(li);

}

// Delete Expense

async function deleteExpense(id, button){

    try{
        const token = localStorage.getItem("token");

        await axios.delete(

            `http://localhost:3000/expense/deleteexpense/${id}`,
            {
    headers:{
        Authorization:token
        }
    }

        );

        button.parentElement.remove();

    }

    catch(err){

        console.log(err);

    }

}