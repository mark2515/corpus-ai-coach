import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI!);
        console.log(`MongoDB is connecting on: ${conn.connection.host}`);
    } catch (error) {
        const err = error as Error;
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default connectDB