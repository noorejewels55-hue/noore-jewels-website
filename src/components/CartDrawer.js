'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
    const {
        items, totalItems, subtotal, shipping, total,
        isCartOpen, setIsCartOpen, removeItem, updateQuantity
    } = useCart();

    return (
        <>
            {/* Overlay */}
            <div
                className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
                onClick={() => setIsCartOpen(false)}
            />

            {/* Drawer */}
            <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
                <div className="cart-drawer-header">
                    <span className="cart-drawer-title">Your Bag ({totalItems})</span>
                    <button className="cart-drawer-close" onClick={() => setIsCartOpen(false)}>✕</button>
                </div>

                {items.length === 0 ? (
                    <div className="cart-empty">
                        <div className="cart-empty-icon">🛍️</div>
                        <p className="cart-empty-text">Your bag is empty</p>
                        <Link href="/shop" className="btn btn-primary" onClick={() => setIsCartOpen(false)}>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="cart-drawer-items">
                            {items.map(item => {
                                const effectivePrice = item.discount > 0
                                    ? item.price * (1 - item.discount / 100)
                                    : item.price;

                                return (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-image">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="cart-item-info">
                                            <div className="cart-item-name">{item.name}</div>
                                            <div className="cart-item-price">₹{Math.round(effectivePrice).toLocaleString('en-IN')}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    style={{ width: '28px', height: '28px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', background: 'none', cursor: 'pointer' }}
                                                >−</button>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 500, minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    style={{ width: '28px', height: '28px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', background: 'none', cursor: 'pointer' }}
                                                >+</button>
                                            </div>
                                            <button className="cart-item-remove" onClick={() => removeItem(item.id)}>Remove</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="cart-drawer-footer">
                            <div className="cart-total">
                                <span>Subtotal</span>
                                <span>₹{Math.round(subtotal).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="cart-total">
                                <span>Shipping</span>
                                <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                            </div>
                            {shipping > 0 && (
                                <p style={{ fontSize: '0.7rem', color: 'var(--color-gold)', textAlign: 'center', marginTop: '4px' }}>
                                    Add ₹{Math.ceil(999 - subtotal).toLocaleString('en-IN')} more for free shipping!
                                </p>
                            )}
                            <div className="cart-total grand">
                                <span>Total</span>
                                <span>₹{Math.round(total).toLocaleString('en-IN')}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="btn btn-gold btn-full"
                                style={{ marginTop: '16px' }}
                                onClick={() => setIsCartOpen(false)}
                            >
                                Proceed to Checkout
                            </Link>

                            <button
                                className="btn btn-outline btn-full btn-sm"
                                style={{ marginTop: '8px' }}
                                onClick={() => setIsCartOpen(false)}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
