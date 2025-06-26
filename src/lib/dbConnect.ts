import dotenv from "dotenv";
dotenv.config();

console.log("MONGODB_URI:", process.env.MONGODB_URI);


import mongoose from "mongoose";

//ConnectionObject is a TypeScript type definition for an object.
//The ? indicates that this property is optional, meaning it may or may not exist on the object.
type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {} //Since isConnected is optional, connection can initially be an empty object {}.

//void here means we do not care what type of data is coming here

async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }
    
    try {
        console.log("Attempting to connect to MongoDB...");//added
        const db = await mongoose.connect(process.env.MONGODB_URI || "")

        connection.isConnected = db.connections[0].readyState
        console.log("DB Connection State:", connection.isConnected);//added
        console.log("DB Connected Successfully");

    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1)
    }
}

export default dbConnect;