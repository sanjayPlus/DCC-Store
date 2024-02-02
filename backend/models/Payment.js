// PaymentModel.js

const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  name:String,
  email:String,
  amount:Number,
  merchantId:String,
  merchantTransactionId:String,
  date: { type: Date, default: Date.now },
  body:Object,
  phone:String,
  userId:String,
  products:Array,
  day:String,
});

const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment;
