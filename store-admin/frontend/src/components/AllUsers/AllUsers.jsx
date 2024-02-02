import NavBar from "../NavBar/NavBar"
import SideBar from "../SideBar/SideBar"
import "./AllUsers.css"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import SERVER_URL from "../../config/SERVER_URL"

function AllUsers() {
    const navigate = useNavigate();
    const [users,setUsers] = useState([]);
    const [name,setName] = useState("");
    const [page,setPage] = useState(1);
       useEffect(()=>{

        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login");
        }
        axios.get(`${SERVER_URL}/admin/protected`,{headers:{"x-access-token":token}}).then((res)=>{
            if(res.status===200){
                axios.get(`${SERVER_URL}/admin/users?page=1&perPage=10`,{headers:{"x-access-token":token}}).then((userResponse)=>{
                    if(userResponse.status===200){
                        setUsers(userResponse.data)
                    }
                }).catch((err)=>{
                    console.log(err.response.data);
                })
            }
        }).catch(()=>{
           localStorage.removeItem("token");
              navigate("/login");
        })
    },[navigate])

    useEffect(()=>{
      axios.get(`${SERVER_URL}/admin/users?page=1&perPage=10&search=${name}`,{headers:{"x-access-token":localStorage.getItem("token")}}).then((userResponse)=>{
        if(userResponse.status===200){
            setUsers(userResponse.data)
        }
    }).catch((err)=>{
        console.log(err.response.data);
    })
    },[name])
    useEffect(()=>{
      axios.get(`${SERVER_URL}/admin/users?page=${page}&perPage=10`,{headers:{"x-access-token":localStorage.getItem("token")}}).then((userResponse)=>{
        if(userResponse.status===200){
            setUsers(userResponse.data)
        }
    }).catch((err)=>{
        console.log(err.response.data);
    })
    },[page]);
    function handleDelete(id){
      axios.delete(`${SERVER_URL}/admin/delete-user/${id}`,{headers:{"x-access-token":localStorage.getItem("token")}}).then((res)=>{
        if(res.status===200){
          setUsers(users.filter((user)=>user._id!==id))
        }
      }).catch((err)=>{
        console.log(err.response.data);
      })
    }
  return (
    <>
    <div className="main-wrapper">
    <SideBar />
    <div className="page-wrapper">
      <NavBar name={name} setName={setName} link="all-users"/>
      <div className="page-content">
      <div className="row">
  <div className="col-md-12 grid-margin stretch-card">
    <div className="card">
      <div className="card-body">
        <h6 className="card-title">Data Table</h6>
    
        <div className="table-responsive">
          
          <table id="dataTableExample" className="table">
            <thead>
              <tr>
                <th>Name</th>
                {/* <th>UserType</th> */}
                <th>Email</th>
                {/* <th>Edit</th> */}
                <th>Delete</th>
                <th>Orders</th>
              </tr>
            </thead>
            <tbody>
             {users.map((user)=>(
                <tr key="">
                    <th>{user.username}</th>
                    {/* <th>{user.userType}</th> */}
             
                    <th>{user.email}</th>
                    {/* <th><p className="btn btn-primary" onClick={()=>navigate("/edit-user/"+user._id)}>Edit</p></th> */}
                    <th><p className="btn btn-danger" onClick={()=>handleDelete(user._id)}>Delete</p></th>
                    <th><p className="btn btn-primary" onClick={()=>navigate("/user-order/"+user._id)}>Orders</p></th>
                </tr>
             ))}
           
            </tbody>
          </table>
        </div>
        <div className="card-footer py-4">
  <nav aria-label="...">
    <ul className="pagination justify-content-end mb-0">
      <li className={`page-item {page===1&& disable}`} onClick={()=>{
        if(page>1){
          setPage(page-1)
        }
      }} >
        <a className="page-link">
          <i className="fas fa-angle-left" />
          <span className="sr-only">Previous</span>
        </a>
      </li>
      <li className="page-item active">
        <a className="page-link" >
          {page}
        </a>
      </li>
      {
        users.length!==0&&(
          <li className="page-item" onClick={()=>{setPage(page+1)}}>
        <a className="page-link" >
          {page+1}
        </a>
      </li>
        )
      }
      {
        users.length!==0&&(
          <li className="page-item" onClick={()=>{
            if(users.length!==0){
              setPage(page+1)
            }
          }}>
          <a className="page-link" >
            <i className="fas fa-angle-right" />
            <span className="sr-only">Next</span>
          </a>
        </li>
        )
      }
    </ul>
  </nav>
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

export default AllUsers
