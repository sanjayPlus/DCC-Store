import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";

function AllOrders() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState("");
  const [page, setPage] = useState(1);
  const [select, setSelect] = useState("pending");
  
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
            .get(`${SERVER_URL}/admin/orders?page=${page}&limit=10`, {
              headers: { "x-access-token": token },
            })
            .then((userResponse) => {
              if (userResponse.status === 200) {
                setProducts(userResponse?.data);
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

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${SERVER_URL}/product/products-with-pagination?page=1&perPage=10&search=${name}`,
  //       { headers: { "x-access-token": localStorage.getItem("token") } }
  //     )
  //     .then((userResponse) => {
  //       if (userResponse.status === 200) {
  //         setProducts(userResponse?.data.products);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err.response.data);
  //     });
  // }, [name]);
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/admin/orders?page=${page}&limit=10`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((userResponse) => {
        if (userResponse.status === 200) {
            setProducts(userResponse?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

const handleSave = (orderId,userId)=>{
  const token = localStorage.getItem("token");
  axios.post(`${SERVER_URL}/admin/update-order-status`,{
    status:select,
    orderId:orderId,
    userId:userId
  },{
    headers: { "x-access-token": token },
  })
  .then((userResponse) => {
    if (userResponse.status === 200) {
      setIsEditing("");
      setSelect("pending");
      axios
      .get(`${SERVER_URL}/admin/orders?page=${page}&limit=10`, {
        headers: { "x-access-token": localStorage.getItem("token") },
      })
      .then((userResponse) => {
        if (userResponse.status === 200) {
            setProducts(userResponse?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
}
  return (
    <>
      <div className="main-wrapper">
        <SideBar />
        <div className="page-wrapper">
          <NavBar name={name} setName={setName} link="all-products" />
          <div className="page-content">
            <div className="row">
              <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                <div className="order-container">
                    <div className="order-cards-container">
                      {products.map((order, index) => (
                        <div className="order-card" key={index}>
                          <div className="order-card-left">
                            <div className="order-card-img">
                              <img src={order.product.image} alt="" />
                            </div>
                            <div className="order-item-details">
                              <h3>{order.product.name}</h3>
                              <p>₹ {order.product.price}</p>
                              <p>Qty: {order.quantity}</p>
                            </div>
                          </div>
                          <div className="order-card-right">
                            <div className="order-card-shipping">
                              <h3>Shipping Address</h3>
                              <p>{order.name}</p>
                              <p>{order.email}</p>
                              {
                                isEditing===order.orderId?<>
                                <select onChange={(e)=>setSelect(e.target.value)}> 
                                  <option value="pending">Pending</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                </select>
                                <button className="btn" onClick={()=>handleSave(order.orderId,order.userId)}>save</button>
                                </>:<>
                                <p>{order.status} <span><i className="fas fa-edit" onClick={()=>setIsEditing(order.orderId)}></i></span></p>
                                </>
                              }
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.phoneNumber}</p>
                              <p>
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.state}{" "}
                                {order.shippingAddress.pinCode}
                              
                              </p>
                            </div>
                            {/* <div className="order-card-button">
                              <button className="btn btn-primary" onClick={() => handleCancel(order._id)}>
                                Cancel
                              </button>
                            </div> */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="card-footer py-4">
                      <nav aria-label="...">
                        <ul className="pagination justify-content-end mb-0">
                          <li
                            className={`page-item {page===1&& disable}`}
                            onClick={() => {
                              if (page > 1) {
                                setPage(page - 1);
                              }
                            }}
                          >
                            <a className="page-link">
                              <i className="fas fa-angle-left" />
                              <span className="sr-only">Previous</span>
                            </a>
                          </li>
                          <li className="page-item active">
                            <a className="page-link">{page}</a>
                          </li>
                          {products.length !== 0 && (
                            <li
                              className="page-item"
                              onClick={() => {
                                setPage(page + 1);
                              }}
                            >
                              <a className="page-link">{page + 1}</a>
                            </li>
                          )}
                          {products.length !== 0 && (
                            <li
                              className="page-item"
                              onClick={() => {
                                if (products.length !== 0) {
                                  setPage(page + 1);
                                }
                              }}
                            >
                              <a className="page-link">
                                <i className="fas fa-angle-right" />
                                <span className="sr-only">Next</span>
                              </a>
                            </li>
                          )}
                        </ul>
                      </nav>
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

export default AllOrders;
