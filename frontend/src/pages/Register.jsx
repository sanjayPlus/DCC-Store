import { useState } from "react"
import "../assets/css/Login.css"
import axios from "axios"
import SERVER_URL from "../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
function Register() {
    const navigate = useNavigate();
    const [name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const handleSubmit=()=>{
    //validate data
    if(!name || !email || !password){
      toast.error("Please fill all the data");
      return
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    // Password must contain at least one uppercase letter, one lowercase letter, and one digit
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
    if (!re.test(password)) {
      toast.error("Password must contain at least one uppercase letter, one lowercase letter, and one digit");
      return;
    }
    
    //register user
    axios.post(SERVER_URL+"/user/register",{
        username:name,
        email:email,
        password:password
        }).then((res)=>{
        if(res.status===200){
            localStorage.setItem("token",res.data.token);
            navigate("/");
        }
        }).catch((err)=>{
        console.log(err);
        toast.error("Already Registered")
        
    })
}
  return (
    <>
      <div className="container">
        <div className="login-form-container">
        <div className="login-form">
          <h2>Register</h2>
            <input type="text" placeholder="Name" onChange={(e)=>setName(e.target.value)}/>
            <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)}/>
            <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)}/>
            <button type="submit" onClick={handleSubmit}>Register</button>
            <p onClick={()=>navigate("/login")}>Already Have A Account? &nbsp;<strong>Login</strong></p>
        </div>
        </div>
      </div>
    </>
  )
}

export default Register