const BASE_URL = "http://localhost:3000";

window.addEventListener("DOMContentLoaded", loadLeaderboard);

async function loadLeaderboard() {

    try {

        const token = localStorage.getItem("token");

        const response = await axios.get(

            `${BASE_URL}/premium/leaderboard`,

            {

                headers: {

                    Authorization: token

                }

            }

        );

        const leaderboard = document.getElementById("leaderboardList");

        leaderboard.innerHTML = "";

        response.data.forEach((user, index) => {

            const li = document.createElement("li");

            li.innerHTML = `

                <span>${index + 1}. ${user.name}</span>

                <span>₹${user.totalExpense}</span>

            `;

            leaderboard.appendChild(li);

        });

    }

    catch (err) {

        console.log(err);

    }

}