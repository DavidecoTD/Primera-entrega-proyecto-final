import mongoose from 'mongoose';
import config from '../config.js'

mongoose.connect(config.mongo.baseUrl,{useNewUrlParser:true,useUnifiedTopology:true})

export default class MongoContainer{
    constructor(collection,schema,timestamps){
        this.collection=mongoose.model(collection,new mongoose.Schema(schema,timestamps))
    }

    getAll = async()=>{
        try {
            let documents = await this.collection.find()
            return {status:success, payload:documents}
        } catch (error) {
            return {status:"error", error:error}
        }
    }
    save = async(object) =>{
        try {
            let result = await this.collection.create(object);
            return {status:success, message:"objeto credo", payload:result}
        } catch (error) {
            return {status:"error", error:error}
        }
    }
    getBy = async(params) =>{
        try {
            let result = await this.collection.findOne(params);
            
            return result
        } catch (error) {
            return {status:"error", error:error}
        }
    }
}