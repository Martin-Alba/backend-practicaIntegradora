import express from "express";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import ProductManager from "../src/dao/ProductManager.js";
import productsRouter from "../src/routers/products.router.js";
import cartManager from "../src/routers/carts.router.js";
import realTime from "./routers/realTimeProducts.js";
import msgRouter from "./routers/messages.router.js"
import CartManager from "./dao/CartManager.js";

const manager = new ProductManager("./dataBase.json");

// agregar productos
manager.addProduct(
  "Torta",
  "Torta rellena con dulce de leche y crema, bañana en chocolate.",
  4999,
  true,
  "https://images.pexels.com/photos/2067436/pexels-photo-2067436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  "t0rt4ch0c0l4t3",
  10,
  "Dulces"
);
manager.addProduct(
  "Bombas",
  "1 kg. de Bombas rellenas de dulce de leche bañadas en chocolate blanco/negro.",
  3999,
  true,
  [
    "https://instagram.frcu2-1.fna.fbcdn.net/v/t51.2885-15/125561619_157112369430010_5403147590968627900_n.jpg?stp=dst-jpg_e35_s640x640_sh0.08&_nc_ht=instagram.frcu2-1.fna.fbcdn.net&_nc_cat=110&_nc_ohc=7TF0NEbO-pgAX_5tjwz&edm=AP_V10EBAAAA&ccb=7-5&oh=00_AfAxpxD3z3-CXNv7JnV_SQOG1-0V-s_7fwiSN4awI_Aw_Q&oe=642771D5&_nc_sid=4f375e",
  ],
  "b0mb45",
  15,
  "Dulces"
);
manager.addProduct(
  "Tarta",
  "Tarta de frutilla y crema.",
  2999,
  true,
  [
    "https://images.pexels.com/photos/4686817/pexels-photo-4686817.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  ],
  "t4rt4d3frut1ll4",
  5,
  "Dulces"
);
manager.addProduct(
  "Tarteletas Dulces",
  "Tarteletas dulces de crema moka, bariloche, crema, y dulce de leche. Se vende por kg.",
  2499,
  true,
  [
    "https://img.freepik.com/fotos-premium/mini-tartaletas-dulces-hechas-ingredientes-frescos_681987-6676.jpg?w=2000",
  ],
  "t4rt3l3t4dulc3",
  13,
  "Dulces"
);
manager.addProduct(
  "Tarteletas Saladas",
  "Tarteletas saladas de atun, palmito y roquefort. Se vende por kg.",
  2799,
  true,
  [
    "https://badun.nestle.es/imgserver/v1/80/1290x742/d01e5837e5c9-tartaletas-rellenas-de-atun.jpg",
  ],
  "t4rt3l3t4s4l4d4",
  11,
  "Salados"
);
manager.addProduct(
  "Arrollado Dulce",
  "Arrollado Dulce relleno de dulce de leche y crema, bañado en crema moka, bariloche, dulce de leche o crema.",
  3199,
  true,
  [
    "https://www.recetas-argentinas.com/base/stock/Recipe/134-image/134-image_web.jpg",
  ],
  "4rr0ll4d0dulc3",
  3,
  "Dulces"
);
manager.addProduct(
  "Arrollado Salado",
  "Arrollado Salado de jamon y queso, Roquefort o Atun.",
  3249,
  true,
  ["https://mediacenter.bonduelle.com/cdn/202001/ESGP016_.jpg"],
  "4rr0ll4d0s4l4d0",
  2,
  "Salados"
);
manager.addProduct(
  "Tallarines",
  "Tallarines de huevo",
  149,
  true,
  ["https://imag.bonviveur.com/tallarines-al-huevo-una-vez-cocidos.jpg"],
  "t4ll4r1n3s",
  10,
  "Pastas"
);
manager.addProduct(
  "Ñoquis",
  "Ñoquis de queso o papa",
  299,
  true,
  [
    "https://www.clarin.com/img/2018/06/19/HJS8-kvW7_1256x620__2.jpg#1588085373911",
  ],
  "n0qu1s",
  6,
  "Pastas"
);
manager.addProduct(
  "Sorrentinos",
  "Sorrentinos rellenos de pollo, carne y verdura o jamon y queso.",
  359,
  true,
  ["https://cuk-it.com/wp-content/uploads/2022/05/thumb03c-840x473.jpg"],
  "s0rr3nt1n0s",
  8,
  "Pastas"
);

manager.addProduct();
// retornar productos
manager.getProducts();
console.log(manager.products);

// capturar producto por id
// Para obteber el producto, se debe cambiar el '1' por el id que uno quiera buscar.
console.log("\n\nDebajo el producto arrojado mediante el id\n\n");
console.log(manager.getProductById(1));

// actualizar producto
// ingresar id para actualizar, luego key y valor a actualizar
console.log("\n\nProducto actualizado\n\n");
console.log(manager.updateProduct(1, { title: "test" }));

// eliminar producto
// Para eliminar, ingresar el id del producto que desee eliminar
manager.deleteProduct();

/* >>>--------------> EXPRESS <--------------<<< */

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// route para products
app.use("/api/products", productsRouter);

// route para cart
app.use("/api/carts", cartManager);

//
app.use("/", realTime);

/* >>>--------------> SOCKET <--------------<<< */

const httpServer = app.listen(8080, () => console.log("Server Up"));

const socketServer = new Server(httpServer);

socketServer.on("connection", (socketClient) => {
  console.log("Cliente socket conectado...");

  socketClient.on("productAction", (data) => {
    console.log(`Producto ${data.id} ha sido ${data.action}`);
    const updatedProducts = manager.getProducts();
    socketServer.emit("updateProducts", updatedProducts);
  });
});

app.use("/realtimeproducts", realTime);

/* >>>--------------> MongoDB <--------------<<< */

const uri = "mongodb+srv://Mrt:064@test.c7vgcry.mongodb.net/ecommerce";

app.use("/products", productsRouter);
app.use("/chat", msgRouter)
app.use('/carts', cartManager)

mongoose.set("strictQuery", false);
try {
  await mongoose.connect(uri);
  console.log("DB connected!");
} catch (err) {
  console.error("No se pudo conectar a la DB");
}
