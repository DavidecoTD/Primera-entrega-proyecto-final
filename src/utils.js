
import {fileURLToPath} from 'url';
import {dirname} from 'path';
export const authMiddleware = (req,res,next)=>{
    if(!req.auth) res.status(403).send({error:-2,descripcion:"ruta 'x' método 'y' no implementada"})
    else next();
}
const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

export default __dirname;