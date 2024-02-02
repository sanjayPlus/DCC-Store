import Card from "../components/Card";
import Navbar from "../components/Navbar";
import "../assets/css/Home.css"
import { useEffect, useState } from "react";
import axios from 'axios';
import SERVER_URL from "../config/SERVER_URL";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
function Home() {
  const navigate = useNavigate();
  const [products,setProducts]=useState([]);

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
         navigate("/otp");
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
  

  useEffect(()=>{
    axios.get(SERVER_URL+"/products/all").then((res)=>{
      if(res.status===200){
    setProducts(res.data);
      }
    }).catch((err)=>{
      console.log(err);
   
    })  
  },[])
  const handleAddCart = (id)=>{
   axios.post(SERVER_URL+"/user/cart",{
     productId:id
   }, {
    headers:{
     "x-access-token":localStorage.getItem("token")
    }
  }).then((res)=>{
    if(res.status===200){
    toast.success("Item added to cart");
    }
  }).catch((err)=>{
    console.log(err);
  })
  }
  return (
    <>
      <div className="container home">
        <Navbar active="home"/>
        <div className="cards">
      {    products.map((product)=>{
            return <Card key={product._id} product={product} handleAddCart={handleAddCart}/>
          })}

        </div>
      </div>
    </>
  );
}

export default Home;
