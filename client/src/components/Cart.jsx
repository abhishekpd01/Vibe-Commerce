// src/components/Cart.js
import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import ReceiptModal from './ReceiptModal';

const Cart = () => {
  const { cartItems, total, removeFromCart, checkout, loading, error } = useCart();
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const [receipt, setReceipt] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const result = await checkout(customer);
    if (result) {
      setReceipt(result); // Show modal
      setCustomer({ name: '', email: '' }); // Clear form
    }
  };

  if (loading && !receipt) return <p>Loading cart...</p>;
  if (error) return <p className="error-message">Error: { error }</p>;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-info">
                  <span>{item.name} (x{item.qty})</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => removeFromCart(item._id)}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <h3 className="cart-total">Total: ${total.toFixed(2)}</h3>
          
          <form className="checkout-form" onSubmit={handleCheckout}>
            <h3>Checkout</h3>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customer.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={customer.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="checkout-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </>
      )}

      {receipt && (
        <ReceiptModal 
          receipt={receipt} 
          onClose={() => setReceipt(null)} 
        />
      )}
    </div>
  );
};

export default Cart;