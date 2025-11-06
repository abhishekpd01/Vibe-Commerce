import React from "react";

import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Header = () => {
    const { cartItems } = useCart();

    // Calculate total quantity of items in cart
    const itemCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

    return (
        <header className="header">
            <Link to="/" className="logo">
                <h1>Commerce</h1>
            </Link>
            <nav>
                <Link to="/">Products</Link>
                <Link to="/cart" className="cart-link">
                    Cart
                    {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
                </Link>
            </nav>
        </header>
    )
}

export default Header;