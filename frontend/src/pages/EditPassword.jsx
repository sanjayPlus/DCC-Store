import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import "../assets/css/EditPassword.css"
import axios from 'axios'
import SERVER_URL from '../config/SERVER_URL'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast';
function EditPassword() {
    const navigate = useNavigate();
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    useEffect(() => {
        if(localStorage.getItem("token")){
          axios.get(SERVER_URL+"/user/protected",{
            headers:{
             "x-access-token":localStorage.getItem("token")
            }
          }).then((res)=>{
            if(res.status!==200){
              navigate("/login")
            }
          }).catch((err)=>{
            console.log(err);
            localStorage.removeItem("token");
            navigate("/login")
          })
        }else{
          navigate("/login")
        }
      }, [navigate])
    
    const handleEditPassword = ()=>{
        //validate data
        if (!password || !confirmPassword) {
            toast.error("Please fill all the data");
            return;
        }
        if (password!==confirmPassword){
          toast.error("Passwords do not match");
            return
        }
        axios.put(SERVER_URL+"/user/edit-password",{
            password:password,
        }, {
         headers:{
          "x-access-token":localStorage.getItem("token")
         }
        }).then((res)=>{
          if(res.status===200){
            setPassword("");
            setConfirmPassword("");
            toast.success("Password updated successfully");
            navigate("/profile")
          }
        }).catch((err)=>{
          console.log(err);
        
        })
    }

  return (
    <>
   
    <div className="container">
        <Navbar active=""/>
            <div className="edit-container">
                <div className="edit-content">
                    <img src="https://cdn-icons-png.flaticon.com/128/3064/3064155.png" alt="" />
                    <h1>Reset Password</h1>
                <div className="edit-form">
                    <input type="password" id="password" placeholder="New Password" onChange={(e)=>setPassword(e.target.value)}/>
                    <input type="password" id="confirm-password" placeholder="Confirm Password" onChange={(e)=>setConfirmPassword(e.target.value)}/>
                    <button className="button-9" role="button" onClick={handleEditPassword}>Reset Password </button>
                </div>
                </div>
            </div>

    </div>
    </>
  )
}

export default EditPassword