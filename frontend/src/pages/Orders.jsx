import Navbar from "../components/Navbar"
import "../assets/css/Orders.css"
import OrderItem from "../components/OrderItem"
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import SERVER_URL from "../config/SERVER_URL";
import axios from 'axios'
import toast from 'react-hot-toast';
function Orders() {
  const navigate = useNavigate();
  const [orders,setOrders]=useState([]);

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

  useEffect(()=>{
    axios.get(SERVER_URL+"/user/orders",{
      headers:{
        "x-access-token":localStorage.getItem("token")
      }
    }).then((res)=>{
      if(res.status===200){
        if(res.data.length===0){
          toast.error("You have not placed any orders yet");
          navigate("/");
        }
    setOrders(res.data);
console.log(res.data);
      }
    }).catch((err)=>{
      console.log(err);
   
    })  
  },[])
  console.log(orders);
  return (
    <>
      <div className="container">
        <Navbar active={"orders"}/>
        <div className="order-container">
            <div className="order-cards-container">
              {
                orders.map((order,index)=>(
                  
                  <OrderItem key={index} order={order}/>
                ))
              }
            </div>
        </div>
      </div>
    </>
  )
}

export default Orders
