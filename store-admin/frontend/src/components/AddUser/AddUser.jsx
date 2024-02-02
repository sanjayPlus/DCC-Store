import { useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import toast from 'react-hot-toast';

function AddUser() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    userType: "admin", // Set the default value for the userType
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform actions with user data, for example, send it to a backend server
    axios.post(`${SERVER_URL}/admin/add-user`, user,{headers:{
        "x-access-token":localStorage.getItem("token")
    }}).then((res) => {
        if(res.status===201){

            setUser({
              name: "",
              email: "",
              password: "",
              userType: "admin", // Set the default value for the userType
            });
           toast.success("User Added Successfully")
        }

    }).catch((err)=>{
        console.log(err.response.data);
    })
    // Reset the form after submission
  };

  return (
    <>
      <div className="main-wrapper">
        <SideBar />
        <div className="page-wrapper">
          <NavBar />
          <div className="page-content">
            <div className="row">
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Add User</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="exampleInputUsername1" className="form-label">
                          Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputUsername1"
                          autoComplete="off"
                          placeholder="Username"
                          name="name"
                          value={user.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">
                          Email address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="exampleInputEmail1"
                          placeholder="Email"
                          name="email"
                          value={user.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="exampleInputPassword1"
                          autoComplete="off"
                          placeholder="Password"
                          name="password"
                          value={user.password}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="exampleFormControlSelect1" className="form-label">
                          User Type
                        </label>
                        <select
                          className="form-select"
                          id="exampleFormControlSelect1"
                          name="userType"
                          value={user.userType}
                          onChange={handleChange}
                        >
                          <option value="admin">Admin</option>
                          <option value="vendor">Vendor</option>
                          <option value="user">User</option>
                        </select>
                      </div>

                      <button type="submit" className="btn btn-primary me-2 m-2">
                        Submit
                      </button>
                      <button type="reset" className="btn btn-secondary">
                        Cancel
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddUser;
