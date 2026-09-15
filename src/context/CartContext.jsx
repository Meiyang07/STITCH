import { createContext, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const CartContext = createContext(null);

function keyFor(item) {
  return `${item.kind || 'product'}-${item.id}-${item.size || 'standard'}`;
}

export function CartProvider({ children }) {
  const [cart, setCart] = useLocalStorage('stitch_cart', []);

  const addItem = (item, quantity = 1) => {
    const nextItem = { ...item, quantity: Math.max(1, Number(quantity) || 1) };
    const targetKey = keyFor(nextItem);
    setCart((items) => {
      const existing = items.find((entry) => keyFor(entry) === targetKey);
      if (!existing) return [...items, nextItem];
      return items.map((entry) => keyFor(entry) === targetKey
        ? { ...entry, quantity: entry.quantity + nextItem.quantity }
        : entry);
    });
  };

  const removeItem = (item) => setCart((items) => items.filter((entry) => keyFor(entry) !== keyFor(item)));

  const updateQuantity = (item, quantity) => {
    const qty = Math.max(1, Number(quantity) || 1);
    setCart((items) => items.map((entry) => keyFor(entry) === keyFor(item) ? { ...entry, quantity: qty } : entry));
  };

  const clearCart = () => setCart([]);
  const count = cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const subtotal = cart.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  const value = useMemo(() => ({ cart, addItem, removeItem, updateQuantity, clearCart, count, subtotal }), [cart, count, subtotal]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
