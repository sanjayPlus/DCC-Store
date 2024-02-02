import { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import SideBar from "../SideBar/SideBar";
import axios from "axios";
import SERVER_URL from "../../config/SERVER_URL";
import { useNavigate, useParams } from "react-router-dom";
import UPLOADS_URL from "../../config/UPLOADS_URL";

function EditProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    gender: "",
    slug: "",
    description: "",
    images: [],
  });
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    axios
      .get(`${SERVER_URL}/admin/protected`, {
        headers: { "x-access-token": token },
      })
      .then((res) => {
        if (res.status === 200) {
          axios
            .get(`${SERVER_URL}/product/single/${id}`, {
              headers: { "x-access-token": token },
            })
            .then((productResponse) => {
              if (productResponse.status === 200) {
                const convertImageToBase64 = (imageUrl) => {
                  return fetch(imageUrl)
                    .then((response) => response.blob())
                    .then((blob) => {
                      return new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onloadend = () => {
                          const base64data = reader.result;
                          resolve(base64data);
                        };
                        reader.onerror = reject;
                      });
                    });
                };

                const imagesArray = Object.values(productResponse.data.images); // Convert object values to an array
                const imagePromises = imagesArray.map((imageUrl) =>
                  convertImageToBase64(`${UPLOADS_URL}/${imageUrl}`)
                );

                Promise.all(imagePromises)
                  .then((base64Images) => {
                    const updatedProduct = {
                      name: productResponse.data.name || "",
                      gender: productResponse.data.gender || "",
                      slug: productResponse.data.slug || "",
                      category: productResponse.data.categoryId || "",
                      description: productResponse.data.description || "",
                      images: base64Images,
                    };
                    setProduct(updatedProduct);
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });

                axios
                  .get(`${SERVER_URL}/product/get-all-categories`)
                  .then((catRes) => {
                    setCategories(catRes.data);
                  });
              }
            })
            .catch((err) => {
              console.log(err.response.data);
            });
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };
  const handleRemoveImage = (index) => {
    const updatedImages = product.images.filter((_, i) => i !== index);
    setProduct((prevProduct) => ({
      ...prevProduct,
      images: updatedImages,
    }));
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageArray = product.images ? [...product.images] : []; // Check if product.images is defined

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.readyState === FileReader.DONE) {
          // Check if the image already exists in the image array
          if (!imageArray.includes(reader.result)) {
            imageArray.push(reader.result);
            setProduct((prevProduct) => ({
              ...prevProduct,
              images: imageArray,
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("gender", product.gender);
    formData.append("slug", product.slug);
    formData.append("description", product.description);
    formData.append("categoryId", product.category);
    formData.append("productId", id);

    for (let i = 0; i < product.images.length; i++) {
      fetch(product.images[i])
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `image_${i}.png`, {
            type: "image/png",
          });
          formData.append("images", file);

          // Check if all images have been appended before making the POST request
          if (i === product.images.length - 1) {
            axios
              .post(`${SERVER_URL}/admin/update-product`, formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                  "x-access-token": localStorage.getItem("token"),
                },
              })
              .then((res) => {
                if (res.status === 200) {
                  setProduct({
                    name: "",
                    gender: "",
                    slug: "",
                    categoryId: "",
                    description: "",
                    images: [],
                  });
                  console.log("Product updated successfully");
                }
              })
              .catch((err) => {
                console.log(err.response.data);
              });
          }
        })
        .catch((error) => {
          console.error("Error fetching the image data:", error);
        });
    }
  };

  return (
    <>
      <div className="main-wrapper">
        <SideBar />
        <div className="page-wrapper">
          <NavBar />
          <div className="page-content">
            <div className="row">
              <div className="col-md-6 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Edit Product</h6>
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="productName" className="form-label">
                          Product Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          autoComplete="off"
                          placeholder="name"
                          name="name"
                          value={product.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Slug
                        </label>
                        <input
                          type="slug"
                          className="form-control"
                          id="slug"
                          placeholder="slug"
                          name="slug"
                          value={product.slug}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="category" className="form-label">
                          Category
                        </label>
                        <select
                          className="form-select"
                          id="category"
                          name="category"
                          value={product.category}
                          onChange={handleChange}
                        >
                          {categories &&
                            categories.map((category, index) => (
                              <option key={index} value={category._id}>
                                {category.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">
                          Description
                        </label>
                        <textarea
                          className="form-control"
                          id="description"
                          rows="4"
                          placeholder="Description"
                          name="description"
                          value={product.description}
                          onChange={handleChange}
                        ></textarea>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Product Images</label>
                        <label className="custum-file-upload" htmlFor="file">
                          <div className="icon">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill=""
                              viewBox="0 0 24 24"
                            >
                              <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                              <g
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                id="SVGRepo_tracerCarrier"
                              />
                              <g id="SVGRepo_iconCarrier">
                                <path
                                  fill=""
                                  d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                                  clipRule="evenodd"
                                  fillRule="evenodd"
                                />
                              </g>
                            </svg>
                          </div>
                          <div className="text">
                            <span>Click to upload image</span>
                          </div>
                        </label>
                        <input
                          type="file"
                          id="file"
                          multiple
                          onChange={handleImageChange}
                        />
                        {Array.isArray(product.images) &&
                          product.images.map((image, index) => (
                            <div
                              key={index}
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <img
                                src={image}
                                alt={`product-${index}`}
                                style={{ width: "100px", height: "100px" }}
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                style={{ marginLeft: "10px" }}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary me-2 m-2"
                      >
                        Submit
                      </button>

                      <button className="btn btn-secondary" onClick={()=>navigate("/all-variations/"+id)}>
                        Edit Variations
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProduct;
