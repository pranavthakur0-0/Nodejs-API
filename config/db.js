const mongoose = require('mongoose');

const connectdb = async ()=>
{
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`mongoos connected ${conn.connection.host}`);

  
}



module.exports = connectdb;