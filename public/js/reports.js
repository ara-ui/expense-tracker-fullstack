const tabs = document.querySelectorAll(".tab");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dateLabel = document.querySelector(".date-picker span");

const BASE_URL = "http://localhost:3000";
const token = localStorage.getItem("token");

let currentView = "daily";
let currentDate = new Date();


// -------------------------
// FORMAT DATE
// -------------------------

function formatDate(date) {

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// -------------------------
// TAB SWITCHING
// -------------------------

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));

        tab.classList.add("active");

        currentView = tab.dataset.view;

        updateDisplay();

    });

});


// -------------------------
// GET MONTHLY INCOME
// -------------------------

async function getIncome() {

    try {

        const response = await axios.get(
            `${BASE_URL}/users/income`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        return response.data.monthlyIncome || 0;

    }
    catch (err) {

        console.log(err);

        return 0;

    }

}


// -------------------------
// UPDATE DATE LABEL
// -------------------------

function updateDisplay() {

    if (currentView === "daily") {

        dateLabel.textContent = currentDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    }

    else if (currentView === "weekly") {

        const start = new Date(currentDate);

        start.setDate(currentDate.getDate() - currentDate.getDay());

        const end = new Date(start);

        end.setDate(start.getDate() + 6);

        dateLabel.textContent =
            `${start.toLocaleDateString("en-GB")} - ${end.toLocaleDateString("en-GB")}`;

    }

    else if (currentView === "monthly") {

        dateLabel.textContent = currentDate.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric"
        });

    }

    else {

        dateLabel.textContent = currentDate.getFullYear();

    }

    getReport();

}


// -------------------------
// PREVIOUS BUTTON
// -------------------------

prevBtn.addEventListener("click", () => {

    if (currentView === "daily") {

        currentDate.setDate(currentDate.getDate() - 1);

    }

    else if (currentView === "weekly") {

        currentDate.setDate(currentDate.getDate() - 7);

    }

    else if (currentView === "monthly") {

        currentDate.setMonth(currentDate.getMonth() - 1);

    }

    else {

        currentDate.setFullYear(currentDate.getFullYear() - 1);

    }

    updateDisplay();

});


// -------------------------
// NEXT BUTTON
// -------------------------

nextBtn.addEventListener("click", () => {

    if (currentView === "daily") {

        currentDate.setDate(currentDate.getDate() + 1);

    }

    else if (currentView === "weekly") {

        currentDate.setDate(currentDate.getDate() + 7);

    }

    else if (currentView === "monthly") {

        currentDate.setMonth(currentDate.getMonth() + 1);

    }

    else {

        currentDate.setFullYear(currentDate.getFullYear() + 1);

    }

    updateDisplay();

});


// -------------------------
// GET REPORT
// -------------------------

async function getReport() {

    const tbody = document.getElementById("reportBody");

    let date;

    if (currentView === "daily") {

        date = formatDate(currentDate);

    }

    else if (currentView === "weekly") {

        const start = new Date(currentDate);

        start.setDate(currentDate.getDate() - currentDate.getDay());

        date = formatDate(start);

    }

    else if (currentView === "monthly") {

        const year = currentDate.getFullYear();

        const month = String(currentDate.getMonth() + 1).padStart(2, "0");

        date = `${year}-${month}-01`;

    }

    else {

        date = `${currentDate.getFullYear()}-01-01`;

    }

    try {

        const response = await axios.get(
            `${BASE_URL}/expense/report?type=${currentView}&date=${date}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        const income = await getIncome();

        document.getElementById("income").textContent =
            `₹${income}`;

        tbody.innerHTML = "";

        const totalExpense = response.data.totalExpense;

        document.getElementById("expense").textContent =
            `₹${totalExpense}`;

        document.getElementById("saving").textContent =
            `₹${income - totalExpense}`;

        if (response.data.expenses.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center;padding:25px;">
                        No expenses found.
                    </td>
                </tr>
            `;

            return;

        }

        response.data.expenses.forEach(expense => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>
                    ${new Date(expense.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short"
                    })}
                </td>

                <td>${expense.description}</td>

                <td>${expense.category}</td>

                <td>₹${expense.amount}</td>
            `;

            tbody.appendChild(row);

        });

        console.log(response.data);

    }

    catch (err) {

        console.log(err);

    }

}


updateDisplay(); 