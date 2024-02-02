const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const adminAuth = require("../middleware/adminAuth");
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: './public/', // specify the upload directory
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Initialize multer
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 } // optional: limit the file size
  }).single('image'); // 'image' is the field name in your form
  
router.get("/all", productController.getAllProducts);
router.get("/all-with-pagination", productController.getAllProductsWithPagination);
router.get("/single/:id", productController.getProductById);
router.get("/product-with-size/:size/:name", productController.getProductByIdWithSize);
router.post("/create",upload,adminAuth,productController.createProduct);//add admin auth
router.post("/update",upload,adminAuth, productController.updateProduct);//add admin auth
router.delete("/delete/:id",adminAuth, productController.deleteProduct);//add admin auth

module.exports = router;
