import mongoose from 'mongoose';

export async function connect() {
  try{
    mongoose.connect(process.env.MONGO_URI);
    const connection = mongoose.connection;

    connnection.on('connected', () => {
      console.log('MongoDB connected');
    })

    connection.on('error', (err) => {
      console.log('MongoDB connection error ' + err);
      process.exit();
    });
        
  } catch (error){
    console.log("Something went wrong");
    console.log(error);
  }
}