import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import "../UserOrders/UserOrder.css";

function UserOrder() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");

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
            .get(`${SERVER_URL}/admin/orders/${id}`, {
              headers: { "x-access-token": token },
            })
            .then((userResponse) => {
              if (userResponse.status === 200) {
                console.log(userResponse?.data);
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
  }, [navigate, id]);

  function handleCancel(id) {
    console.log("Cancel button clicked for order ID:", id);
    // Add logic to handle canceling the order
  }

  console.log(products);

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
                              <p>{order.shippingAddress.address}</p>
                              <p>{order.shippingAddress.phoneNumber}</p>
                              <p>
                                {order.shippingAddress.city},{" "}
                                {order.shippingAddress.state}{" "}
                                {order.shippingAddress.pinCode}
                              </p>
                            </div>
                            <div className="order-card-button">
                              <button className="btn btn-primary" onClick={() => handleCancel(order._id)}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
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

export default UserOrder;
