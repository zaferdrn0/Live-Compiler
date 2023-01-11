import mongoose from 'mongoose'; // importla yap
const Schema = mongoose.Schema;
const userSchema = new Schema({
    id:{type:Schema.ObjectId},
  username: { type: String, maxLength:15 },
  email: { type: String, maxLength:100},
  password: { type: String, maxLength:150 },
  kodlar:{
    Python:[],
    Cpp:[],
    Html:[],
    Java:[],
    Php:[],
    Cdil:[]
  },
  type:{type:String, default:"normal"}
});

const User = mongoose.model("user", userSchema, 'compiler'); 



export {User};