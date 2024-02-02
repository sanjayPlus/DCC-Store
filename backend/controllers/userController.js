const User = require("../models/User");
const Product = require("../models/Products");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecret = process.env.JWT_SECRET;
const {sendMail} = require("./emailController")
const register = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { username, email, password } = req.body;

    // Step 2: Validate User Input
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Step 3: Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 4: Create User
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();

    // Step 5: Generate JWT
    const token = jwt.sign({ userId: savedUser._id }, jwtSecret, {
      expiresIn: "1h",
    });

    // Step 6: Send Response
    res.json({
      token,
      user: { id: savedUser._id, username: savedUser.username },
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { email, password } = req.body;

    // Step 2: Validate User Input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password." });
    }

    // Step 3: Find User by Email
    const user = await User.findOne({ email });

    // Step 4: Verify User and Password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Step 5: Generate JWT
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    // Step 6: Send Response
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const protected = async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({ message: "You are authorized" });
    } else {
      res.status(401).json({ message: "You are not authorized" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const details = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    // The '-password' option excludes the 'password' field from the result
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findById(req.user.userId);
    //if exist then update hash the password and update
    if (username) {
      user.username = username;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete(req.user.userId);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addCart = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check if the user is found
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate data
    if (!productId) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Check if the product already exists in the cart
    const existingProduct = user.cart.find(
      (item) => item.productId === productId
    );

    // Check if the product exists in the database
    const product = await Product.findById(productId);

    if (existingProduct) {
      // Check available stocks before incrementing quantity
      if (product.stocks > existingProduct.quantity) {
        existingProduct.quantity++;
        await user.save();
        res.status(200).json(user);
      } else {
        // If the product is out of stock, send an error response
        res.status(400).json({ error: "Product is out of stock" });
      }
    } else {
      // If the product doesn't exist, add a new product to the cart
      if (product && product.stocks > 0) {
        user.cart.push({
          productId,
          quantity: 1,
        });
        await user.save();
        res.status(200).json(user.cart);
      } else {
        // If the product is out of stock or doesn't exist, send an error response
        res.status(400).json({ error: "Product is out of stock" });
      }
    }
  } catch (error) {
    console.error("Error during adding to cart:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    // Check if the user is found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const products = [];
    for (const item of user.cart) {
      const product = await Product.findById(item.productId);

      // Check if the product is found
      if (!product) {
        return res.status(404).json({ error: `Product not found for ID: ${item.productId}` });
      }

      let stockStatus = true;
      if (product.stocks <= item.quantity) {
        stockStatus = false;
      }

      products.push({
        product: product,
        productId: product._id,
        quantity: item.quantity,
        stockStatus: stockStatus,
      });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error("Error during getting cart:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const reduceCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.userId);

    // Validate data
    if (!productId) {
      return res
        .status(400)
        .json({ error: "Please provide all required fields." });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = user.cart.findIndex(
      (item) => item.productId === productId
    );

    if (existingProductIndex !== -1) {
      // If the product exists in the cart
      if (user.cart[existingProductIndex].quantity > 1) {
        // If the quantity is greater than 0, reduce it
        user.cart[existingProductIndex].quantity--;
      } else {
        // If the quantity is already 0, remove the product from the cart
        user.cart.splice(existingProductIndex, 1);
      }
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during reducing cart:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.userId);

    // Filter out the item to be deleted from the user's cart
    const updatedCart = user.cart.filter((item) => item.productId !== productId);

    // Update the user's cart with the filtered cart
    user.cart = updatedCart;

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({
        message: "Item removed from the cart successfully",
        updatedCart,
      });
  } catch (error) {
    console.error("Error during cart item deletion:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addShipping = async (req, res) => {
  try {
    const { address, city, postalCode, phoneNumber, apartment, name, state } = req.body;
    const user = await User.findById(req.user.userId);

    // validate data
    if (!address || !city || !postalCode || !phoneNumber || !apartment || !name || !state) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    // Update the existing user's shippingAddress
    user.shippingAddress = {
      address,
      city,
      postalCode,
      phoneNumber,
      apartment,
      name,
      state,
    };

    // Save the updated user object
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error("Error during adding shipping address:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getShipping = async (req, res) => {
  try {
    // Assuming you have the user ID available in req.user.userId
    const userId = req.user.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the shipping information from the user's profile
    const shippingInfo = user.shippingAddress;

    // Check if shipping information exists
    if (!shippingInfo) {
      return res.status(404).json({ error: "Shipping information not found" });
    }

    res.status(200).json({ shippingInfo });
  } catch (error) {
    console.error("Error getting shipping information:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateShipping = async (req, res) => {
  try {
    const { address, city, postalCode, phoneNumber, apartment, name,state } = req.body;
    const userId = req.user.userId;
    console.log(address, city, postalCode, phoneNumber, apartment, name,state);
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if there's a shipping address for the user
    if (user.shippingAddress) {
      // Update the fields if they exist in the request body
      if (address) user.shippingAddress.address = address || "";
      if (city) user.shippingAddress.city = city || "";
      if (postalCode) user.shippingAddress.postalCode = postalCode || "";
      if (phoneNumber) user.shippingAddress.phoneNumber = phoneNumber || "" ;
      if (apartment) user.shippingAddress.apartment = apartment || "" ;
      if (name) user.shippingAddress.name = name || "";
      if (state) user.shippingAddress.state = state || "";
    } else {
      // If there's no shipping address, create a new one
      user.shippingAddress = {
        address,
        city,
        postalCode,
        phoneNumber,
        apartment,
        name,
        state
      };
    }

    // Save the updated user object
    await user.save();

    return res.status(200).json({
      message: "Shipping address updated successfully",
      updatedShippingAddress: user.shippingAddress,
    });
  } catch (error) {
    console.error("Error updating shipping address:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete shipping information
const deleteShipping = async (req, res) => {
  try {
    const { shippingAddressId } = req.params;
    const userId = req.user.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter out the shipping address to be deleted from the user's shippingAddress array
    const updatedShippingAddresses = user.shippingAddress.filter(
      (address) => address._id.toString() !== shippingAddressId
    );

    // Update the user's shippingAddress with the filtered shipping addresses
    user.shippingAddress = updatedShippingAddresses;

    // Save the updated user object
    await user.save();

    res.status(200).json({
      message: "Shipping address removed successfully",
      updatedShippingAddresses,
    });
  } catch (error) {
    console.error("Error during shipping address deletion:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create order
const addOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const products = req.body.products;

    const totalAmount = products.reduce((acc,product)=>{
      return acc+product.product.price*product.quantity;
    },0)
    user.orders.push({ products:user.cart, price:TotalPrice, shippingAddress:user.shippingAddress });
    user.cart=[]
    // Save the updated user object
    await user.save();

    res.status(200).json({ message: "Order added successfully", user });
  } catch (error) {
    console.error("Error adding order:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const getOrdersV2 = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const orders = user.orders || []; // Ensure orders is an array, even if it's null/undefined

   const newOrders = await Promise.all(
  orders.map(async (order) => {
    const products = await Promise.all(
      order.products.map(async (item) => {
        const product = await Product.findById(item.productId);
        return {
          product: product,
          quantity: item.quantity,  // Corrected: Access quantity from item
          price: order.price,
          status: order.status,
          date: order.date,
          shippingAddress: order.shippingAddress, 
        };
      })
    );

    return products; // Return the products directly, not wrapped in an object
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

const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the user by ID
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
          quantity: order.product.quantity,  // Corrected: Access quantity from order
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


// Update order (Assuming you have a unique order ID)
const updateOrder = async (req, res) => {
  try {
    const { orderId, updatedQuantity } = req.body;
    const userId = req.user.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the order by ID
    const order = user.orders.find((o) => o._id.toString() === orderId);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the order quantity
    order.quantity = updatedQuantity;

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ message: "Order updated successfully", updatedOrder: order });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete order (Assuming you have a unique order ID)
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Filter out the order to be deleted from the user's orders array
    const updatedOrders = user.orders.filter(
      (o) => o._id.toString() !== orderId
    );

    // Update the user's orders with the filtered orders
    user.orders = updatedOrders;

    // Save the updated user object
    await user.save();

    res
      .status(200)
      .json({ message: "Order deleted successfully", updatedOrders });
  } catch (error) {
    console.error("Error during order deletion:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const editPassword = async(req,res)=>{
try {
  const {password} = req.body;
  const user = await User.findById(req.user.userId);
  //if exist then update hash the password and update
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
  }
  await user.save();
  res.status(200).json({
    message:"Password updated successfully"
  });

} catch (error) {
  res.status(500).json({ error: "Internal Server Error" });
}
}
const sendOTP = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { email } = req.body;

    // Step 2: Validate User Input
    if (!email) {
      return res.status(400).json({ error: 'Please provide email.' });
    }

    // Step 3: Find User by Email
    const user = await User.findOne({ email: email });

    // Step 4: Check if the user is already verified
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'User already verified' });
    }

    // Step 5: Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Step 6: Send OTP to email
    sendMail(
      email,
      'OTP Verification',
      `Your OTP is: ${otp}`,
      `<h1>Your OTP is: ${otp}</h1>`
    )
      .then(async (result) => {
        console.log(result);

        // Step 7: Save OTP to the database
        user.otp = otp;
        await user.save();

        // Step 8: Send Response
        res.status(200).json({ message: 'OTP sent successfully' });
      })
      .catch((error) => {
        console.error('Error sending OTP:', error.message);
        res.status(400).json({ message: 'OTP failed' });
      });
  } catch (error) {
    console.error('Error during OTP generation:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const verifyOTP = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { email, otp } = req.body;

    // Step 2: Validate User Input
    if (!email || !otp) {
      return res
        .status(400)
        .json({ error: 'Please provide both email and OTP.' });
    }

    // Step 3: Find User by Email
    const user = await User.findOne({ email: email });

    // Step 4: Verify User and OTP
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (otp !== user.otp) {
      return res.status(401).json({ error: 'Invalid OTP.' });
    }
   
    // Step 5: Update verified field
    user.verified = true;
    await user.save();

    // Step 6: Send Response
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'OTP verified successfully', token: token });
  } catch (error) {
    console.error('Error during OTP verification:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const forgotPassword = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { email } = req.body;

    // Step 2: Validate User Input
    if (!email) {
      return res.status(400).json({ error: 'Please provide email.' });
    }

    // Step 3: Find User by Email
    const user = await User.findOne({ email: email });

    // Step 4: Check if the user is already verified
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Step 5: Generate jwt token and sent with button
        // Step 5: Generate JWT
        const token = jwt.sign({ userId: user._id }, jwtSecret, {
          expiresIn: "1h",
        });
    
    // Step 6: Send OTP to email
    sendMail(
      email,
      'Reset Your Password',
      `Reset Your Password`,
      `<a href='${process.env.DOMAIN}/forget-password/${token}'>Reset Password</a>`
    )
      .then(async (result) => {
        console.log(result);
        // Step 8: Send Response
        res.status(200).json({ message: 'OTP sent successfully' });
      })
      .catch((error) => {
        console.error('Error sending OTP:', error.message);
        res.status(400).json({ message: 'OTP failed' });
      });
  } catch (error) {
    console.error('Error during OTP generation:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const autoLogin = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    // Check if user exists in the database
    const user = await User.findOne({ email: email });
    
    if (user) {
      // Compare the provided password with the hashed password from the database
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (isMatch) {
        return res.status(401).json({ url: process.env.DOMAIN+"/login", token: "" });
      }
      
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      
      return res.status(200).json({ url: `${process.env.DOMAIN}/token/${token}`, token: token });
    } else {
      // Create a new user if the user does not exist
      const newUser = new User({ username: name, email, password: password ,verified:true});
      const savedUser = await newUser.save();
      
      const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      
      return res.status(200).json({ url: `${process.env.DOMAIN}/token/${token}`, token: token });
    }
  } catch (error) {
    console.error('Error during auto-login:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  register,
  login,
  protected,
  details,
  update,
  deleteUser,
  addCart,
  getCart,
  reduceCart,
  deleteCart,
  addShipping,
  getShipping,
  updateShipping,
  deleteShipping,
  addOrder,
  getOrders,
  getOrdersV2,
  updateOrder,
  deleteOrder,
  editPassword,
  sendOTP,
  verifyOTP,
  forgotPassword,
  autoLogin
};
