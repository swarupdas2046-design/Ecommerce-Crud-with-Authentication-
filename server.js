import app from "./src/app.js";
import dotenv from 'dotenv'
import Database from "./src/Config/Database.js";
//----- Load the environment variables from the .env file -----
dotenv.config()

//----- Connect to the database -----
Database()
const port = process.env.PORT

// ----- Start the server -----
app.listen(port,()=>{
    console.log(`Server running SuccessFully on port ${port}`);
})