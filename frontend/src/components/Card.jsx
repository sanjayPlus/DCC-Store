/* eslint-disable react/prop-types */
import "../assets/css/Home.css"
import { useNavigate } from 'react-router-dom';
function Card({product,handleAddCart}) {
    const navigate = useNavigate()
  return (
    <>
     <div className="card-container">
        <div className="card-image">
            <img src={product?.image} alt="" />
        </div>
        <div className="card-content">
            <h1>{product?.name}</h1>
            <div className="card-container-middle">
                
            <div className="card-rating">
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-solid fa-star"></i>
            <i className="fa-regular fa-star"></i>
            </div>
            <p className="card-price"><i className="fa-solid fa-indian-rupee-sign"></i>{product?.price}</p>
            </div>
        </div>
            <div className="card-buttons">
                <button className="buy-now" onClick={()=>navigate("/product/"+product._id)}>Buy Now</button>
                <button className="add-to-cart" onClick={()=>handleAddCart(product._id)}>Add to cart</button>
            </div>
        </div> 
    </>
  )
}

export default Card
