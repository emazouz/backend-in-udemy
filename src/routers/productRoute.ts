import express from 'express';
import { getAllProducts } from '../services/productService';

const router = express.Router();

router.get('/', async (req, res) => {
    const allProducts = await getAllProducts();
    res.status(200).send(allProducts);
})



export default router;