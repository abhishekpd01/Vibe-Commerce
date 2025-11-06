import { Router } from "express";
import fetchProduts from "../controller/product.controller.js";

const productsRouter = Router();

productsRouter.get('/', fetchProduts);

export default productsRouter;