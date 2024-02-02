import Navbar from "../components/Navbar";
import "../assets/css/SingleProduct.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SERVER_URL from "../config/SERVER_URL";
import axios from "axios";
function SingleProduct() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const { id } = useParams();
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
      .get(SERVER_URL + "/products/single/" + id)
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
  const handleAddCart = () => {
    axios
      .post(
        SERVER_URL + "/user/cart",
        {
          productId: id,
        },
        {
          headers: {
            "x-access-token": localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          navigate("/cart");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSize = (size, name) => {
    const newName = name.split("(")[0].trim();

    axios
      .get(`${SERVER_URL}/products/product-with-size/${size}/${newName}`)
      .then((res) => {
        if (
          res.status === 200 &&
          res.data &&
          res.data.length > 0 &&
          res.data[0]._id
        ) {
          window.location.href = `/product/${res.data[0]._id}`;
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        // Handle error scenarios if needed
      });
  };

  return (
    <>
      <div className="container">
        <Navbar />
        <div className="single-product-container">
          <div className="single-product-left">
            <img src={products.image} alt="" />
          </div>
          <div className="single-product-right">
            <h2>{products.name}</h2>
            <p>{products.description}</p>
            <h1>{products.price}</h1>
            {products.name && products.name.includes("Shirt") && (
              <>
                <div className="size-container">
                  <button onClick={() => handleSize("M", products.name)}>
                    M
                  </button>
                  <button onClick={() => handleSize("S", products.name)}>
                    S
                  </button>
                  <button onClick={() => handleSize("L", products.name)}>
                    L
                  </button>
                </div>
              </>
            )}

            <h3>{products.stocks > 0 ? "In Stock" : "Out Of Stock"}</h3>
            <div className="single-product-buttons">
              <button onClick={handleAddCart}>Add To Cart</button>
              <button onClick={handleAddCart}>Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleProduct;
