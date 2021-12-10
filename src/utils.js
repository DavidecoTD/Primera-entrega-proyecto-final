 const authMiddleware = (req,res,next)=>{
    if(!req.auth) res.status(403).send({error:-2,descripcion:"ruta 'x' método 'y' no implementada"})
    else next();
}
 module.exports =authMiddleware;