import mongoose from "mongoose";
import fs from "fs";

// 1) Connect to MongoDB
await mongoose.connect("mongodb://127.0.0.1:27017/yummport");
console.log("✔ Connected to MongoDB");

// 2) Read JSON files (correct paths)
const users = JSON.parse(fs.readFileSync("./datasets/users.json"));
const restaurants = JSON.parse(fs.readFileSync("./datasets/restaurants.json"));
const menu = JSON.parse(fs.readFileSync("./datasets/menuItems.json"));
const carts = JSON.parse(fs.readFileSync("./datasets/carts.json"));
const orders = JSON.parse(fs.readFileSync("./datasets/orders.json"));
const billing = JSON.parse(fs.readFileSync("./datasets/billing.json"));
const delivery = JSON.parse(fs.readFileSync("./datasets/deliveryPartners.json"));

// 3) Create temporary collections (ignore schema)
const Users = mongoose.model("users", new mongoose.Schema({}, { strict: false }));
const Restaurants = mongoose.model("restaurants", new mongoose.Schema({}, { strict: false }));
const Menu = mongoose.model("menuItems", new mongoose.Schema({}, { strict: false }));
const Carts = mongoose.model("carts", new mongoose.Schema({}, { strict: false }));
const Orders = mongoose.model("orders", new mongoose.Schema({}, { strict: false }));
const Billing = mongoose.model("billing", new mongoose.Schema({}, { strict: false }));
const Delivery = mongoose.model("deliveryPartners", new mongoose.Schema({}, { strict: false }));

// 4) Insert data
await Users.insertMany(users);
await Restaurants.insertMany(restaurants);
await Menu.insertMany(menu);
await Carts.insertMany(carts);
await Orders.insertMany(orders);
await Billing.insertMany(billing);
await Delivery.insertMany(delivery);

console.log("🔥 All datasets inserted successfully!");
process.exit();
