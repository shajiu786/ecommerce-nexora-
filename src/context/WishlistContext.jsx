import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { readStorage, writeStorage } from "../utils/storage";
import { useToast } from "./ToastContext";

const WishlistContext = createContext(null);
const KEY = "nexora_wishlist";

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => readStorage(KEY, []));
  const toast = useToast();
  const commit = useCallback((next) => { setItems(next); writeStorage(KEY, next); }, []);
  const hasItem = useCallback((id) => items.some((item) => item.id === id), [items]);
  const toggleItem = useCallback((product) => {
    if (items.some((item) => item.id === product.id)) {
      commit(items.filter((item) => item.id !== product.id)); toast("Removed from wishlist.", "info");
    } else {
      commit([...items, product]); toast("Saved to your wishlist.");
    }
  }, [items, commit, toast]);
  const removeItem = useCallback((id) => { commit(items.filter((item) => item.id !== id)); toast("Removed from wishlist.", "info"); }, [items, commit, toast]);
  const value = useMemo(() => ({ items, count: items.length, hasItem, toggleItem, removeItem }), [items, hasItem, toggleItem, removeItem]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within WishlistProvider");
  return context;
};
