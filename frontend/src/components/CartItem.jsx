/* eslint-disable react/prop-types */
import "../assets/css/Carts.css";
import { useNavigate } from 'react-router-dom';

function CartItem({product,handleAddCart,handleReduceCart,handleDeleteCartItem}) {
  const navigate = useNavigate()
  return (
    <>
      <div className="cart-item">
        <div className="cart-item-left">
          <div className="cart-item-img">
            <img
              src={product.product.image}
              alt=""
            />
          </div>
          <div className="cart-item-count">
            <button onClick={()=>handleReduceCart(product.productId)}>-</button>
            <p>{product.quantity}</p>
            <button  onClick={()=>handleAddCart(product.productId)}>+</button>
          </div>
        </div>
        <div className="cart-item-right">
          <h2>{product.product.name}</h2>
   
          <h3 className="cart-price">{product.product.price}</h3>
          <p className="cart-stock-status">{product.stockStatus?"In Stock":"Out Of Stock"}</p>
          <div className="cart-item-buttons">
            
            <button className="delete-btn" onClick={()=>handleDeleteCartItem(product.productId)}>Delete</button>
            <button onClick={()=>navigate("/product/"+product.productId)}>View</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartItem;
