import { Router } from "express";
import { addToCart, getCart, removeFromCart } from "../controller/cart.controller.js";

const cartRouter = Router();

cartRouter.post('/', addToCart);
cartRouter.delete('/:itemId', removeFromCart);
cartRouter.get('/', getCart);

export default cartRouter;