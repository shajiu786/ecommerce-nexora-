import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage";
import { discountedPrice } from "../utils/format";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);
const KEY = "nexora_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStorage(KEY, []));
  const toast = useToast();
  const commit = useCallback((next) => { setItems(next); writeStorage(KEY, next); }, []);

  const addItem = useCallback((product, quantity = 1) => {
    if (!product || Number(product.stock) <= 0) { toast("This item is currently out of stock.", "error"); return; }
    const existing = items.find((item) => item.id === product.id);
    const currentQty = existing?.quantity || 0;
    const maxStock = Math.max(1, Number(product.stock) || 1);
    if (currentQty >= maxStock) { toast("You have reached the available stock limit.", "info"); return; }
    const next = existing
      ? items.map((item) => item.id === product.id ? { ...item, quantity: Math.min(maxStock, item.quantity + quantity) } : item)
      : [...items, { ...product, quantity: Math.min(maxStock, Math.max(1, quantity)) }];
    commit(next); toast(`${product.title} added to your cart.`);
  }, [items, commit, toast]);

  const removeItem = useCallback((id) => { commit(items.filter((item) => item.id !== id)); toast("Item removed from cart.", "info"); }, [items, commit, toast]);
  const updateQuantity = useCallback((id, quantity) => {
    const next = items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(Number(item.stock) || 1, Number(quantity) || 1)) } : item);
    commit(next);
  }, [items, commit]);
  const clearCart = useCallback(() => commit([]), [commit]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + discountedPrice(item) * item.quantity, 0);
  const value = useMemo(() => ({ items, addItem, removeItem, updateQuantity, clearCart, count, subtotal }), [items, addItem, removeItem, updateQuantity, clearCart, count, subtotal]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
