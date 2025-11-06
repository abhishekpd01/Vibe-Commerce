import React from "react";

const ReceiptModal = ({ receipt, onClose }) => {
    if(!receipt) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Checkout Successful!</h2>
                <p>Thank you for your purchase.</p>
                <div className="receipt-details">
                    <p><strong>Receipt ID:</strong> {receipt.id}</p>
                    <p><strong>Total Paid:</strong> ${receipt.total.toFixed(2)}</p>
                    <p><strong>Date:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
                </div>
                <button onClick={onClose} className="close-btn">Close</button>
            </div>
        </div>
    )
}

export default ReceiptModal;