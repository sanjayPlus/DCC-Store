// userModel.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  cart:[
    {
      productId:String,
      quantity:Number,
    }
  ],
  orders:Array,
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      phoneNumber: String,
      apartment: String,
      name: String,
      state: String,
    },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verified:{
    type:Boolean,
    default:false,
  },
  otp:{
    type:String,
    default:""
  
  },
  payments:[{
    paymentId:String,
    merchantId:String,
    merchantTransactionId:String,
    amount:Number,
    date: { type: Date, default: Date.now },
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
