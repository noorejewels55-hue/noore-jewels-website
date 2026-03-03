'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [items, setItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Load cart from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('noore-cart');
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Error loading cart:', e);
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        try {
            localStorage.setItem('noore-cart', JSON.stringify(items));
        } catch (e) {
            console.error('Error saving cart:', e);
        }
    }, [items]);

    const addItem = useCallback((product, qty = 1) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            const maxQty = product.availableQty || 99;
            if (existing) {
                const newQty = Math.min(existing.quantity + qty, maxQty);
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: newQty }
                        : item
                );
            }
            return [...prev, { ...product, quantity: Math.min(qty, maxQty) }];
        });
        setIsCartOpen(true);
    }, []);

    const removeItem = useCallback((productId) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }
        setItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ));
    }, [removeItem]);

    const clearCart = useCallback(() => {
        setItems([]);
        localStorage.removeItem('noore-cart');
    }, []);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = items.reduce((sum, item) => {
        const effectivePrice = item.discount > 0
            ? item.price * (1 - item.discount / 100)
            : item.price;
        return sum + effectivePrice * item.quantity;
    }, 0);

    const shipping = subtotal >= 999 ? 0 : 49;
    const total = subtotal + shipping;

    return (
        <CartContext.Provider value={{
            items,
            totalItems,
            subtotal,
            shipping,
            total,
            isCartOpen,
            setIsCartOpen,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be inside CartProvider');
    return ctx;
}
