import "../assets/css/Carts.css";
import CartItem from "../components/CartItem";
import Navbar from "../components/Navbar";
import axios from 'axios';
import SERVER_URL from "../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
function Carts() {
  const navigate = useNavigate();
  const [products,setProducts]=useState([]);
  const [stateChange,setStateChange]=useState(false);
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
        navigate("/login")
      })
    }else{
      navigate("/login")
    }
  }, [navigate])
  useEffect(()=>{
    axios.get(SERVER_URL+"/user/cart",{
      headers:{
       "x-access-token":localStorage.getItem("token")
      }
    
    }).then((res)=>{
      if(res.status===200){
        if(res.data.length===0){
          toast.error("Your cart is empty");
          navigate("/");
        }
    setProducts(res.data);
      }
    }).catch((err)=>{
      console.log(err);
   
    })  
  },[navigate, stateChange])
  const handleAddCart = (id)=>{
   axios.post(SERVER_URL+"/user/cart",{
     productId:id
   }, {
    headers:{
     "x-access-token":localStorage.getItem("token")
    }
  }).then((res)=>{
    if(res.status===200){
      console.log(res.data);
      setStateChange(!stateChange);
    }
  }).catch((err)=>{
    console.log(err);
  })
  }
  const handleReduceCart = (id)=>{
   axios.post(SERVER_URL+"/user/reduceCart",{
     productId:id
   }, {
    headers:{
     "x-access-token":localStorage.getItem("token")
    }
  }).then((res)=>{
    if(res.status===200){
      console.log(res.data);
      setStateChange(!stateChange);
    }
  }).catch((err)=>{
    console.log(err);
  })
  }
  const handleDeleteCartItem = (id)=>{
   axios.delete(SERVER_URL+"/user/deleteCart/"+id, { 
    headers:{
     "x-access-token":localStorage.getItem("token")
    }
  }).then((res)=>{
    if(res.status===200){
      console.log(res.data);
      setStateChange(!stateChange);
    }
  }).catch((err)=>{
    console.log(err);
  })
  }
  const totalAmount = products.reduce((acc,product)=>{
    return acc+product.product.price*product.quantity;
  },0)
  return (
    <>
      <div className="container">
        <Navbar active={"cart"}/>
        <div className="cart-container">
          
          <div className="cart-top-container">
            <p>
              Total Amount <span>{totalAmount}</span>
            </p>
            <button onClick={()=>navigate("/shipping-address")}>Proceed to Pay</button>
          </div>
          <div className="cart-card-container">
        {
          products.map((product)=>(
            <CartItem key={product._id} product={product} handleAddCart={handleAddCart} handleReduceCart={handleReduceCart} handleDeleteCartItem={handleDeleteCartItem}/>
          ))
        }
          </div>
        </div>
      </div>
    </>
  );
}

export default Carts;
