import React, { createContext, useState, useContext, useEffect } from 'react';

// Define the base URL for your API
const API_BASE_URL = 'http://localhost:3000/api/v1';

// --- NEW: Helper functions for localStorage ---
const GUEST_CART_ID_KEY = 'guestCartId';

const getGuestId = () => {
  try {
    return localStorage.getItem(GUEST_CART_ID_KEY);
  } catch (e) {
    console.error('LocalStorage not available.', e);
    return null;
  }
};

const setGuestId = (id) => {
  try {
    localStorage.setItem(GUEST_CART_ID_KEY, id);
  } catch (e) {
    console.error('LocalStorage not available.', e);
  }
};
// --- END NEW ---

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the current cart from the backend
  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    
    // --- NEW: Get guestId from storage ---
    const guestId = getGuestId();
    
    // If we have no ID, we have no cart. Don't bother fetching.
    if (!guestId) {
      setCartItems([]);
      setTotal(0);
      setLoading(false);
      return;
    }

    try {
      // --- NEW: Add the guestId header ---
      const response = await fetch(`${API_BASE_URL}/cart`, {
        headers: {
          'x-guest-cart-id': guestId,
        },
      });
      // --- END NEW ---

      if (!response.ok) {
        // If cart not found (e.g., ID is old), clear storage
        if (response.status === 404) {
          localStorage.removeItem(GUEST_CART_ID_KEY);
        }
        throw new Error('Failed to fetch cart.');
      }
      
      const data = await response.json();
      console.log('Fetched cart data:', data);
      
      setCartItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add an item to the cart
  const addToCart = async (productId, qty) => {
    setLoading(true);
    
    // --- NEW: Get guestId and add it to headers ---
    const guestId = getGuestId();
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // Send the current guestId (it's ok if it's null)
          'x-guest-cart-id': guestId,
        },
        body: JSON.stringify({ productId, qty }),
      });
      // --- END NEW ---

      if (!response.ok) throw new Error('Failed to add item to cart.');

      // --- NEW: Get full response from backend ---
      const data = await response.json();
      
      // The backend sends back the guestId (new or old). We MUST save it.
      if (data.guestId) {
        setGuestId(data.guestId);
      }
      
      // Update state directly from the response (more efficient!)
      setCartItems(data.cart.items || []);
      setTotal(data.cart.total || 0);
      // --- END NEW ---

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // We set loading false here, not in fetchCart
    }
  };

  // Remove an item from the cart
  const removeFromCart = async (cartItemId) => {
    setLoading(true);
    
    // --- NEW: Get guestId and add it to headers ---
    const guestId = getGuestId();
    if (!guestId) {
      setError('No cart to remove from.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'x-guest-cart-id': guestId,
        }
      });
      // --- END NEW ---
      
      if (!response.ok) throw new Error('Failed to remove item.');

      // --- NEW: Update state from response ---
      const updatedCart = await response.json();
      setCartItems(updatedCart.items || []);
      setTotal(updatedCart.total || 0);
      // --- END NEW ---

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle checkout
  const checkout = async (customerDetails) => {
    setLoading(true);
    setError(null);

    // --- NEW: Get guestId and add it to headers ---
    const guestId = getGuestId();
    if (!guestId) {
      setError('Cart is empty.');
      setLoading(false);
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-guest-cart-id': guestId,
        },
        body: JSON.stringify({
          cartItems: cartItems, // You could also just send the guestId
          customer: customerDetails,
        }),
      });
      // --- END NEW ---

      if (!response.ok) throw new Error('Checkout failed.');
      const receipt = await response.json();
      
      // --- NEW: Clear the cart and guestId from storage ---
      localStorage.removeItem(GUEST_CART_ID_KEY);
      setCartItems([]);
      setTotal(0);
      setLoading(false);
      // --- END NEW ---

      return receipt; // Return receipt to show in modal
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  // Fetch cart on initial app load
  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cartItems,
    total,
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};