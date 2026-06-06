//importamos las librerias que usaremos
const express = require("express");
const cors = require("cors");
const dontenv = require("dotenv");

//cargamos las variables de entorno
dontenv.config();

require("./config/database"); //importamos la conexion a la base de datos

const app = express(); //creamos una instancia de express

//middlewares - son funciones que se ejecuran en cada peticion
app.use(cors()); //permite peticiones desde react
app.use(express.json()); //permite recibir datos en formato json

//rutas
const paypalRoutes = require("./routes/paypal.routes");
app.use("/api/paypal", paypalRoutes);

// Ruta de ordenes separada
const { getOrders } = require("./controllers/paypal.controller");
app.get("/api/orders", getOrders);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "🟢 Servidor Super Ozono funcionando" });
});

const PORT = process.env.PORT || 3001; //puerto del servidor

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
