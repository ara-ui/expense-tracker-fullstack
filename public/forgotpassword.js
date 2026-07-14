const form = document.getElementById("forgotForm");

form.addEventListener("submit", sendMail);

async function sendMail(e) {

    e.preventDefault();

    const email = document.getElementById("email").value;

    try {

        const response = await axios.post(
            "http://localhost:3000/password/forgotpassword",
            { email }
        );

        alert(response.data.message);
        window.location.href = "login.html";

    }
    catch (err) {

        alert(err.response?.data?.message || "Something went wrong");

    }

}