const form = document.getElementById("resetForm");

form.addEventListener("submit", updatePassword);

async function updatePassword(e){

    e.preventDefault();

    const password = document.getElementById("password").value;

    const id = window.location.pathname.split("/").pop();

    try{

        const response = await axios.post(

            `/password/updatepassword/${id}`,

            {
                password
            }

        );

        alert(response.data.message);

        window.location.href="/login.html";

    }
    catch(err){

        alert(err.response?.data?.message || "Something went wrong");

    }

}