import { Route, Routes } from "react-router-dom"
import Login from "./components/Login/Login"
import DashBoard from "./components/Dashboard/DashBoard"
import AddUser from "./components/AddUser/AddUser"
import AllUsers from "./components/AllUsers/AllUsers"
import EditUser from "./components/Edituser/EditUser"
import AllProducts from "./components/AllProducts/AllProducts"
import EditProduct from "./components/EditProduct/EditProduct"
import AddProduct from "./components/AddProduct/AddProduct"
import LoadScriptOnRouteChange from "./config/LoadScriptOnRouteChange"
import AddCategory from "./components/AddCategory/AddCategory"
import UserOrder from "./components/UserOrders/UserOrder"
import AllOrders from "./components/AllOrders/AllOrders"
import  { Toaster } from 'react-hot-toast';


function App() {


  return (
    <>
     <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<DashBoard />} />
      <Route path="/add-user" element={<AddUser />} />
      <Route path="/all-users" element={<AllUsers />} />
      <Route path="/user-order/:id" element={<UserOrder/>} />
      <Route path="/edit-user/:id" element={<EditUser/>} />
    <Route path="/edit-product/:id" element={<EditProduct/>} />
    <Route path="/add-product" element={<AddProduct/>} />
    <Route path="/all-products" element={<AllProducts/>} />
    <Route path="/all-orders" element={<AllOrders/>} />
    <Route path="/category" element={<AddCategory/>} />

     </Routes>
     <LoadScriptOnRouteChange scriptSrc="/src/assets/js/template.js" />
     <Toaster />
    </>
  )
}

export default App
