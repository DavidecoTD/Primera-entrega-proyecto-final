import express from 'express';
import upload from '../services/uploader.js';
import Manager from '../contenedores/manager.js';
import authMiddleware from '../utils.js';
import {carrito} from '../daos/index.js'
const router = express.Router();
const manager = new Manager(); 

//POST
router.post('/', (req,res) => {
    manager.saveCarrito().then(result => {
        res.send(result);
    })
})

router.post('/:id/productos/:id_prod', (req,res) => {
    let id = parseInt(req.params.id);
    let id_prod = parseInt(req.params.id_prod);
    manager.addCarrito(id,id_prod).then(result => {
        res.send(result);
    })
})
//GET
router.get('/:id/productos', (req,res) => {
    let id = parseInt(req.params.id);
    manager.getProductCarritoById(id).then(result => {
        res.send(result);
    })
})

router.get('/', (req,res) => {
    carrito.getAll().then(result => {
        res.send(result);
    })
})

//DELETE
router.delete('/:id', (req,res) => {
    let id= parseInt(req.params.id);
    manager.deleteCarritoById(id).then(result => {
        res.send(result);
    })
})

router.delete('/:id/productos/:id_prod', (req,res) => {
    let id = parseInt(req.params.id);
    let id_prod = parseInt(req.params.id_prod);
    manager.deleteCarritoProductoById(id,id_prod).then(result => {
        res.send(result);
    })
})



export default router;