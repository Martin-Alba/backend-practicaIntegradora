import { Router } from 'express'
import CartManager from '../CartManager.js'
import ProductManager from '../ProductManager.js'

const router = Router()

const cartManager = new CartManager()

router.post('/', (req, res) => {
    const newCart = cartManager.createCart()
    res.json(newCart)
})

router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const cart = cartManager.getCartById(id);
        res.status(200).json(cart);
    } catch (error) {
        res.status(404).send(error.message);
    }
})

router.post('/:id/product/:productId', (req, res) => {
    const cartId = parseInt(req.params.id);
    const productId = parseInt(req.params.productId);
    const quantity = 1; 

    try {
        const cartManager = new CartManager();
        const productManager = new ProductManager();

        const cart = cartManager.getCartById(cartId);

        const product = productManager.getProductById(productId);

        if (!product) {
            throw new Error(`Product with id ${productId} not found`);
        }

        const cartProduct = cart.products.find(p => p.product === productId);
        if (cartProduct) {
            cartProduct.quantity += quantity;
        } else {
            cart.products.push({
                product: productId,
                quantity: quantity
            });
        }

        cartManager.saveCart();

        res.json(cart);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
})

export default router