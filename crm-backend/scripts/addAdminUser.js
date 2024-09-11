const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Function to add an admin user
const addAdminUser = async () => {
  const email = 'Rp@123'; // Replace with desired admin email
  const password = 'Rp@12345'; // Replace with desired admin password

  try {
    // Check if the admin user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('Admin user already exists');
      return;
    }

    // Create new admin user
    const newUser = new User({
      name: 'Admin User',
      email,
      password,
      role: 'admin',
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the user to the database
    await newUser.save();
    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the function to add the admin user
addAdminUser();
