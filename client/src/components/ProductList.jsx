import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const {addToCart, loading} = useCart();

    useEffect(() => {
        // Fetch products from server
        const API_BASE_URL = "http://localhost:3000/api/v1";

        const fetchProducts = async () => {
            try {
               const response = await fetch(`${API_BASE_URL}/products`);
               const data = await response.json();

               setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        }

        fetchProducts();
    }, []);

    return (
        <div className="product-page">
            <h2>Products</h2>
            <div className="product-list">
                { products.length === 0 ? (
                    <p>Loading products...</p>
                ) : (
                    products.map(product => (
                        <div key={product.id} className="product-item">
                            <div className="product-details">
                                <h3>{product.name}</h3>
                                <p className="product-price">${product.price.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={() => addToCart(product.id, 1)}
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add to Cart'}
                            </button>
                        </div>
                    ))
                ) }
            </div>
        </div>
    )
}

export default ProductList;