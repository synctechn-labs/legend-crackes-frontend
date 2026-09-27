import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'sivakasi_crackers_cart_v1';
const COUPON_STORAGE_KEY = 'sivakasi_crackers_coupon_v1';

export const CartProvider = ({ children }) => {
  const { addToast } = useToast();

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      const stored = localStorage.getItem(COUPON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persist to localStorage whenever cartItems changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to persist cart items to localStorage', e);
    }
  }, [cartItems]);

  // Persist applied coupon
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to persist coupon to localStorage', e);
    }
  }, [appliedCoupon]);

  const addToCart = (product, quantity = 1, silent = false) => {
    if (!product || quantity <= 0) return;

    setCartItems((prevItems) => {
      const existingIdx = prevItems.findIndex((item) => item.id === product.id);
      if (existingIdx !== -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: product.id,
            code: product.code,
            name: product.name,
            category: product.category,
            categoryName: product.categoryName,
            originalPrice: product.originalPrice,
            sellingPrice: product.sellingPrice,
            discount: product.discount,
            image: product.image,
            piecesPerBox: product.piecesPerBox,
            stock: product.stock,
            quantity: quantity,
          },
        ];
      }
    });

    if (!silent) {
      addToast({
        title: 'Added to Cart!',
        message: `${quantity} × "${product.name}" added to your festive bag.`,
        type: 'success',
      });
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    const itemToRemove = cartItems.find((item) => item.id === productId);
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
    if (itemToRemove) {
      addToast({
        title: 'Removed from Cart',
        message: `"${itemToRemove.name}" was removed.`,
        type: 'info',
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'DIWALI2026') {
      const coupon = { code: 'DIWALI2026', type: 'percentage', value: 10, label: '10% Festive Diwali Discount' };
      setAppliedCoupon(coupon);
      addToast({
        title: 'Coupon Applied!',
        message: '10% Extra Diwali Festive discount added to your order.',
        type: 'success',
      });
      return { success: true };
    } else if (cleanCode === 'SIVAKASI100') {
      const coupon = { code: 'SIVAKASI100', type: 'flat', value: 100, label: 'Flat ₹100 Direct Sivakasi Savings' };
      setAppliedCoupon(coupon);
      addToast({
        title: 'Coupon Applied!',
        message: 'Flat ₹100 discount applied.',
        type: 'success',
      });
      return { success: true };
    } else {
      addToast({
        title: 'Invalid Coupon',
        message: 'Coupon code not valid. Try "DIWALI2026" or "SIVAKASI100".',
        type: 'error',
      });
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    addToast({
      title: 'Coupon Removed',
      message: 'Discount coupon has been removed.',
      type: 'info',
    });
  };

  // Calculations
  const totalCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const originalSubtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.originalPrice * item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);
  }, [cartItems]);

  const productSavings = useMemo(() => {
    return originalSubtotal - subtotal;
  }, [originalSubtotal, subtotal]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || subtotal <= 0) return 0;
    if (appliedCoupon.type === 'percentage') {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
    if (appliedCoupon.type === 'flat') {
      return Math.min(appliedCoupon.value, subtotal);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  // Free shipping over ₹2000, otherwise safe hazardous material transport fee of ₹150
  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 2000 ? 0 : 150;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - couponDiscount + shippingFee);
  }, [subtotal, couponDiscount, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount,
        originalSubtotal,
        subtotal,
        productSavings,
        couponDiscount,
        shippingFee,
        grandTotal,
        appliedCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
