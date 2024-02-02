require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const phonepeRoute = require('./routes/phonepeRoute');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const path = require("path")
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/award-store';
// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
// Start the server after successfully connecting to the database

// Middleware
app.use(cors());//add domain name in cors
app.use('/api/payment', paymentRoutes);//make the webhook top of express json because it is raw data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'..','frontend','dist')));
app.use(express.static(path.join(__dirname,'..','store-admin','dist')));
//public static folder
app.use(express.static(path.join(__dirname, "public")));
app.use('/api/user', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/phonepe',phonepeRoute);
app.get("/admin/store-admin", (req, res) => {
  res.sendFile(path.join(__dirname,'..','store-admin', "dist", "index.html"));
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname,'..','frontend', "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});