const form = document.getElementById("signupForm");

form.addEventListener("submit", addUser);

async function addUser(e) {

    e.preventDefault();

    const userDetails = {

        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value

    };

    try {

        const response = await axios.post(
            "http://localhost:3000/users",
            userDetails
        );

        alert(response.data.message);

        form.reset();

    }

    catch (err) {

        console.log(err);

        alert("Something went wrong");

    }

}