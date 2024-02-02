const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
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
  
router.get('/user/:id',adminAuth,adminController.getUser);
router.get('/users',adminAuth,adminController.getAllUsers);    
router.get('/orders',adminAuth,adminController.getAllOrders);
router.get('/carousel',adminController.getCarousel);

router.post('/login',adminController.adminLogin);
// router.post('/register',adminController.adminRegister);//comment this route after creating admin
router.post('/update-order-status',adminAuth,adminController.updateOrderStatus);
router.post('/carousel',upload,adminAuth,adminController.addCarousel);


router.get('/orders/:userId',adminAuth,adminController.getOrders);
router.delete('/delete-user/:id',adminAuth,adminController.deleteUser);
router.delete('/carousel/:id',adminAuth,adminController.deleteCarousel);

module.exports = router;
