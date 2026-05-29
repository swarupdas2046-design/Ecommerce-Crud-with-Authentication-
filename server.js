import app from "./src/app.js";
import dotenv from 'dotenv'
import Database from "./src/Config/Database.js";

dotenv.config()
Database()
const port = process.env.PORT

app.listen(port,()=>{
    console.log(`Server running SuccessFully on port ${port}`);
})