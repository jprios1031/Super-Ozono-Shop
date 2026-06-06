const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

//creamos un pool de conexiones a la base de datos

//para crear varias conexion a la db
//toma lod datos del .env
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, //maximo 10 conecciones simultaneas
  queueLimit: 0,
});

//una funcion para probar la conexion

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexión a la base de datos exitosa");
    connection.release();
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};

testConnection();

module.exports = pool;
