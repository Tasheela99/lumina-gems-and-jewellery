// src/context/CartContext.jsx
// ─────────────────────────────────────────────
// Global cart state — persisted to localStorage.
// Wrap the app with <CartProvider> and use useCart() in any component.
// ─────────────────────────────────────────────

import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);

// ── Action types ────────────────────────────────────────────────────────────
const ACTIONS = {
  ADD: 'ADD_TO_CART',
  REMOVE: 'REMOVE_FROM_CART',
  UPDATE_QTY: 'UPDATE_QUANTITY',
  CLEAR: 'CLEAR_CART',
  LOAD: 'LOAD_FROM_STORAGE',
};

// ── Reducer ─────────────────────────────────────────────────────────────────
const cartReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOAD:
      return action.payload;

    case ACTIONS.ADD: {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        // Increment quantity (don't exceed stock)
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case ACTIONS.REMOVE:
      return state.filter((item) => item.id !== action.payload);

    case ACTIONS.UPDATE_QTY:
      if (action.payload.quantity < 1) {
        return state.filter((item) => item.id !== action.payload.id);
      }
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.min(action.payload.quantity, item.stock) }
          : item
      );

    case ACTIONS.CLEAR:
      return [];

    default:
      return state;
  }
};

// ── Provider ────────────────────────────────────────────────────────────────
export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('gems_cart');
      if (stored) {
        dispatch({ type: ACTIONS.LOAD, payload: JSON.parse(stored) });
      }
    } catch {
      // ignore corrupt data
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem('gems_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ── Derived values ─────────────────────────────────────────────────────
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ── Action creators ────────────────────────────────────────────────────
  const addToCart = (product) =>
    dispatch({ type: ACTIONS.ADD, payload: product });

  const removeFromCart = (productId) =>
    dispatch({ type: ACTIONS.REMOVE, payload: productId });

  const updateQuantity = (productId, quantity) =>
    dispatch({ type: ACTIONS.UPDATE_QTY, payload: { id: productId, quantity } });

  const clearCart = () => dispatch({ type: ACTIONS.CLEAR });

  const isInCart = (productId) => cartItems.some((item) => item.id === productId);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export default CartContext;
