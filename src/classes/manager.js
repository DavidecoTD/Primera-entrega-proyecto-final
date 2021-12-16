const fs = require('fs');
const { dirname } = require('path');
const { EventEmitter } = require('stream');
class Manager {
    //carrito
    async saveCarrito(){
        try{
            let data = await fs.promises.readFile('./files/carrito.txt','utf-8')
            let cars = JSON.parse(data);
            let id = cars[cars.length-1].id+1;
            let productos = {productos: []}
            let carrito =Object.assign({timestamp:new Date().toTimeString().split(" ")[0]},productos);
            carrito =Object.assign({id:id},carrito);
            cars.push(carrito)
            try{
                await fs.promises.writeFile('./files/carrito.txt',JSON.stringify(cars,null,2));
                return {status:"success",message:"Carrito creado"}
            }catch{
                return {status:"error",message:"No se pudo crear el carrito"} 
            }
        }catch{
            let carrito = {timestamp:new Date().toTimeString().split(" ")[0]};
            carrito =Object.assign({id:1},carrito);
            try{
                await fs.promises.writeFile('./files/carrito.txt',JSON.stringify([carrito],null,2));
                return {status:"success", message:"Carrito creado"}
            }
            catch(error){
                console.log(error);
                return {status:"error",message:"No se pudo crear el carrito"}
            }
        }
    }

    async deleteCarritoById(id){
        try{
            let data = await fs.promises.readFile('./files/carrito.txt','utf-8');
            let carrito = JSON.parse(data);
            if(!carrito.some(us=>us.id===id)) return {status:"error", message:"No hay ningún carrito con el id proporcionado"}
            let aux = carrito.filter(user=>user.id!==id);
            try{
                await fs.promises.writeFile('./files/carrito.txt',JSON.stringify(aux,null,2));
                return {status:"success",message:"carrito eliminado"}
            }catch{
                return {status:"error", message:"No se pudo eliminar el carrito"}
            }
        }
        catch{
            return {status:"error",message:"Fallo al eliminar el carrito"}
        }
    }
    
    async addCarrito(id,pid){
        try{
            let productData = await fs.promises.readFile('./files/products.txt','utf-8');
            let carritoData = await fs.promises.readFile('./files/carrito.txt','utf-8');
            let products = JSON.parse(productData);
            let carritos = JSON.parse(carritoData);
            let product = products.find(v=>v.id===pid);
            let carrito = carritos.find(v=>v.id===id);
            if(!product) return {status:"error", message:"No se encontró producto"};
            if(carrito.productos.some(prod=>prod.id===product.id)) return {status:"error", message:"El producto que intentas agregar ya existe en el carrito"};

            carrito.productos.push(product);
            let carritoAux = carritos.map(us=>{
                if(us.id===carrito.id){
                    return carrito;
                }else{
                    return us
                }
            })
            await fs.promises.writeFile('./files/carrito.txt',JSON.stringify(carritoAux,null,2));
            return {status:"success",message:"Producto agregado al carrito"}
        }catch(error){
            return {status:"error", message:"No se pudo agregar al carrito: "+error}
        }
    }
    
    async getProductCarritoById(id){
        try{
            let data = await fs.promises.readFile('./files/carrito.txt','utf-8')
            let carritos = JSON.parse(data);
            let carrito = carritos.find(car => car.id===id);

            if(carrito.productos){
                return {status:'Success', product:carrito.productos}
            }
        }catch(err){
            return  {status:'error', message: 'No se encontro producto'}

        }
    }
    async deleteCarritoProductoById(id,pid){
        try{
            let carritoData = await fs.promises.readFile('./files/carrito.txt','utf-8');
            let carritos = JSON.parse(carritoData);
            let carrito = carritos.find(v=>v.id===id);
            let productCarrito = carrito.productos.filter(prod=>prod.id!==pid);
            carrito.productos = productCarrito
            let carritosAux = carritos.map(car =>{
                if(car.id === carrito.id){
                    return carrito
                }else{
                    return car
                }
            })
   
            await fs.promises.writeFile('./files/carrito.txt',JSON.stringify(carritosAux,null,2));
            return {status:"success",message:"Producto ha sido eliminado del carrito"}
        }catch(error){
            return {status:"error", message:"No se pudo elminar producto del carrito: "+error}
        }
    }

