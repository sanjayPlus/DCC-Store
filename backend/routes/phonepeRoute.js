const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const userAuth = require("../middleware/userAuth");
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../controllers/emailController");
const Payment = require("../models/Payment");
const Product = require("../models/Products");
const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;
function calculateTotalPrice(items) {
  let totalPrice = 0;
  for (const item of items) {
    totalPrice += item.price * item.quantity;
  }
  return totalPrice;
}

router.get("/checkout", userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.save();
    const merchantTransactionId = crypto.randomBytes(16).toString("hex");
    const items = user.cart;
    const itemIds = items.map((item) => item.productId);

    const populatedItems = await Product.find({ _id: { $in: itemIds } });

    const itemsWithQuantity = items.map((item) => {
      const correspondingProduct = populatedItems.find(
        (product) => String(product._id) === item.productId
      );

      if (!correspondingProduct) {
        return null; // Handle the case when the product is not found
      }

      return {
        ...correspondingProduct.toObject(),
        quantity: item.quantity,
      };
    });
    const totalPrice = calculateTotalPrice(itemsWithQuantity);
    const data = {
      merchantId: process.env.MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: "MUID" + Date.now(),
      name: user.shippingAddress.name,
      amount: totalPrice * 100,
      redirectUrl:
        process.env.PHONEPAY_REDIRECT_URL +
        "/api/phonepe/status/" +
        merchantTransactionId +
        "/" +
        process.env.MERCHANT_ID +
        "/" +
        totalPrice +
        "/" +
        req.user.userId,
      redirectMode: "GET",
      mobileNumber: user.shippingAddress.phoneNumber, // corrected property name 'phone' to 'phoneNumber'
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };
    const payload = JSON.stringify(data);
    const payloadMain = Buffer.from(payload).toString("base64");
    const keyIndex = 1;
    const string = payloadMain + "/pg/v1/pay" + process.env.PHONEPAY_API_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const prod_URL = process.env.PHONEPAY_API_URL + "/pg/v1/pay";
    const options = {
      method: "POST",
      url: prod_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payloadMain,
      },
    };
    const response = await axios(options);
    return res
      .status(200)
      .json({ url: response.data.data.instrumentResponse.redirectInfo.url });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});

router.post(
  "/status/:transactionId/:merchantId/:amount/:userId",
  async (req, res) => {
    const merchantTransactionId = req.params.transactionId;
    const merchantId = req.params.merchantId;
    const amount = req.params.amount;
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const keyIndex = 1;
    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
      process.env.PHONEPAY_API_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const options = {
      method: "GET",
      url: `${process.env.PHONEPAY_API_URL}/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": `${merchantId}`,
      },
    };

    // CHECK PAYMENT TATUS
    axios
      .request(options)
      .then(async (response) => {
        if (response.data.success === true) {
          if (response.data.data.state === "SUCCESS") {
            const { name, email, phoneNumber } = user;
            const paymentAmount = response.data.data.amount / 100;
            const payment = await Payment.findOne({ merchantTransactionId });
            if (payment) {
              const url = `${process.env.PHONEPAY_REDIRECT_URL}/api/payment/success`;
              return res.redirect(url);
            }
            const items = user.cart;
            const itemIds = items.map((item) => item.productId);

            const populatedItems = await Product.find({
              _id: { $in: itemIds },
            });

            const itemsWithQuantity = items.map((item) => {
              const correspondingProduct = populatedItems.find(
                (product) => String(product._id) === item.productId
              );

              if (!correspondingProduct) {
                return null; // Handle the case when the product is not found
              }

              return {
                ...correspondingProduct.toObject(),
                quantity: item.quantity,
              };
            });
            const payments = await Payment.create({
              userId,
              merchantId,
              merchantTransactionId,
              amount: paymentAmount,
              day: new Date().toLocaleDateString(),
              body: response.data.data,
              name,
              email,
              phone: phoneNumber,
              products: itemsWithQuantity,
              date: new Date(),
            });
            itemsWithQuantity.map((item) => {
              Product.findById(item._id).then((product) => {
                product.stocks = product.stocks - item.quantity;
                product.save();
              });
            });
            user.cart = [];
            const orders = items.map((item) => ({
              product: item,
              shippingAddress: user.shippingAddress,
              date: Date.now(),
              status: "ordered",
              _id: new mongoose.Types.ObjectId(),
            }));
            user.orders = user.orders.concat(orders);

            user.payments.push({
              paymentId: payments._id,
              merchantId,
              merchantTransactionId,
              amount: paymentAmount,
              date: new Date().toLocaleDateString(),
            });
            await user.save();

            const htmlContent = sendMail(
              email,
              "Order Payment Successful",
              "Order Payment Successful",
              `<div>
              <h1 style="text-align:center">Payment Successful</h1>
              <br>
              <p>Dear ${user.shippingAddress.name},</p>
              <br>
              <p>Your Order Have been Placed</p>
              <p>Your Payment Details</p>
              <br>
              <p>Your transaction Id is ${merchantTransactionId}</p>
              <p>Amount ${amount}</p>
              <p>Email ${email}</p>
              <p>Phone ${phoneNumber}</p>
              
                  <br>

              <p>For App Support Contact app@intucthrisssur.com </p>
              <br>
              <p>Sincerely,</p>
              <p>SUNDARAN KUNNATHULLY</p>
              <p>President,INTUC THRISSUR</p>
              </div>`
            );

            const url = `${process.env.PHONEPAY_REDIRECT_URL}/api/payment/success`;
            return res.redirect(url);
          } else {
            const url = `${process.env.PHONEPAY_REDIRECT_URL}/api/payment/failure`;
            return res.redirect(url);
          }
        } else {
          const url = `${process.env.PHONEPAY_REDIRECT_URL}/api/payment/failure`;
          return res.redirect(url);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
);

router.get("/success", (req, res) => {
  res.redirect("https://store.intucthrissur.com/orders");
});
router.get("/failure", (req, res) => {
  res.send("https://store.intucthrissur.com");
});
router.get("/payment-details/:page/:limit", adminAuth, async (req, res) => {
  const page = parseInt(req.params.page);
  const limit = parseInt(req.params.limit);

  try {
    const totalCount = await Payment.countDocuments();
    const totalPages = Math.ceil(totalCount / limit);
    const skip = (page - 1) * limit;

    const payments = await Payment.find().skip(skip).limit(limit).exec();

    res.status(200).json({
      data: payments,
      page,
      totalPages,
      totalPayments: totalCount,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
