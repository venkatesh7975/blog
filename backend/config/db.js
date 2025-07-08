import mongoose from "mongoose";

//declared a asynchronous function and exported
export default  async function connectDB(){
   try{  //exception handling
        await mongoose.connect("mongodb://localhost:27017/newblog");//connected to db
        console.log("connect to db")
   }
   catch(err){
         console.log(err)
   }

}
//import modules,export modules,connecting db,error handling,asynchronous function
