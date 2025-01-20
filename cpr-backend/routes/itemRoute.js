// routes/itemRoute.js
const express = require('express');
const {Item} = require('../src/schema/cprSchema');
const itemRouter = express.Router();

// Get all items (GET request)
/**
 * @swagger
 * /api/item/all:
 */
itemRouter.get('/api/item/all', async (req, res) => {
  try {
    const items = await Item.find(); // find all items
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get all items with searchTerm and Paging (GET request)
/**
 * @swagger
 * /api/item:
 */
itemRouter.get('/api/item', async (req, res) => {
  try{
    const searchTerm = req.query.searchTerm || ""; // Default search term is empty
    const page = parseInt(req.query.page) || 1; // Default page is 1
    const limit = parseInt(req.query.limit) || 5; // Default limit is 5 per page
    const status = req.query.status || ""; // Default status is all
    const skip = (page - 1) * limit; // Calculate skip

    const regex = new RegExp(searchTerm, 'i'); // Create a case-insensitive regex
    const items = await Item.find(
      { $and: [
        { $or: [{ category: { $regex: regex }}, { itemName: { $regex: regex }}]},
        status ? {status: status} : {} // Filter by status
        ]
      }
    ).limit(limit).skip(skip); // Find items by name or category with limit and skip
    if (!items) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Count total
    const totalItems = await Item.countDocuments({ $or: [{ category: { $regex: regex }}, { itemName: { $regex: regex }}]}); // Count total items
    const totalPages = Math.ceil(totalItems / limit); // Calculate total pages
    return res.status(200).json({ 
      totalItems: totalItems,
      Size: limit,
      currentPage: page,
      totalPages: totalPages,
      data: items,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Get item by name or category (GET request)
/**
 * @swagger
 * /api/item/{term}:
 */
itemRouter.get('/api/item/:term', async (req, res) => {
  try {
    const name = req.params.term.toLowerCase(); // Get name from request URL
    const regex = new RegExp(name, 'i'); // Create a case-insensitive regex
    const item = await Item.findOne({ $or: [{ category: { $regex: regex }}, { itemName: { $regex: regex }}]});  // Find all items by name or category
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    return res.status(200).json({
      data: item,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Create a new item (POST request)
/**
 * @swagger
 * /api/item:
 */
itemRouter.post('/api/item', async (req, res) => {
  const item = new Item({
    itemName: req.body.itemName,
    category: req.body.category,
    itemUrl: req.body.itemUrl,
    description: req.body.description,
    price: req.body.price
  });
  try {
    await item.save();
    return res.status(201).json({
      data: item,
      status: 201
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Update an item by name (PUT request)
/**
 * @swagger
 * /api/item/{itemName}:
 */
itemRouter.put('/api/item/:itemName', async (req, res) => {
  try {
    const name = req.params.itemName.toLowerCase(); // Get name from request URL
    const regex = new RegExp(name, 'i'); // Create a case-insensitive regex
    const item = await Item.findOne({ itemName: { $regex: regex }});  // Find item by name
    if (!item) {
      return res.status(404).json({ data: { message: 'Item not found' }, status: 404 });
    }
    item.itemName = req.body.itemName;
    item.category = req.body.category;
    item.itemUrl = req.body.itemUrl;
    item.description = req.body.description;
    item.price = req.body.price;
    await item.save();
    return res.status(200).json({
      data: item,
      status: 200
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete an item by name (DELETE request)
/**
 * @swagger
 * /api/item/{itemName}:
 */
itemRouter.delete('/api/item/:itemName', async (req, res) => {
  try {
    const name = req.params.itemName.toLowerCase(); // Get name from request URL
    const regex = new RegExp(name, 'i'); // Create a case-insensitive regex
    const item = await Item.findOne({ itemName: { $regex: regex }});  // Find item by name
    if (!item) {
      return res.status(404).json({message: 'Item not found' });
    }
    await Item.deleteOne({ itemName: { $regex: regex }}); //Delete item by name
    return res.status(200).json({ data: { message: `item ${name} deleted` }, status: 200 });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = itemRouter;