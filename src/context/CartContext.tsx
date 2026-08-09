import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, SizeOptionType, PrintOptions } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    sizeType: SizeOptionType,
    quantity: number,
    printOptions: PrintOptions,
    meters?: number
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode: string;
  applyCoupon: (code: string) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('texprint_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('texprint_cart', JSON.stringify(cart));
  }, [cart]);

  const calculateUnitAndItemPrice = (
    product: Product,
    sizeType: SizeOptionType,
    quantity: number,
    printOptions: PrintOptions,
    meters: number = 1
  ) => {
    let basePrice = 0;
    let printSurcharge = 0;

    if (sizeType === 'swatch_test') {
      basePrice = product.swatch_test_price;
      if (printOptions.requiresPrint) {
        printSurcharge = 1.00; // Fixed small print charge for sample test
      }
    } else if (sizeType === 'swatch_big') {
      basePrice = product.swatch_big_price;
      if (printOptions.requiresPrint) {
        printSurcharge = 2.50; // Print charge for big swatch
      }
    } else {
      // Linear Meter option
      basePrice = product.price_per_meter * meters;
      if (printOptions.requiresPrint) {
        printSurcharge = product.print_surcharge_per_meter * meters;
      }
    }

    const calculatedPricePerUnit = Number((basePrice + printSurcharge).toFixed(2));
    const itemTotalPrice = Number((calculatedPricePerUnit * quantity).toFixed(2));

    return { calculatedPricePerUnit, itemTotalPrice };
  };

  const addToCart = (
    product: Product,
    sizeType: SizeOptionType,
    quantity: number,
    printOptions: PrintOptions,
    meters: number = 1
  ) => {
    const { calculatedPricePerUnit, itemTotalPrice } = calculateUnitAndItemPrice(
      product,
      sizeType,
      quantity,
      printOptions,
      meters
    );

    const newItem: CartItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      productId: product.id,
      product,
      sizeType,
      meters: sizeType === 'meter' ? meters : undefined,
      quantity,
      printOptions,
      calculatedPricePerUnit,
      itemTotalPrice
    };

    setCart(prev => [...prev, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          const { calculatedPricePerUnit } = calculateUnitAndItemPrice(
            item.product,
            item.sizeType,
            newQuantity,
            item.printOptions,
            item.meters || 1
          );
          return {
            ...item,
            quantity: newQuantity,
            itemTotalPrice: Number((calculatedPricePerUnit * newQuantity).toFixed(2))
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setCouponCode('');
    setDiscountAmount(0);
  };

  const applyCoupon = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'TEXPRINT10' || normalized === 'WELCOME10') {
      setCouponCode(normalized);
      setDiscountAmount(0.10); // 10% off
      return true;
    }
    if (normalized === 'BULKPRINT20') {
      setCouponCode(normalized);
      setDiscountAmount(0.20); // 20% off
      return true;
    }
    return false;
  };

  const subtotal = Number(cart.reduce((sum, item) => sum + item.itemTotalPrice, 0).toFixed(2));
  const discount = Number((subtotal * discountAmount).toFixed(2));
  const shippingFee = subtotal > 100 || subtotal === 0 ? 0 : 9.99;
  const tax = Number(((subtotal - discount) * 0.05).toFixed(2)); // 5% GST/Tax
  const total = Number((subtotal - discount + shippingFee + tax).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        couponCode,
        applyCoupon,
        isCartOpen,
        setIsCartOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
