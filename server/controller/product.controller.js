import Product from "../model/product.model.js";

const fetchProduts = async (req, res) => {
    const products = [];
    try {
        const productsFromDb = await Product.find({});
        productsFromDb.forEach(product => {
            products.push({
                id: product._id,
                name: product.name,
                price: product.price
            });
        });
        res.json(products);
        return products
    } catch (error) {
        res.status(500).json({ message: "Error retrieving products" });1
    }
}

export default fetchProduts;