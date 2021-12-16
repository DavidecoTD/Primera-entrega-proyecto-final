import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import {Server} from 'socket.io';
import Manager  from './classes/manager.js';
import productRouter from './routes/products.js';
import carritoRouter from './routes/carrito.js';
import upload from './services/uploader.js';
import {authMiddleware} from './utils.js';
import __dirname from './utils.js';
const manager = new Manager();
const app = express();


const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`el servidor esta escuchando en el puerto ${PORT}`)
})

const io = new Server(server);
app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

let admin = true;
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    req.auth = admin;
    next();
})
app.use( express.static(__dirname+'/public'));
app.use('/api/productos', productRouter);
app.use('/api/carrito', carritoRouter);

app.post('/api/uploadfile',upload.fields([
    {
        name:'file', maxCount:1
    },
    {
        name:"documents", maxCount:3
    }
]),(req,res)=>{
    const files = req.files;
    console.log(files);
    if(!files||files.length===0){
        res.status(500).send({messsage:"No se subió archivo"})
    }
    res.send(files);
})
app.get('/view/productos',authMiddleware,(req,res)=>{
    manager.getAll().then(result=>{
        let info = result.products;
        let preparedObject ={
            productos : info
        }
        res.render('productos',preparedObject)

    })
})
let messages =[];
io.on('connection', async socket=>{
    console.log(`El socket ${socket.id} se ha conectado`)
    let productos = await manager.getAll();
    socket.emit('deliveyProductos',productos);

    socket.emit('messagelog', messages);
    socket.on('message', data => {
        messages.push(data)
        io.emit('messagelog',messages);
    })
})