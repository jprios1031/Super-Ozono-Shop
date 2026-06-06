const pool = require("../config/database");
const { createOrderPaypal, capturePaypalOrder } = require("../config/paypal");
const PRODUCTS = require("../config/products");

const createOrder = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = PRODUCTS[productId];
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const order = await createOrderPaypal(product.price, product.name);

    await pool.query(
      "INSERT INTO orders (paypal_order_id, product_id, product_name, amount, status) VALUES (?, ?, ?, ?, ?)",
      [order.id, productId, product.name, product.price, "PENDING"],
    );

    res.json({ orderId: order.id });
  } catch (error) {
    console.error("Error al crear la orden:", error.message);
    res.status(500).json({ message: "Error al crear la orden" });
  }
};

const captureOrder = async (req, res) => {
  let connection;

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId es requerido" });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [result] = await connection.execute(
      "UPDATE orders SET status = 'PROCESSING' WHERE paypal_order_id = ? AND status = 'PENDING'",
      [orderId],
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      connection.release();
      return res
        .status(400)
        .json({ error: "Orden no encontrada o ya fue procesada" });
    }

    await connection.commit();
    connection.release();

    const captureData = await capturePaypalOrder(orderId);

    await pool.execute(
      "UPDATE orders SET status = 'COMPLETED' WHERE paypal_order_id = ?",
      [orderId],
    );

    res.json({
      mensaje: " Pago completado exitosamente",
      paypal: captureData,
    });
  } catch (error) {
    // Ahora connection puede ser undefined si falló antes de getConnection
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    console.log("Error capturando el pago:", error.message);
    res.status(500).json({ error: "Error capturando el pago" });
  }
};

const getOrders = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM orders ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (error) {
    console.log("Error al obtener las ordenes:", error.message);
    res.status(500).json({ error: "Error al obtener las ordenes" });
  }
};

module.exports = {
  createOrder,
  captureOrder,
  getOrders,
};
