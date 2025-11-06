import { Router } from 'express';
import { handleCheckout } from '../controller/checkout.controller.js';

const checkoutRouter = Router();

checkoutRouter.post('/', handleCheckout);

export default checkoutRouter;