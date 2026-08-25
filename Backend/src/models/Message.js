import mongoose from 'mongoose'

const messageSchema = mongoose.Schema({
    senderId:{
        type:mongoose.Schema.types.ObjectId,
        ref:'User',
        required:true,
    },
    receiverId:
})