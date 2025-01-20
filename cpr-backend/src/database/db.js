const mongoose = require("mongoose");

const uri =process.env.MONGODB_URI;
const localUri = process.env.MONGOLOCAL_URI;

async function connectDB() {
	try {
		// Connect to MongoDB
		const conn = await mongoose.connect(uri);
		console.log(`Connected to MongoDB Atlas at ${conn.connection.host}`);
	} catch (error) {
		console.error("MongoDB Atlas connection error:", error);
		console.log("Attempting to connect to local MongoDB...");

		try {
			// Connect to local MongoDB
			const conn = await mongoose.connect(localUri);
			console.log(`Connected to local MongoDB at ${conn.connection.host}`);
		} catch(error){
			console.error("Local MongoDB connection error:", error);
			process.exit(1); // Exit the process if there is a connection error
		}
	}
}

module.exports = { connectDB };
