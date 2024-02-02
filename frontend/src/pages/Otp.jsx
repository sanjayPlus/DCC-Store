import Navbar from '../components/Navbar';
import "../assets/css/Otp.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SERVER_URL from '../config/SERVER_URL';
import axios from 'axios';

function Otp() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(null);
  const [email, setEmail] = useState("");
  const [isOtpSend, setIsOtpSend] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios.get(SERVER_URL + "/user/details", {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      }).then((res) => {
        if (res.status === 200) {
          const user = res.data;
          if (!user.verified) {
            setEmail(user.email);
          }else{
            navigate("/")
          }
        }
      }).catch((err) => {
        console.log(err);
      });
    } else {
      navigate("/login");
    }
  }, [navigate]);
  
const handleSendOTP = () => {
  axios.post(SERVER_URL + "/user/send-otp", {
    email: email
  }, {
    headers: {
      "x-access-token": localStorage.getItem("token")
    }
  }).then((res)=>{
    if(res.status === 200){
      setIsOtpSend(true);
    }
  }).catch((err) => {
    console.log(err);
  });
}

  const handleVerify = () => {
    if (!otp) {
      console.log("Please fill all the data");
      return;
    }
    axios.post(SERVER_URL + "/user/verify-otp", {
      email: email,
      otp: otp
    }, {
      headers: {
        "x-access-token": localStorage.getItem("token")
      }
    }).then((res) => {
      if (res.status === 200) {
        console.log(res.data);
        navigate("/");
      }
    }).catch((err) => {
      console.log(err);
    });
  };
  

  return (
    <>
      <div className="container">
        <Navbar />
        <div className="otp-container">
          <header>
            <img src="https://cdn-icons-png.flaticon.com/128/95/95454.png" alt="" />
          </header>
          <h4>Enter OTP Code</h4>
            <div className='otp-form'>

            <div className="input-field">
              <input type="number"value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
            <button onClick={handleVerify}>Verify OTP</button>
            {
              isOtpSend ? <p className="p-otp">OTP has been send to your email</p> :  <button onClick={handleSendOTP}>Send OTP</button>
            }
           
 
            </div>
        </div>
      </div>
    </>
  );
}

export default Otp;
