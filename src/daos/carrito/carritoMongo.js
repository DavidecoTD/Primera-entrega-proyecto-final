import Schema from 'mongoose';
import MongoContainer from "../../contenedores/MongoContainer.js";
export default class CarritoMongo extends MongoContainer {
    constructor(){
        super(
            'carrito',
            {
                products : {
                    type:[{
                        type:Schema.Types.ObjectId,
                        ref:'productos',
                    }],
                    default:[]
                }
            },{timestamps:true}

        )
    
    }
}