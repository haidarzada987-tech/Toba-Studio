import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  id: string;
  title: { dr: string; ps: string; en: string };
  price: { dr: string; ps: string; en: string };
  image?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: string;
  rawTotals: { usd: number; afn: number };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        // Migration: if title/price are strings, wrap them (though they should be objects now)
        return parsed.map((item: any) => ({
          ...item,
          title: typeof item.title === 'string' ? { dr: item.title, ps: item.title, en: item.title } : item.title,
          price: typeof item.price === 'string' ? { dr: item.price, ps: item.price, en: item.price } : item.price,
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const persianToEnglish = (str: string) => {
    return str.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
  };

  const totals = items.reduce((acc, item) => {
    // Use English price for parsing as it's more reliable
    const priceStr = item.price.en;
    const currency = priceStr.includes('$') || priceStr.toLowerCase().includes('usd') || priceStr.toLowerCase().includes('dollar') ? 'USD' : 
                     (priceStr.toLowerCase().includes('afn') || priceStr.toLowerCase().includes('afghani') ? 'AFN' : 'OTHER');
    
    const englishPrice = persianToEnglish(priceStr);
    const priceNum = parseInt(englishPrice.replace(/[^0-9]/g, '')) || 0;
    
    if (!acc[currency]) acc[currency] = 0;
    acc[currency] += (priceNum * item.quantity);
    return acc;
  }, { USD: 0, AFN: 0, OTHER: 0 } as Record<string, number>);

  const formattedTotalPrice = Object.entries(totals)
    .map(([curr, total]) => {
      if (total <= 0) return '';
      
      const locale = localStorage.getItem('language') === 'en' ? 'en-US' : 'fa-IR';
      const formattedTotal = total.toLocaleString(locale).replace(/٬/g, ',');
      
      if (curr === 'USD') {
        const labels = { dr: 'دلار', ps: 'ډالره', en: 'USD' };
        const lang = (localStorage.getItem('language') as any) || 'dr';
        return lang === 'en' ? `$${formattedTotal}` : `${formattedTotal} ${labels[lang as keyof typeof labels]}`;
      }
      if (curr === 'AFN') {
        const labels = { dr: 'افغانی', ps: 'افغانۍ', en: 'AFN' };
        const lang = (localStorage.getItem('language') as any) || 'dr';
        return `${formattedTotal} ${labels[lang as keyof typeof labels]}`;
      }
      return `${formattedTotal} unit`;
    })
    .filter(Boolean)
    .join(' + ') || (localStorage.getItem('language') === 'en' ? '$0' : '۰ دلار');

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice: formattedTotalPrice,
      rawTotals: { usd: totals.USD, afn: totals.AFN }
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
