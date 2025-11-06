import crypto from "crypto";
import Product from "../model/product.model.js";
import Cart from "../model/cart.model.js";

// Helper function to get the guest ID from the request
const getGuestId = (req) => {
    return req.headers['x-guest-cart-id'];
};

export const addToCart = async (req, res) => {
    const { productId, qty } = req.body;
    let guestId = getGuestId(req);
    let newGuestId = null;

    if (qty <= 0) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart;
        if (guestId) {
            cart = await Cart.findOne({ guestId: guestId });
        }

        if (!cart) {
            // No cart found, create a new one with a new guest ID
            newGuestId = crypto.randomUUID();
            cart = new Cart({ guestId: newGuestId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].qty += qty;
        } else {
            cart.items.push({
                product: productId,
                name: product.name,
                price: product.price,
                qty: qty
            });
        }

        const updatedCart = await cart.save();

        // Send back the updated cart AND the guestId.
        // The frontend *must* check this response. If 'newGuestId' is present,
        // it must save it to localStorage.
        return res.status(200).json({
            cart: updatedCart,
            // Send back the ID so the frontend can store it
            guestId: newGuestId || guestId 
        });

    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).json({ message: 'Server error while adding to cart.' });
    }
}

export const removeFromCart = async (req, res) => {
    const { itemId } = req.params;
    const guestId = getGuestId(req);

    if (!guestId) {
        // No guest ID, so they can't possibly have a cart to remove from.
        return res.status(404).json({ message: 'Cart not found' });
    }

    try {
        const cart = await Cart.findOne({ guestId: guestId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items.pull(itemId);
        const updatedCart = await cart.save();

        return res.status(200).json(updatedCart);

    } catch (error) {
        console.error('Error removing from cart:', error);
        return res.status(500).json({ message: 'Server error while removing from cart.' });
    }
}

export const getCart = async (req, res) => {
    const guestId = getGuestId(req);

    if (!guestId) {
        // No guest ID, so they have no cart. Return an empty structure.
        return res.status(200).json({ items: [], total: 0 });
    }

    try {
        const cart = await Cart.findOne({ guestId: guestId });

        if (!cart) {
            // They have an ID, but no matching cart. Return empty.
            return res.status(200).json({ items: [], total: 0 });
        }

        return res.status(200).json(cart);

    } catch (error) {
        console.error('Error fetching cart:', error);
        return res.status(500).json({ message: 'Server error while fetching cart.' });
    }
}