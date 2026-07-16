const BASE_URL = "http://localhost:3000";

const form = document.getElementById("expenseForm");

const expenseList = document.getElementById("expenseList");

const premiumMessage = document.getElementById("premiumMessage");
const premiumNav = document.getElementById("premiumNav");
const premiumBtn = document.getElementById("rzp-button1");

// Load all expenses

window.addEventListener("DOMContentLoaded", ()=>{
    getExpenses(1);
    showPremiumFeatures()
});

// Submit Form

form.addEventListener("submit", addExpense);

premiumBtn.addEventListener("click", buyPremium);


//show Premium Features

function showPremiumFeatures(){
    const token=localStorage.getItem("token");

    if(!token) return;

    const decodedToken=jwt_decode(token);

     if(decodedToken.isPremiumUser){

        premiumMessage.innerHTML = "You are a Premium User now";

        premiumBtn.style.display = "none";

        premiumNav.style.display = "flex";

    }else{

        premiumMessage.innerHTML = "";

        premiumNav.style.display = "none";

        premiumBtn.style.display = "block";

    }
}



// Add Expense

async function addExpense(e){

    e.preventDefault();

    //show processing in submit button
    const addBtn = form.querySelector('button[type="submit"]');

    addBtn.disabled = true;
    addBtn.textContent = "Processing...";
    addBtn.classList.add("processing");
    //show loading
    document.getElementById("loading").style.display = "block";

    const expense = {

        amount: document.getElementById("amount").value,

        description: document.getElementById("description").value,

        

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
        //hide loading
         document.getElementById("loading").style.display = "none";

         addBtn.disabled = false;
        addBtn.textContent = "Add Expense";
        addBtn.classList.remove("processing");

        showExpense(response.data.expense);

        form.reset();

    }

    catch(err){
         // HIDE LOADING EVEN IF THERE IS AN ERROR
        document.getElementById("loading").style.display = "none";
        
        addBtn.disabled = false;
        addBtn.textContent = "Add Expense";
        addBtn.classList.remove("processing");

        console.log(err);

    }

}

// Get Expenses

async function getExpenses(page){

    try{
        const token = localStorage.getItem("token");

        const response = await axios.get(

            `${BASE_URL}/expense/getexpenses?page=${page}`,
             {
                headers:{
                    Authorization:token
                }
            }

        );

        expenseList.innerHTML = "";

        response.data.expenses.forEach(showExpense);

        showPagination(response.data);
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

//buy premium btn
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

        const checkoutOptions = {
            paymentSessionId: response.data.payment_session_id,
            redirectTarget: "_modal"
        };

        cashfree.checkout(checkoutOptions).then(async (result) => {

            console.log(result);

            // User closed payment popup
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
                return;
            }

            // Payment Successful
            if (result.paymentDetails) {

                const paymentResponse = await axios.post(
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

                // Save new premium token
                localStorage.setItem("token", paymentResponse.data.token);

                alert("Transaction Successful");

                // Reload page to show premium features
                location.reload();
            }

        });

    } catch (err) {

        console.log(err);
        alert("Something went wrong");

    }

}


function showPagination(data){

    const pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    function createButton(page, active = false){

        const button = document.createElement("button");

        button.innerText = page;

        button.className = active ? "page-btn active" : "page-btn";

        button.addEventListener("click", () => getExpenses(page));

        pagination.appendChild(button);

    }

    function createDots(){

        const span = document.createElement("span");

        span.innerText = "...";

        span.style.padding = "8px";

        pagination.appendChild(span);

    }

    const current = data.currentPage;

    const last = data.lastPage;

    // First page
    createButton(1, current === 1);

    // Left dots
    if(current > 4){
        createDots();
    }

    // Middle pages
    const start = Math.max(2, current - 2);
    const end = Math.min(last - 1, current + 2);

    for(let i = start; i <= end; i++){

        createButton(i, i === current);

    }

    // Right dots
    if(current < last - 3){
        createDots();
    }

    // Last page
    if(last > 1){

        createButton(last, current === last);

    }

}