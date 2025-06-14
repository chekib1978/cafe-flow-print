
import { useState } from 'react';
import type { Product, CartItem } from '@/data/database';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === product.id);
      
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return currentItems; // Ne pas ajouter si stock insuffisant
        }
        return currentItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(currentItems => {
      return currentItems.reduce((acc, item) => {
        if (item.id === productId) {
          if (item.quantity > 1) {
            acc.push({ ...item, quantity: item.quantity - 1 });
          }
          // Si quantity === 1, on ne rajoute pas l'item (suppression)
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as CartItem[]);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartQuantity = (productId: string): number => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartQuantity
  };
}
