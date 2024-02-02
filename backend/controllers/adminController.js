const User = require("../models/User");
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Product = require("../models/Products");
const Carousel = require("../models/Carousel");
const jwtSecret = process.env.JWT_ADMIN_SECRET;

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Please provide all required fields." });
        }
        const user = await Admin.findOne({ email });
        if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
        }
        const payload = {
        user: {
            id: user._id,
        },
        };
        jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
        });
    } catch (error) {
        console.error("Error logging in admin:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
//remove this after creating admin
const adminRegister = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Please provide all required fields." });
        }
        const user = await Admin.findOne({ email });
        if (user) {
        return res.status(400).json({ error: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await Admin.create({
        email,
        password: hashedPassword,
        });
        const payload = {
        user: {
            id: newUser._id,
        },
        };
        jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
        });
    } catch (error) {
        console.error("Error registering admin:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const getUser = async (req, res) => {
    const { id } = req.params.id;
    try {
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        console.error("Error getting user:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

const getAllUsers = async (req, res) => {
    try {
      // Extract page and perPage from query parameters (default values are set)
      const page = parseInt(req.query.page, 10) || 1;
      const perPage = parseInt(req.query.perPage, 10) || 10;
  
      // Calculate the skip value to skip the appropriate number of documents
      const skip = (page - 1) * perPage;
  
      // Find users with pagination
      const users = await User.find({})
        .skip(skip)
        .limit(perPage);
  
      res.status(200).json(users);
    } catch (error) {
      console.error("Error getting all users:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

  const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.id });
        
        if (!user) {
            // If the user with the specified ID is not found
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ msg: "User removed" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


const getOrders = async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      const orders = user.orders || []; // Ensure orders is an array, even if it's null/undefined

    const newOrders = await Promise.all(
      orders.map(async (order) => {
        const newProduct = await Product.findById(order.product.productId);
        return {
          product: newProduct,
          quantity: order.quantity,  // Corrected: Access quantity from order
          price: order.product.quantity*newProduct.price,
          status: order.status,
          date: order.date,
          shippingAddress: order.shippingAddress,
        };
      })
    );

    // Flatten the array of arrays into a single array
    const flattenedOrders = newOrders.flat();
  
      res.status(200).json(flattenedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  const getAllOrders = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      // Calculate the number of documents to skip
      const skip = (page - 1) * limit;
  
      const users = await User.find({})
        .skip(skip)
        .limit(limit);
  
      const allOrders = await Promise.all(
        users.map(async (user) => {
          
          const orders = user.orders || [];
          
          const userOrders = await Promise.all(

            orders.map(async (order) => {
             
              const newProduct = await Product.findById(order.product.productId);
  
              // Check if newProduct is not null or undefined
              if (!newProduct) {
                // Handle the case when the product is not found
                return null;
              }
  
              return {
                product: newProduct,
                quantity: order.product.quantity,
                price: order.product.quantity * newProduct.price, // Adjusted calculation
                status: order.status,
                date: order.date,
                shippingAddress: order.shippingAddress,
                name: user.username,
                email: user.email,
                orderId: order._id,
                userId: user._id,
              };
            })
          );
  
          // Filter out null values if any product is not found
          const validUserOrders = userOrders.filter((item) => item !== null);
  
          // Flatten the array of arrays into a single array
          const userFlattenedOrders = validUserOrders.flat();
          return userFlattenedOrders;
        })
      );
  
      // Flatten the array of arrays into a single array
      const flattenedOrders = allOrders.flat();
  
      res.status(200).json(flattenedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  const updateOrderStatus = async (req, res) => {
    try {
      const { orderId, status, userId } = req.body;
  
      const user = await User.findById(userId);
  
      // Find the index of the order in the user's orders array
      const orderIndex = user.orders.findIndex((item) => item._id.toString() === orderId);
  
      if (orderIndex === -1) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      // Update the status of the found order
      user.orders[orderIndex].status = status;
  
      // Mark the 'orders' array as modified
      user.markModified('orders');
  
      // Save the user to persist the changes
      await user.save();
  
      res.status(200).json({ message: "Order status updated successfully" });
    } catch (error) {
      console.error("Error updating order status:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
const addCarousel = async (req, res) => {
    try {
        const { href } = req.body;
        const imageObj = req.file;
        if (!image) {
        return res
            .status(400)
            .json({ error: "Please provide all required fields." });
        }
        const newCarousel = new Carousel({
        image:process.env.DOMAIN+"/public/"+imageObj.filename,
        href:href,
        });
        const savedCarousel = await newCarousel.save();
        res.status(200).json(savedCarousel);
    } catch (error) {
        console.error("Error adding carousel:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const deleteCarousel = async (req, res) => {
    try {
        const carousel = await Carousel.findOneAndDelete({ _id: req.params.id });
        
        if (!carousel) {
            // If the user with the specified ID is not found
            return res.status(404).json({ error: "Carousel not found" });
        }

        res.status(200).json({ msg: "Carousel removed" });
    } catch (error) {
        console.error("Error deleting carousel:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
const getCarousel = async (req, res) => {
    try {
        const carousel = await Carousel.find({});
        res.status(200).json(carousel);
    } catch (error) {
        console.error("Error getting carousel:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}  

module.exports = {
    adminLogin,
    adminRegister,
    getAllUsers,
    getUser,
    deleteUser,
    getAllOrders,
    getOrders,
    updateOrderStatus,
    addCarousel,
    deleteCarousel,
    getCarousel
} 
