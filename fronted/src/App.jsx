import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import ProductCard from './components/ProductCard';

// Los productos (solo para mostrar en pantalla, el precio real lo maneja el backend)
const PRODUCTS = [
  { id: 1, name: 'Biozono Biocida 2.0', price: '25.00' },
  { id: 2, name: 'Biosuelos Biozono',   price: '30.00' },
  { id: 3, name: 'Bioinductor',         price: '35.00' }
];

const BACKEND_URL = 'http://localhost:3001';

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null); // null | 'success' | 'error'
  const [message, setMessage] = useState('');

  // Se ejecuta cuando el usuario hace clic en "PayPal"
  // Le pide al backend que cree la orden
  const handleCreateOrder = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/paypal/create-order`, {
        productId: selectedProduct.id
      });
      return response.data.orderId; // PayPal necesita este ID
    } catch (error) {
      setMessage('Error al crear la orden');
      setOrderStatus('error');
    }
  };

  // Se ejecuta cuando el usuario aprueba el pago en PayPal
  /*const handleApprove = async (data) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/paypal/capture-order`, {
        orderId: data.orderID
      });
      setMessage(`✅ Pago exitoso por $${selectedProduct.price} - ${selectedProduct.name}`);
      setOrderStatus('success');
      setSelectedProduct(null);
    } catch (error) {
      setMessage('Error al capturar el pago');
      setOrderStatus('error');
    }
  };*/
const handleApprove = async (data) => {
    try {
      // Esto nos mostrará exactamente qué manda PayPal
      console.log('Data de PayPal:', data);
      
      const orderId = data.orderID;
      console.log('OrderID:', orderId);

      const response = await axios.post(`${BACKEND_URL}/api/paypal/capture-order`, {
        orderId: orderId
      });
      setMessage(` Pago exitoso por $${selectedProduct.price} - ${selectedProduct.name}`);
      setOrderStatus('success');
      setSelectedProduct(null);
    } catch (error) {
      console.error('Error capturando:', error.response?.data);
      setMessage('Error al capturar el pago');
      setOrderStatus('error');
    }
  };
  return (
    <PayPalScriptProvider options={{
      clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
      currency: 'USD'
    }}>
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#0070ba', fontSize: '32px' }}>🌿 Super Ozono Global</h1>
          <p style={{ color: '#666', marginTop: '8px' }}>Selecciona un producto para continuar</p>
        </div>

        {/* Mensaje de éxito o error */}
        {orderStatus && (
          <div style={{
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            backgroundColor: orderStatus === 'success' ? '#d4edda' : '#f8d7da',
            color: orderStatus === 'success' ? '#155724' : '#721c24',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {/* Productos */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {PRODUCTS.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              selected={selectedProduct?.id === product.id}
              onSelect={setSelectedProduct}
            />
          ))}
        </div>

        {/* Botón PayPal - solo aparece si hay un producto seleccionado */}
        {selectedProduct && (
          <div style={{ marginTop: '30px', maxWidth: '400px', margin: '30px auto' }}>
            <p style={{ textAlign: 'center', marginBottom: '15px', fontSize: '18px' }}>
              Comprando: <strong>{selectedProduct.name}</strong> — <strong>${selectedProduct.price}</strong>
            </p>
            <PayPalButtons
              style={{ layout: 'vertical' }}
              createOrder={handleCreateOrder}
              onApprove={handleApprove}
              onCancel={() => {
                setMessage('Pago cancelado');
                setOrderStatus('error');
              }}
              onError={(err) => {
                console.error('Error PayPal:', err);
                setMessage('Error en el proceso de pago');
                setOrderStatus('error');
              }}
            />
          </div>
        )}

      </div>
    </PayPalScriptProvider>
  );
}

export default App;