    //productos
    async save(product){
        try{
            let data = await fs.promises.readFile(__dirname+'/files/products.txt','utf-8');
            console.log(__dirname+'/files/products.txt')
            let products = JSON.parse(data);
            let id = products[products.length-1].id+1;
            product =Object.assign({timestamp:new Date().toTimeString().split(" ")[0]},product);
            product =Object.assign({id:id},product);
            let auxValid = products.find(prod => prod.codigo===product.codigo);
            if(auxValid){
                return {status:"success",message:"El Producto ingresado ya existe, Registro invalido"}
            }else{
                products.push(product)
            }
            try{
                await fs.promises.writeFile(__dirname+'/files/products.txt',JSON.stringify(products,null,2));
                return {status:"success",message:"Producto registrado"}
            }catch{
                return {status:"error",message:"No se pudo registrar el producto"} 
            }
        }catch{
            product =Object.assign({timestamp:new Date().toTimeString().split(" ")[0]},product);
            product =Object.assign({id:1},product);
            try{
                await fs.promises.writeFile(__dirname+'/files/products.txt',JSON.stringify([product],null,2));
                return {status:"success", message:"Producto registrado"}
            }
            catch(error){
                console.log(error);
                return {status:"error",message:"No se pudo registrar el producto"}
            }
        }
    }
    async getproductById(id){
        try{
            let data = await fs.promises.readFile('./files/products.txt','utf-8')
            let products = JSON.parse(data);
            let product = products.find(prod => prod.id===id);
            if(product){
                return {status:'Success', product:product}
            }
        }catch(err){
            return  {status:'error', message: 'No se encontro producto'}

        }
    }
    async getAll(){
        try{
            console.log('hola');
            let data = await fs.promises.readFile('./files/products.txt','utf-8')
            let products = JSON.parse(data);
            if(products){
                return {status:'Success', products:products}
            }
        }catch(err){
            return  {status:'error', message: 'No se encontraron productos'}

        }
    }
    async getRandom(){
        try{
            let data = await fs.promises.readFile('./files/products.txt','utf-8')
            let products = JSON.parse(data);
            let aletaorio = Math.floor(Math.random()* (products.length));

            if(products){
                return {status:'Success', products:products[aletaorio]}
            }
        }catch(err){
            return  {status:'error', message: 'No se encontraron productos'}

        }
    }
    async deleteById(id){
        try{
            let data = await fs.promises.readFile('./files/products.txt','utf-8');
            let products = JSON.parse(data);
            if(!products.some(prod=>prod.id===id)) return {status:"error", message:"No hay ningún producto con el id proporcionado"}
            let aux = products.filter(prod=>prod.id!==id);
            try{
                await fs.promises.writeFile('./files/products.txt',JSON.stringify(aux,null,2));
                return {status:"success",message:"producto eliminado"}
            }catch{
                return {status:"error", message:"No se pudo eliminar el producto"}
            }
        }
        catch{
            return {status:"error",message:"Fallo al eliminar el producto"}
        }
    }
    async deletAll(){
        try{
            let data = await fs.promises.readFile(__dirname+'/files/products.txt','utf-8')
            let products = JSON.parse(data);
            if(products){
                await fs.promises.writeFile('./files/products.txt',JSON.stringify([],null,2))

            }
        }catch(err){
            return  {status:'error', message: 'No se encontraron productos'}

        }
    }
    async updateProducto(id,body){
        try{
            let data = await fs.promises.readFile('./files/products.txt','utf-8');
            let products = JSON.parse(data);
            if(!products.some(prod=>prod.id===id)) return {status:"error", message:"No hay ningún producto con el id especificado"}
            if(products.some(prod=>prod.codigo===body.codigo)) return {status:"error", message:"El codigo de producto ya existe"}
            let result = products.map(prod=>{
                if(prod.id===id){
                    body = Object.assign({id:prod.id,...body})
                        return body
                }
                else{
                    return prod;
                }
            })
            try{
                await fs.promises.writeFile('./files/products.txt',JSON.stringify(result,null,2));
                return {status:"success", message:"Producto actualizado"}
            }catch{
                return {status:"error", message:"Error al actualizar el producto"}
            }
        }catch{
            return {status:"error",message:"Fallo al actualizar el producto"}
        }
    }
}

module.exports = Manager;