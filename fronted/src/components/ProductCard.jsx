//componente que muestra una targeta como producto
//recibe los datos del producto en las props

const ProductCard = ({ product, onSelect, selected }) => {
   return (
    <div style={{
      border: selected ? '2px solid #0070ba' : '2px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      margin: '10px',
      width: '200px',
      cursor: 'pointer',
      backgroundColor: selected ? '#e8f4fd' : 'white',
      transition: 'all 0.2s'
    }}
      onClick={() => onSelect(product)}
    >
      <h3 style={{ color: '#0070ba' }}>{product.name}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '10px 0' }}>
        ${product.price}
      </p>
      <p style={{ color: '#666', fontSize: '14px' }}>USD</p>
    </div>
  );
};

export default ProductCard;