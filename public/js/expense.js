

// Load all expenses

window.addEventListener("DOMContentLoaded", ()=>{
    document.getElementById("rowsPerPage").value = limit;

    getExpenses(currentPage);
    showPremiumFeatures();
    loadIncome();
});


// Submit Form

form.addEventListener("submit", addExpense);

premiumBtn.addEventListener("click", buyPremium);


updateBtn.addEventListener("click", showIncomeEditor);

saveIncome.addEventListener("click", saveIncomeData);

cancelIncome.addEventListener("click", cancelIncomeEdit);

//rows per page

document.getElementById("rowsPerPage").addEventListener("change", function(){

    limit = Number(this.value);

    localStorage.setItem("limit", limit);

    currentPage = 1;

    localStorage.setItem("currentPage", currentPage);

    getExpenses(currentPage);

});