//routes/categoryRoutes.js
const express = require('express');
const {Category} = require('../src/schema/cprSchema');
const categoryRouter = express.Router();

// Get all categories (GET request)
/**
 * @swagger
 * /api/category/all:
 */


// Get all categories with searchTerm and Paging (GET request)
/**
 * @swagger
 * /api/category:
 */


// Get specific category by name (GET request)
/**
 * @swagger
 * /api/category/{categoryName}:
 */


// Add a new category (POST request)
/**
 * @swagger
 * /api/category:
 */


// Update a category by name (PUT request)
/**
 * @swagger
 * /api/category/{categoryName}:
 */


// Delete a category by name (DELETE request)
/**
 * @swagger
 * /api/category/{categoryName}:
 */


module.exports = categoryRouter;