import mongoose from 'mongoose'
// ----- Connect to the database -----
const Database = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log(error);
    }
}
// ----- Export the function -----

export default Database 