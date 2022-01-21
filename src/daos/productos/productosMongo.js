import Schema from 'mongoose';
import MongoContainer from "../../contenedores/MongoContainer.js";
export default class ProductosMongo extends MongoContainer {
    constructor(){
        super(
            'productos',
            {
                name:{type:String,required:true},
                description:{type:String,required:true},
                code:{type:String,required:true},
                price:{type:Number,required:true},
                stock:{type:Number,required:true}
            },{timestamps:true}

        )
    
    }
}