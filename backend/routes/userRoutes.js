const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');

router.get('/protected', userAuth, userController.protected);
router.get('/details', userAuth, userController.details);
router.get('/cart', userAuth, userController.getCart);
router.get('/shipping',userAuth,userController.getShipping)
router.get('/orders',userAuth,userController.getOrders);
router.get('/orders-v2',userAuth,userController.getOrdersV2);

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/cart', userAuth, userController.addCart);
router.post('/reduceCart', userAuth, userController.reduceCart);
router.post('/shipping', userAuth, userController.addShipping);
router.post('/orders', userAuth, userController.addOrder);
router.post('/send-otp', userController.sendOTP);
router.post('/verify-otp', userController.verifyOTP);
router.post('/forgot-password',userController.forgotPassword);
router.post('/auto-login',userController.autoLogin);

//update
router.put('/update', userAuth, userController.update);
router.put('/updateShipping', userAuth, userController.updateShipping);
router.put('/updateOrders', userAuth, userController.updateOrder);
router.put('/edit-password', userAuth, userController.editPassword);

//delete
router.delete('/delete', userAuth, userController.deleteUser);
router.delete('/deleteCart/:productId', userAuth, userController.deleteCart);
router.delete('/deleteShipping/:shippingAddressId ', userAuth, userController.deleteShipping);
router.delete('/deleteOrders/:orderId', userAuth, userController.deleteOrder);

module.exports = router;