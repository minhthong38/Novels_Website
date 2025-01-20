// routes/userRoute.js
const express = require('express');
const {User} = require('../src/schema/cprSchema');
const userRouter = express.Router();

// Get all users (GET request)
/**
 * @swagger
 * /api/user/all:
 */
userRouter.get('/api/user/all', async (req, res) => {
  try {
    const users = await User.find(); // Find all users
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//Get all users with searchTerm and Paging (GET request)
/**
 * @swagger
 * /api/user:
 */
userRouter.get('/api/user', async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || ""; //Default search term is empty
    const page = parseInt(req.query.page) || 1; //Default page is 1
    const limit = parseInt(req.query.limit) || 5; //Default limit is 5 per page
    const skip = (page - 1) * limit; //Calculate skip

    const regex = new RegExp(searchTerm, 'i'); //Create a case-insensitive regex
    const users = await User.find({ username: { $regex: regex }}).limit(limit).skip(skip); //Find users by name with limit and skip
    if (!users) {
      return res.status(404).json({message: 'User not found'});
    }
    //Count total
    const totalUsers = await User.countDocuments({ username: { $regex: regex }}); //Count total users
    const totalPages = Math.ceil(totalUsers / limit); //Calculate total pages
    return res.status(200).json({ 
      totalUsers: totalUsers,
      size: limit,
      currentPage: page,
      totalPages: totalPages,
      data: users,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get a specific user by name (GET request)
/**
 * @swagger
 * /api/user/{username}:
 */
userRouter.get('/api/user/:username', async (req, res) => {
  try {
    const name = req.params.username.toLowerCase(); // Get name from request URL
    const regex = new RegExp(name, 'i'); // Create a case-insensitive regex
    const user = await User.findOne({ username: { $regex: regex }});  // Find user by name
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    return res.status(200).json({
      data: user,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Create a user (POST request)
/**
 * @swagger
 * /api/user:
 */
userRouter.post('/api/user', async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address
  });
  try {
    await user.save();
    return res.status(201).json({
      data: user,
      status: 201
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Update a user by name (PUT request)
/**
 * @swagger
 * /api/user/{username}:
 */
userRouter.put('/api/user/:username', async (req, res) => {
  try {
    const name = req.params.username.toLowerCase(); // Get name from request URL
    const regex = new RegExp(name, 'i'); // Create a case-insensitive regex
    const user = await User.findOne({ username: { $regex: regex }});  // Find user by name
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    user.username = req.body.username;
    user.email = req.body.email;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.status = req.body.status;
    await user.save();
    return res.status(200).json({
      data: user,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete a user by name (DELETE request)
/**
 * @swagger
 * /api/user/{username}:
 */
userRouter.delete('/api/user/:username', async (req, res) => {
  try {
    const name = req.params.username.toLowerCase(); // Get name from request URL
    const regex = new RegExp(name, 'i'); // Create a case-insensitive regex
    const user = await User.findOne({ username: { $regex: regex }});  // Find user by name
    if (!user) {
      return res.status(404).json({ data: {message: 'User not found'}, status: 404 });
    }
    await User.deleteOne({ username: { $regex: regex }}); //Delete user by name
    return res.status(200).json({ data: { message: `User ${name} deleted` }, status: 200 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = userRouter;
