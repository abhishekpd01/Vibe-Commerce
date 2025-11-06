import Cart from '../model/cart.model.js';
import Order from '../model/order.model.js';

export const handleCheckout = async (req, res) => {
    try {
        // Get Guest ID and Customer Details
        const guestId = req.headers['x-guest-cart-id'];
        const { customer } = req.body;

        // Validation
        if (!guestId) {
            return res.status(400).json({ message: 'No cart to check out.' });
        }
        if (!customer || !customer.name || !customer.email) {
            return res.status(400).json({ message: 'Customer details are required.' });
        }

        // Find the cart in the database
        const cart = await Cart.findOne({ guestId: guestId });

        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: 'Cart is empty or not found.' });
        }

        // Create the Order
        // Create a permanent record.
        const newOrder = new Order({
            customerName: customer.name,
            customerEmail: customer.email,
            items: cart.items,      // A direct copy of the items
            total: cart.total,      // Calculated by Mongoose virtual
            guestCartId: guestId    // For traceability
        });

        const savedOrder = await newOrder.save();

        // Clear the Guest's Cart after successful order creation
        await Cart.deleteOne({ _id: cart._id });

        // Format and Send the Receipt
        const receipt = {
            id: savedOrder._id,
            total: savedOrder.total,
            timestamp: savedOrder.createdAt // From `timestamps: true`
        };

        return res.status(201).json(receipt);

    } catch (error) {
        console.error('Error processing checkout:', error);
        return res.status(500).json({ message: 'Server error during checkout.' });
    }
}