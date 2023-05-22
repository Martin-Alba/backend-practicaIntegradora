import { Router } from 'express'
import ProductManager from '../ProductManager.js'
const router = Router()

const manager = new ProductManager('./dataBase.json')

router.get('/', (req, res) => {
    const limit = req.query.limit
    try {
        const products = manager.getProducts()
        res.send(products.slice(0, limit))
    } catch (err) {
        res.status(500).send('Ocurrio un error al leer el archivo de productos')
    }
})

router.get('/:id', (req, res) => {
    const id = +req.params.id
    try {
        const product = manager.getProductById(id)
        if (product) {
            res.send(product)
        } else {
            res.status(404).send('El producto no existe')
        }
    } catch (err) {
        res.status(500).send('Ocurrido un error al obtener el producto')
    }
})

router.post('/', (req, res) => {
    const { title, description, price, status, thumbnail, code, stock, category } = req.body

    if (!title || !description || !price || !status || !code || !stock || !category) {
        return res.status(400).send('Hay campos incompletos. Todos los campos son obligatorios.')
    }

    manager.addProduct(title, description, price, status, thumbnail, code, stock, category)
    res.send('Producto registrado')
})

router.put('/:id', (req, res) => {
    const productId = parseInt(req.params.id)
    const productToUpdate = manager.getProductById(productId)

    if (!productToUpdate) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }

    const updatedProduct = {
        ...productToUpdate,
        ...req.body,
        id: productId,
    }

    manager.updateProduct(productId, updatedProduct)

    res.json(updatedProduct)
})

router.delete('/:id', (req, res) => {
    const productId = parseInt(req.params.id)
    const productDeleted = manager.deleteProduct(productId)

    if (!productDeleted) {
        return res.status(404).json({ message: 'Producto no encontrado' })
    }

    res.json({ message: `El producto ${productId} fue eliminado.` })
})


export default router