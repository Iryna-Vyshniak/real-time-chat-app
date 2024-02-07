import mongoose from 'mongoose';

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.DB_HOST);
    console.log('Database connection successful');
  } catch (error) {
    console.log('Error connecting to MongoDB', error.message);
  }
};

export default connectToMongoDB;
