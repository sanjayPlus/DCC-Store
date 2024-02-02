import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { useNavigate } from "react-router-dom";

function AddCategory() {
const [category,setCategory]=useState("")
const [categories,setCategories]=useState([])
const navigate = useNavigate();
useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    axios
      .get(`${SERVER_URL}/admin/protected`, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.status === 200) {
          axios
            .get(`${SERVER_URL}/product/get-all-categories`, {
              headers: { "x-access-token": token },
            })
            .then((userResponse) => {
              if (userResponse.status === 200) {
                setCategories(userResponse?.data);
              }
            })
            .catch((err) => {
              console.log(err.response.data);
            });
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform actions with user data, for example, send it to a backend server
    axios.post(`${SERVER_URL}/product/add-category`, {name:category},{headers:{
        "x-access-token":localStorage.getItem("token")
    }}).then((res) => {
        if(res.status===201){
        
            setCategories([...categories,res.data.category])
             setCategory("")
        }

    }).catch((err)=>{
        console.log(err.response.data);
    })
    // Reset the form after submission
  };

  function handleDelete(id){
    axios.delete(`${SERVER_URL}/product/delete-category/${id}`,{headers:{
        "x-access-token":localStorage.getItem("token")
    }}).then((res) => {
        if(res.status===200){
            setCategories(categories.filter((cat)=>cat._id!==id))
        }
    })
  }
  console.log(categories);
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
                    <h6 className="card-title">Add Category</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="exampleInputUsername1" className="form-label">
                          Category
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="exampleInputUsername1"
                          autoComplete="off"
                          placeholder="Category"
                          name="name"
                          value={category}
                          onChange={(e)=>setCategory(e.target.value)}
                        />
                      </div>
                    

                      <button type="submit" className="btn btn-primary me-2 m-2">
                        Submit
                      </button>
                    </form>
                    <h6 className="card-title m-5">All Category</h6>
                    <div className="table-responsive">
                      <table id="dataTableExample" className="table">
                        <thead>
                          <tr>
                            <th>Name</th>
                           
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                         {categories?.map((cat)=>(

                            <tr key="">
                         <th>{cat.name}</th>

                             
                             
                              <th>
                                <p
                                  className="btn btn-danger"
                              onClick={()=>handleDelete(cat._id)}
                                >
                                  Delete
                                </p>
                              </th>
                            </tr>
                         ))}
                      
                        </tbody>
                      </table>
                    </div>
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

export default AddCategory;