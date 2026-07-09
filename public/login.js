const form=document.getElementById("login-form");

form.addEventListener("submit",loginUser);

async function loginUser(e){
    e.preventDefault();

    const user={
        email:document.getElementById("email").value,
        password:document.getElementById("password").value
    }
    try{
        const response=await axios.post("http://localhost:3000/users/login",user);
        alert(response.data.message);
        window.location.href = "signup.html";
        
    }catch(err){
        console.log(err.message);
        alert(err.response.data.message);
    }
}