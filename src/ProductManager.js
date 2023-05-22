import fs from 'fs'
import ioClient from 'socket.io-client'

class ProductManager {
    constructor() {
        this.path = 'dataBase.json';
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            this.products = JSON.parse(data);
        } catch (err) {
            console.log('Error al leer el archivo de productos:', err.message);
            this.products = [];
        }
        this.socket = ioClient('http://localhost:8080')
    }
    
    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf-8');
            if (data.trim() === '') {
                this.products = [];
            } else {
                const parsedData = JSON.parse(data);
                this.index = parsedData[parsedData.length - 1].id;
                this.products = parsedData;
            }
        } catch (error) {
            console.log(`Error al cargar los productos: ${error}`);
        }
    }

    addProduct = (title, description, price, status, thumbnail, code, stock, category) => {
        if (!title || !description || !price || !status || !code || !stock || !category) {
            return console.log('Hay campos incompletos. Todos los campos son obligatorios.')
        }

        const lastProduct = this.products[this.products.length - 1]
        const id = lastProduct ? lastProduct.id + 1 : 1
        const product = { id, title, description, price, status, code, stock, category }

        const exists = this.products.some(p => p.code === code)
        if (exists) {
            return console.log('No puedes repetir el campo code. Debe ser unico de cada producto ingresado')
        }

        if (!Array.isArray(thumbnail)) {
            thumbnail = [thumbnail]
        }
        product.thumbnail = thumbnail

        this.products.push(product)
        fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))

        this.socket.emit('productModified')
        console.log('Producto registrado')
    }


    getProducts = () => {
        const products = JSON.parse(fs.readFileSync(this.path, 'utf-8'))
        return products
    }

    getProductById = (id) => {
        const product = this.products.find(p => p.id == id)
        if (product) {
            return product
        } else {
            return console.log('Not found')
        }
    }

    updateProduct(id, updateProd) {
        const pIndex = this.products.findIndex(p => p.id === id)
        if (pIndex !== -1) {
            const updatedProduct = { ...this.products[pIndex], ...updateProd, id }
            this.products.splice(pIndex, 1, updatedProduct)
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))

            this.socket.emit('productModified')
            return updatedProduct
        } else {
            return console.log('Producto no encontrado');
        }
    }

    deleteProduct = (id) => {
        const index = this.products.findIndex(p => p.id === id)
        if (index === -1) {
            console.log('Producto no encontrado')
            return false;
        } else {
            this.products.splice(index, 1)
            fs.writeFileSync(this.path, JSON.stringify(this.products, null, '\t'))

            this.socket.emit('productModified')
            console.log(`El producto ${id} fue eliminado.`)
            return true;
        }
    }
}


export default ProductManager