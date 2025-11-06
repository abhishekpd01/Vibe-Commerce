import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    },
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    qty: { 
        type: Number, 
        required: true 
    }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
     // --- Customer Details ---
    customerName: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
    },
    customerEmail: {
        type: String,
        required: [true, 'Customer email is required'],
        trim: true
    },
    
    // --- Order Details ---
    items: [OrderItemSchema],
    total: {
        type: Number,
        required: true
    },

    // --- Traceability ---
    // This links to the user if they were logged in
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    // This links to the guest cart that was used
    guestCartId: { 
        type: String, 
        required: false 
    }
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

export default Order;