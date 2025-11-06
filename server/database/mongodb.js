import mongoose from "mongoose";

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB successfully!");
    } catch (error) {
        console.error("Error connecting to DB: ", error);
        process.exit(1);
    }
}

export default connectToDatabase;