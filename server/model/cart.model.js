import mongoose from 'mongoose';

// Schema for an individual item *within* the cart.
// This will be a sub-document array in the main CartSchema.
const CartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Links this item to a Product document
        required: true
    },
    qty: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
        default: 1
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, {
    _id: true 
});


// Main Cart Schema
const CartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        unique: true,   
        sparse: true   // <-- This makes 'unique' ignore null values
    },
    guestId: {
        type: String,
        required: false,
        index: true,
        unique: true,
        sparse: true   
    },
    items: [CartItemSchema]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//  Virtual Property: 'total'
CartSchema.virtual('total').get(function() {
    // 'this' refers to the cart document
    return this.items.reduce((acc, item) => {
        return acc + (item.price * item.qty);
    }, 0);
});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;