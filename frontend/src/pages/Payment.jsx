import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SERVER_URL from "../config/SERVER_URL";
import "../assets/css/Payment.css";
import Navbar from "../components/Navbar";
function Payment() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  // const [showModal, setShowModal] = useState(false);
  // const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .get(SERVER_URL + "/user/protected", {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        })
        .then((res) => {
          if (res.status !== 200) {
            navigate("/login");
          }
        })
        .catch((err) => {
          console.log(err);
          localStorage.removeItem("token");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate]);
  useEffect(() => {
    axios
      .get(SERVER_URL + "/user/cart", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setProducts(res.data);
          console.log(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const totalAmount = products.reduce((acc,product)=>{
    return acc+product.product.price*product.quantity;
  },0)
  const handleSubmit = () => {
    // if (!phoneNumber) {
    //   // Show modal to get phone number if it's empty
    //   setShowModal(true);
    //   return; // Prevent further execution
    // }
    axios.get(SERVER_URL + "/phonepe/checkout",{
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((res)=>{
      if(res.status === 200){
        window.location.href = res.data.url
      }
    }).catch((err)=>{
      console.log(err);
    })
  };
  // const handleModalSubmit = () => {
  //   // When the modal's submit button is clicked
  //   setShowModal(false); // Close modal
  //   handleSubmit(); // Proceed with payment logic
  // };

  return (
    <>
      <div className="container">
        <Navbar />
        <div className="payment-container">
          <div className="order-details">
            <div className="order-head">
              <h3>Order Details</h3>
            </div>
            <div className="order-body">
              {products?.map((item)=>(
                <>

              <div className="order-body-top">
                <div className="order-body-top-img">
                  <img
                    src={item.product.image}
                    alt="img"
                  />
                </div>
                <div className="order-body-top-content">
                <p>{item.product.name}</p>
                 
                  <p>{item.quantity}</p>
                </div>
                <div className="order-body-top-price">
                 
                  <p>{item.product.price}</p>
                 
                </div>
              </div>
                </>
              ))}

              <div className="order-footer">
                <div className="order-footer-left">
                  <p>Total</p>
                </div>
                <div className="order-footer-right">
                  <p>{totalAmount}</p>
                </div>
              </div>
              <div className="order-button">
                <button
                  className="button-27"
                  role="button"
                  onClick={handleSubmit}
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      {/* {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Enter Phone Number</h2>
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button onClick={handleModalSubmit}>Submit</button>
          </div>
        </div>
      )} */}
      </div>
    </>
  );
}

export default Payment;
