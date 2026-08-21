import mongoose from 'mongoose'

export const connectDB = async ()=>{
    // console.log(process.env.MONGO_URI)
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log('DB connected successfully')
    }catch(error){
        console.log('Error while connecting to DB',error)
        process.exit(1)
    }
}