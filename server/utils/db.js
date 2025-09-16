const { default: mongoose } = require("mongoose");

 const URI = process.env.MONGODB_URI

 const CONNECT_DB=async () => {
   try {
     await mongoose.connect(URI);
     console.log("Database connected successfully");
   } catch (error) {
     console.error("Database connection failed:", error);
     process.exit(1); // Exit the process with failure
   }
 }
module.exports = CONNECT_DB;