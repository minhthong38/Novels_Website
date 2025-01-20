// routes/orderRoute.js
const express = require('express');
const {Order} = require('../src/schema/cprSchema');
const orderRouter = express.Router();

// Get all orders (GET request)
/**
 * @swagger
 * /api/order/all:
 */
orderRouter.get('/api/order/all', async (req, res) => {
  try {
    const orders = await Order.find(); // Find all orders
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all orders with searchTerm and Paging (GET request)
/**
 * @swagger
 * /api/order:
 */
orderRouter.get('/api/order', async (req, res) => {
  try{
    const searchTerm = req.query.searchTerm || ""; // Default search term is empty
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 5; // Default limit is 5 per page
    const skip = (page - 1) * limit; // Calculate skip

    const regex = new RegExp(searchTerm, 'i'); // Create a case-insensitive regex
    const orders = await Order.find({ username: { $regex: regex } }).limit(limit).skip(skip); // Find orders by username with limit and skip
    if (!orders) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Count total
    const totalOrders = await Order.countDocuments({ username: { $regex: regex } }); // Count total orders
    const totalPages = Math.ceil(totalOrders / limit); // Calculate total pages
    return res.status(200).json({ 
      totalOrders: totalOrders,
      Size: limit,
      currentPage: page,
      totalPages: totalPages,
      data: orders,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get a specific order by id (GET request)
/**
 * @swagger
 * /api/order/{orderId}:
 */
orderRouter.get('/api/order/:orderId', async (req, res) => {
  try {
    const id = req.params.orderId; // Get id from request URL
    const order = await Order.findOne({ orderId: id });  // Find order by id
    if (!order) {
        res.status(404).json({ message: "Order not found!" });
    } 
    return res.status(200).json({
      data: order,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Create a new order (POST request)
/**
 * @swagger
 * /api/order:
 */
orderRouter.post('/api/order', async (req, res) => {
  const order = new Order({
    orderId: req.body.orderId,
    username: req.body.username,
    orderDate: req.body.orderDate,
    items: req.body.items,
    total: req.body.total
  });
  try {
    await order.save();
    return res.status(201).json({
      data: order,
      status: 201
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Update an order by id (PUT request)
/**
 * @swagger
 * /api/order/{orderId}:
 */
orderRouter.put('/api/order/:orderId', async (req, res) => {
  try {
    const id = req.params.orderId; // Get id from request URL
    const order = await Order.findOne({ orderId: id });  // Find order by id
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    order.username = req.body.username;
    order.orderDate = req.body.orderDate;
    order.items = req.body.items;
    order.total = req.body.total;
    order.status = req.body.status;
    await order.save();
    return res.status(200).json({
      data: order,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete an order by id (DELETE request)
/**
 * @swagger
 * /api/order/{orderId}:
 */
orderRouter.delete('/api/order/:orderId', async (req, res) => {
  try {
    const id = req.params.orderId; // Get id from request URL
    const order = await Order.findOne({ orderId: id });  // Find order by id
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    await Order.deleteOne({ orderId: id }); //Delete order by id
    return res.status(200).json({ data: { message: `Order ${id} deleted` }, status: 200 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = orderRouter;