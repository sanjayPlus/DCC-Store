import Navbar from "../components/Navbar";
import "../assets/css/ShippingAddress.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SERVER_URL from "../config/SERVER_URL";
import axios from "axios";
function ShippingAddress() {
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    apartment: "",
    name: "",
    state:"",
  });

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
  useEffect(()=>{
    axios.get(SERVER_URL + "/user/shipping", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
    .then((res) => {
      if (res.status === 200) {
        setShippingAddress(res.data.shippingInfo);
        console.log(res.data);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  },[])
  // Function to handle onChange for input fields
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setShippingAddress((prevAddress) => ({
      ...prevAddress,
      [id]: value,
    }));
  };
  const handleSubmit = () => {
    console.log(shippingAddress);
    // Validate data
    if (!shippingAddress.name || !shippingAddress.address || !shippingAddress.postalCode || !shippingAddress.city || !shippingAddress.state || !shippingAddress.phoneNumber) {
      // If any required field is missing, you can handle the error, for example, by displaying an error message.
      console.log("Error: All fields are required.");
      return;
    }
    // Send data to backend
    axios
      .post(SERVER_URL + "/user/shipping", {
        name: shippingAddress.name,
        address: shippingAddress.address,
        postalCode: shippingAddress.postalCode,
        apartment: shippingAddress.apartment,
        city: shippingAddress.city,
        state: shippingAddress.state,
        phoneNumber: shippingAddress.phoneNumber,
      }, {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          // Redirect to payment page
          navigate("/payment");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
  return (
    <>
      <div className="container">
        <Navbar />
        <div className="shipping-address-container">
          <h1>Shipping</h1>
          <p>Please enter your shipping details.</p>
          <hr />
          <div className="form">
            <label className="field">
              <span className="field__label" htmlFor="name">
                Name
              </span>
              <input
                className="field__input"
                type="text"
                id="name"
                value={shippingAddress.name}
                onChange={handleInputChange}
              />
            </label>
            <label className="field">
              <span className="field__label" htmlFor="address">
                Address
              </span>
              <input
                className="field__input"
                type="text"
                id="address"
                value={shippingAddress.address}
                onChange={handleInputChange}
              />
            </label>
            <label className="field">
              <span className="field__label" htmlFor="postalCode">
              Postal Code
              </span>
              <input
                className="field__input"
                type="number"
                id="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleInputChange}
              />
            </label>
            <label className="field">
              <span className="field__label" htmlFor="apartment">
                Apartment
              </span>
              <input
                className="field__input"
                type="text"
                id="apartment"
                value={shippingAddress.apartment}
                onChange={handleInputChange}
              />
            </label>
            <label className="field">
              <span className="field__label" htmlFor="city">
                City
              </span>
              <input
                className="field__input"
                type="text"
                id="city"
                value={shippingAddress.city}
                onChange={handleInputChange}
              />
            </label>
            <label className="field">
              <span className="field__label" htmlFor="state">
                State
              </span>
              <input
                className="field__input"
                type="text"
                id="state"
                value={shippingAddress.state}
                onChange={handleInputChange}
              />
            </label>
            <label className="field">
              <span className="field__label" htmlFor="phoneNumber">
                Phone Number
              </span>
              <input
                className="field__input"
                type="number"
                id="phoneNumber"
                value={shippingAddress.phoneNumber}
                onChange={handleInputChange}
              />
            </label>
          </div>
          <hr />
          <button className="button" onClick={handleSubmit}>Continue</button>
        </div>
      </div>
    </>
  );
}

export default ShippingAddress;
