import { Router } from 'express'
import ProductManager from '../ProductManager.js'
import { createServer } from 'http'
import { Server } from 'socket.io'

const router = Router()

const manager = new ProductManager('./dataBase.json')

router.get('/', (req, res) => {
    try {
        const products = manager.getProducts()
        res.render('index', { products: products })
    } catch (err) {
        res.status(500).send('Ocurrió un error al leer el archivo de productos')
    }
})

router.get('/', (req, res) => {
  try {
    const products = manager.getProducts()
    res.render('realTimeProducts', { products })
  } catch (err) {
    res.status(500).send('Ocurrió un error al leer el archivo de productos');
  }
})

export default router