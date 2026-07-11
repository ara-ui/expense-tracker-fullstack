const BASE_URL = "http://localhost:3000";

const form = document.getElementById("expenseForm");

const expenseList = document.getElementById("expenseList");

// Load all expenses

window.addEventListener("DOMContentLoaded", getExpenses);

// Submit Form

form.addEventListener("submit", addExpense);

document.getElementById("rzp-button1")
.addEventListener("click", buyPremium);

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
            `${BASE_URL}/expense/addexpense`,

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

            `${BASE_URL}/expense/getexpenses`,
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

            `${BASE_URL}/expense/deleteexpense/${id}`,
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


async function buyPremium() {

    try {

        const token = localStorage.getItem("token");

        // Create order from backend
        const response = await axios.get(
            `${BASE_URL}/purchase/premiummembership`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        console.log(response.data);

        const cashfree = Cashfree({
            mode: "sandbox"
        });

        let checkoutOptions = {

            paymentSessionId: response.data.payment_session_id,

            redirectTarget: "_modal"

        };

        cashfree.checkout(checkoutOptions).then(async(result) => {

            console.log(result);

            // User closed popup
            if (result.error) {

                await axios.post(

                    `${BASE_URL}/purchase/failedtransaction`,

                    {

                        order_id: response.data.order_id

                    },

                    {

                        headers: {

                            Authorization: token

                        }

                    }

                );

                alert("TRANSACTION FAILED");

            }

            // Payment completed
            if (result.paymentDetails) {

                await axios.post(

                    `${BASE_URL}/purchase/updatetransactionstatus`,

                    {

                        order_id: response.data.order_id

                    },

                    {

                        headers: {

                            Authorization: token

                        }

                    }

                );

                alert("Transaction Successful");

            }

        });

    }

    catch (err) {

        console.log(err);

        alert("Something went wrong");

    }

}