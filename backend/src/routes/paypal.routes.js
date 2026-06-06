const express = require("express");
const router = express.Router();
const {
  createOrder,
  captureOrder,
  getOrders,
} = require("../controllers/paypal.controller");

// creamos las rutas

router.post("/create-order", createOrder);
router.post("/capture-order", captureOrder);
router.get("/orders", getOrders);

module.exports = router;
