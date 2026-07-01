import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  qty: number;
  stock: number;
};

type CartCtx = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  count: number;
  total: number;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Load initial state from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("shesafe_cart");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  // Sync to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("shesafe_cart", JSON.stringify(items));
  }, [items]);

  const add: CartCtx["add"] = (item) => {
    if (item.stock <= 0) return; // Cannot add out of stock items
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        // Enforce max stock limit when adding
        const nextQty = Math.min(found.qty + 1, item.stock);
        if (nextQty === found.qty) {
          alert(`You cannot add more than ${item.stock} of this item.`);
        }
        return prev.map((p) => (p.id === item.id ? { ...p, qty: nextQty } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setOpen(true);
  };
  
  const remove: CartCtx["remove"] = (id) => setItems((p) => p.filter((i) => i.id !== id));
  
  const setQty: CartCtx["setQty"] = (id, qty) =>
    setItems((p) => p.map((i) => {
      if (i.id === id) {
        // Enforce max stock limit on manual qty change
        return { ...i, qty: Math.min(Math.max(1, qty), i.stock) };
      }
      return i;
    }));
    
  const clear = () => setItems([]);

  const count = items.reduce((a, i) => a + i.qty, 0);
  const total = items.reduce((a, i) => a + i.qty * i.price, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, open, setOpen, count, total }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
