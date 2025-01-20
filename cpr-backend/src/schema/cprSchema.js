const mongoose = require("mongoose");
const { or } = require("sequelize");

//this is the all in one schema file for lazy person like me
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    default: "Pa$$w0rd",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: false,
    default: "user",
  },
  status: {
    type: String,
    required: false,
    default: "Active",
  },
});

const User = mongoose.model("User", userSchema);

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: [String],
    required: true,
  },
  itemUrl: {
    type: String,
    required: false,
    default: "",
  },
  description: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: false,
    default: "Active",
  },
});

const Item = mongoose.model("Item", itemSchema);

const orderSchema = new mongoose.Schema({
  orderId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  orderDate: {
    type: String,
    default: () => {
      const date = new Date();
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    required: false,
  },
  items: [
    {
      itemName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: false,
    default: "Success",
  },
});

const Order = mongoose.model("Order", orderSchema);

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = { User, Item, Order, Category };
