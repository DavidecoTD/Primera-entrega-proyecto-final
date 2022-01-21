let productos;
let carrito;
let users;
let persistence = "mongo";

switch(persistence){
    case "mongo":
        const {default:ProductosMongo} = await import('./productos/productosMongo.js')
        const {default:CarritoMongo} = await import('./carrito/carritoMongo.js')
        const {default:UsersMongo} = await import('./users/usersMongo.js')
        productos = new ProductosMongo();
        carrito= new CarritoMongo();
        users= new UsersMongo();
        break;
    default:
}
export {productos,carrito,users}