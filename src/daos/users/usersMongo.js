import Schema from 'mongoose';
import MongoContainer from "../../contenedores/MongoContainer.js";
export default class UsersMongo extends MongoContainer {
    constructor(){
        super(
            'users',
            {
                first_name:{type:String,required:true},
                last_name:{type:String,required:true},
                age:{type:Number,required:true},
                username:{type:String,defaul:"anonimo", unique:true, required:true},
                email:{type:String,unique:true,required:true},
                password:{type:String,required:true}
            },{timestamps:true}

        )
    
    }
}