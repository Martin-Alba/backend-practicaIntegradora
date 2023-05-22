import fs from "fs";

class CartManager {
  constructor() {
    this.path = "cart.json";
    this.index = 0;
    try {
      this.loadCart();
    } catch (err) {
      console.log("Error al leer el archivo del carrito:", err.message);
      this.cart = [];
    }
  }

  loadCart() {
    const data = fs.readFileSync(this.path, "utf-8");
    this.cart = JSON.parse(data);
    this.index = this.cart.reduce((maxId, cart) => {
      return cart.id > maxId ? cart.id : maxId;
    }, 0);
  }

  saveCart() {
    const data = JSON.stringify(this.cart);
    fs.writeFileSync(this.path, data, "utf-8");
  }

  createCart() {
    this.loadCart();

    const newCart = {
      id: this.index + 1,
      products: [],
    };

    this.cart.push(newCart);
    this.index++;
    this.saveCart();

    return newCart;
  }

  getCartById(id) {
    const cart = this.cart.find((cart) => cart.id === id);
    if (!cart) {
      throw new Error(`No se encontro el cart con id ${id}`);
    }
    return cart;
  }
}

export default CartManager;
