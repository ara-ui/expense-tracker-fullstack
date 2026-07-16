const tabs = document.querySelectorAll(".tab");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

const dateLabel = document.querySelector(".date-picker span");

let currentView = "daily";
let currentDate = new Date();

tabs.forEach(tab => {

    tab.addEventListener("click", () => {

        tabs.forEach(t => t.classList.remove("active"));

        tab.classList.add("active");

        currentView = tab.dataset.view;

        updateDisplay();

    });

});

function updateDisplay() {

    if (currentView === "daily") {

        dateLabel.textContent = currentDate.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    }
    
    else if(currentView === "weekly"){

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

}

prevBtn.addEventListener("click", () => {

    if (currentView === "daily") {

        currentDate.setDate(currentDate.getDate() - 1);

    }
    else if(currentView === "weekly"){

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

nextBtn.addEventListener("click", () => {

    if (currentView === "daily") {

        currentDate.setDate(currentDate.getDate() + 1);

    }
    else if(currentView === "weekly"){

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

updateDisplay();