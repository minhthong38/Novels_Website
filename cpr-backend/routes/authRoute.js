const express = require('express');
const jwt = require('jsonwebtoken');
const {User} = require('../src/schema/cprSchema');
const crypto = require('crypto');
const router = express.Router();

// Login route
router.post('/api/login', async (req, res) => {
  try {
    const account = req.body.account;
    const password = req.body.password;

    //Validate username and password
    const user = await User.findOne({ $or: [{ username: account }, { email: account }] });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or email' });
    } else if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password' });
    } 

    //Encode token
    const Key = crypto.randomBytes(64).toString('hex');

    // If the username and password are valid, generate a JWT token
    const token = jwt.sign({ username: user.username, email: user.email, phoneNumber: user.phoneNumber, address: user.address, role: user.role }, Key, { expiresIn: '1h' });

    // Send the token as a response
    return res.status(200).json({ 
      userData: user,
      token: token,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
});

module.exports = router;