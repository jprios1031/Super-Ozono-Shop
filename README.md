# Super Ozono Shop

Mini tienda online con integración de pagos PayPal Sandbox.

## Descripción

Tienda online que permite comprar 3 productos biologicos procesando pagos con PayPal Sandbox. El backend valida los precios y gestiona las ordenes en MySQL.

## Productos

| Producto            | Precio     |
| ------------------- | ---------- |
| Biozono Biocida 2.0 | $25.00 USD |
| Biosuelos Biozono   | $30.00 USD |
| Bioinductor         | $35.00 USD |

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Pagos:** PayPal Sandbox

## Estructura del proyecto

```
super-ozono-shop/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # Conexión MySQL
│   │   │   ├── paypal.js        # Integración PayPal API
│   │   │   └── products.js      # Productos y precios (fuente de verdad)
│   │   ├── controllers/
│   │   │   └── paypal.controller.js  # Lógica de los endpoints
│   │   ├── routes/
│   │   │   └── paypal.routes.js      # Definición de rutas
│   │   └── index.js             # Entrada del servidor
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── ProductCard.jsx   # Tarjeta de producto
    │   ├── App.jsx               # Componente principal
    │   └── main.jsx
    ├── .env.example
    └── package.json
```

## Requisitos previos

- Node.js v18 o superior
- MySQL corriendo (XAMPP, MySQL Workbench, etc.)
- Cuenta de desarrollador PayPal con credenciales Sandbox

## Configuración de la base de datos

Ejecuta este SQL en tu cliente MySQL:

```sql
CREATE DATABASE IF NOT EXISTS superozono;

USE superozono;

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paypal_order_id VARCHAR(100) NOT NULL UNIQUE,
  product_id INT NOT NULL,
  product_name VARCHAR(100) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Como correr el proyecto

### 1. Clona el repositorio

```bash
git clone https://github.com/tu-usuario/super-ozono-shop.git
cd super-ozono-shop
```

### 2. Configura el Backend

```bash
cd backend
npm install
```

Crea el archivo `.env` basado en `.env.example`:

```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=superozono
PAYPAL_CLIENT_ID=tu_paypal_client_id
PAYPAL_CLIENT_SECRET=tu_paypal_client_secret
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

Inicia el servidor:

```bash
npm run dev
```

El backend estará en `http://localhost:3001`

### 3. Configura el Frontend

Abre una nueva terminal:

```bash
cd frontend
npm install
```

Crea el archivo `.env` basado en `.env.example`:

```env
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id
```

Inicia el frontend:

```bash
npm run dev
```

El frontend estará en `http://localhost:5173`

## Endpoints de la API

| Método | Endpoint                    | Descripción              |
| ------ | --------------------------- | ------------------------ |
| POST   | `/api/paypal/create-order`  | Crea una orden en PayPal |
| POST   | `/api/paypal/capture-order` | Captura el pago aprobado |
| GET    | `/api/orders`               | Lista todas las órdenes  |

### Ejemplo — Crear orden

```bash
curl -X POST http://localhost:3001/api/paypal/create-order \
  -H "Content-Type: application/json" \
  -d '{"productId": 1}'
```

Respuesta:

```json
{
  "orderId": "72033593VN298782S"
}
```

### Ejemplo — Capturar pago

```bash
curl -X POST http://localhost:3001/api/paypal/capture-order \
  -H "Content-Type: application/json" \
  -d '{"orderId": "72033593VN298782S"}'
```

### Ejemplo — Listar órdenes

```bash
curl http://localhost:3001/api/orders
```

## Seguridad implementada

- **Precio calculado en el backend** — el frontend nunca define el precio real
- **CLIENT_SECRET nunca expuesto** — solo vive en variables de entorno del backend
- **Validación de productos** — se verifica que el producto exista antes de crear la orden
- **Protección contra pagos duplicados** — se verifica el status antes de capturar
- **Variables de entorno** — credenciales nunca en el código fuente

## Como probar el pago

1. Ve a `https://developer.paypal.com` → **Testing → Sandbox Accounts**
2. Copia el email y contraseña de la cuenta **Personal**
3. En la tienda selecciona un producto y haz clic en el botón PayPal
4. Inicia sesión con las credenciales Sandbox
5. Aprueba el pago
6. Verifica la orden en `http://localhost:3001/api/orders`

## Flujo de compra

```
Usuario selecciona producto
        ↓
Frontend llama POST /api/paypal/create-order
        ↓
Backend valida producto y crea orden en PayPal API
        ↓
Backend guarda orden en MySQL con status PENDING
        ↓
Frontend redirige a PayPal (usuario aprueba)
        ↓
Frontend llama POST /api/paypal/capture-order
        ↓
Backend captura el pago en PayPal API
        ↓
Backend actualiza orden en MySQL a COMPLETED
        ↓
Usuario ve confirmación de pago exitoso
```

## Autor

Juan Pablo Rios — Prueba técnica Super Ozono Global
