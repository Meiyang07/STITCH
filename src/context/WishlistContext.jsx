import { createContext, useContext, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useLocalStorage('stitch_wishlist', []);
  const [toast, setToast] = useState('');

  const add = (item) => {
    setWishlist((items) => items.some((x) => x.id === item.id && x.kind === item.kind) ? items : [...items, item]);
    setToast(`${item.name} saved to wishlist`);
    setTimeout(() => setToast(''), 2200);
  };
  const remove = (id, kind) => setWishlist((items) => items.filter((x) => !(x.id === id && x.kind === kind)));
  const toggle = (item) => {
    const exists = wishlist.some((x) => x.id === item.id && x.kind === item.kind);
    if (exists) remove(item.id, item.kind); else add(item);
  };
  const has = (id, kind) => wishlist.some((x) => x.id === id && x.kind === kind);
  const value = useMemo(() => ({ wishlist, add, remove, toggle, has, toast }), [wishlist, toast]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
