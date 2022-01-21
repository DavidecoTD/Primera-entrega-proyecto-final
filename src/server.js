import express from 'express';
import {engine} from 'express-handlebars';
import cors from 'cors';
import {Server} from 'socket.io';
import Manager  from './contenedores/manager.js';
import productRouter from './routes/products.js';
import carritoRouter from './routes/carrito.js';
import upload from './services/uploader.js';
import {authMiddleware} from './utils.js';
import __dirname from './utils.js';
import {users} from './daos/index.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import ios from 'socket.io-express-session';
const manager = new Manager();
const app = express();


const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`el servidor esta escuchando en el puerto ${PORT}`)
})

const baseSession =(session({
    store:MongoStore.create({mongoUrl:'mongodb+srv://Davidec:123@cluster0.qojq0.mongodb.net/sessions?retryWrites=true&w=majority'}),
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:600000},
    secret:"CoderChat"
}))


const io = new Server(server);
app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')

let admin = false;
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
app.use(baseSession);
io.use(ios(baseSession));

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

app.post('/register',async (req,res)=>{
    let user = req.body;
    let result = await users.save(user);
    res.send({message:"usuario creado", user:result})
})

app.post('/login', async (req,res)=>{
    let {email,password} = req.body;
    console.log(req.body)
    if(!email||!password) return res.status(400).send({error:"datos incompletos"})
    const params = {email:email}
    const user = await users.getBy(params);
    if(!user) return res.status(400).send({error:"usuario no encontrado"})
    if(user.password!==password) return res.status(400).send({error:"Contrasena incorrecta"})
    req.session.user={
        name:user.first_name,
        username:user.username,
        email:user.email
    }
    res.send({status:"logged"})
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
