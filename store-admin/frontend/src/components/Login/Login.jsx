import "../../assets/fonts/feather-font/css/iconfont.css"
import "../../assets/vendors/flag-icon-css/css/flag-icon.min.css"
import "../../assets/css/dashboard/style.css"

import { useState } from "react"
import axios from "axios"
import SERVER_URL from "../../config/SERVER_URL"
import { useNavigate } from "react-router-dom"
import toast from 'react-hot-toast';

function Login() {
    const [email,setEmail] = useState("")
    const [password,setPassword]= useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();
    function handleSubmit(e){
        e.preventDefault();
        if(email === "" || password === ""){
          toast.error("Please fill all the fields")
        }else{
            setError("")
            axios.post(`${SERVER_URL}/admin/login`,{email:email,password:password}).then((res)=>{
                if(res.status===200){
                  toast.success("Login Successfull")
                    localStorage.setItem("token",res.data.token);
                    navigate("/");
                }else{
                    toast.error("Incorrect Username or Password")
                }
            }).catch(()=>{
              toast.error("Incorrect Username or Password")
            })
        }
        
    }

  return (
    <>
 <div className="main-wrapper">
    <div className="page-wrapper full-page">
      <div className="page-content d-flex align-items-center justify-content-center">
        <div className="row w-100 mx-0 auth-page">
          <div className="col-md-8 col-xl-6 mx-auto">
            <div className="card">
              <div className="row login-row">
               
                <div className="col-md-8 ps-md-0">
                  <div className="auth-form-wrapper px-4 py-5">
                   
                    <h5 className="text-muted fw-normal mb-4">
                      Welcome back! Log in to your account.
                    </h5>
                    <div className="forms-sample">
                      
                      <div className="mb-3">
                        <label htmlFor="userEmail" className="form-label">
                          Email address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="userEmail"
                          placeholder="Email"
                          onChange={(e)=>setEmail(e.target.value)}
                          value={email}
                        />

                      </div>
                      <div className="mb-3">
                        <label htmlFor="userPassword" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="userPassword"
                          autoComplete="current-password"
                          placeholder="Password"
                          onChange={(e)=>setPassword(e.target.value)}
                          value={password}
                        />
                          <p style={{color:"red",margin:"10px 0"}}>{error}</p>
                      </div>
                      <div className="form-check mb-3">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="authCheck"
                        />
                        <label className="form-check-label" htmlFor="authCheck">
                          Remember me
                        </label>
                      </div>
                      <div>
                        <button
                        onClick={(e)=>handleSubmit(e)}
                          className="btn btn-primary me-2 mb-2 mb-md-0 text-white"
                        >
                          Login
                        </button>
                      
                      </div>
                      {/* <a
                        href="register.html"
                        className="d-block mt-3 text-muted"
                      >
                        Not a user? Sign up
                      </a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </>
  )
}

export default Login
