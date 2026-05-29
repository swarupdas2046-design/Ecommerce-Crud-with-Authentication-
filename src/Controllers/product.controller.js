import { Delete_file, Upload_files } from "../Config/imagekit.js";
import { ImageModel } from "../Models/product.model.js";

// ----- create product Controller -----
export const CreateProduct = async (req, res) => {
  try {
        // ----- Get the data from the request body -----
    const { description, name,price,category} = req.body;
    // ----- Get the files from the request -----
    const files = req.files;
    // ----- Check if required the fields are present -----
    if (!name || !price) {
            return res.status(400).json({ message: "Name and Price are required" });
        }

        //----- upload files to imagekit -----
    const Transfer = await Promise.all(
      files.map((elem) => Upload_files(elem.buffer, elem.originalname))
    );

    // ----- fields and url of the images ----- 
    const imageRecords = Transfer.map((elem) => ({
      url: elem.url,
      fileId: elem.fileId
    }));

    // ----- Create a new document in the database -----
    const NewCreate = await ImageModel.create({
      description,
      name,
      category,
      price,
      image: imageRecords, 
      user:req.User.email,
    });
    // ----- Return the response -----
    return res.status(201).json({
      message: "File uploaded successfully",
      NewCreate,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Upload failed" });
  }
}

// ----- get all products Controller -----
export const GetallProducts = async (req, res) => {
  try {
    // ----- Get all the documents from the database -----
    const View = await ImageModel.find({
        user: req.User.email
    });
    // ----- Return the response -----
    return res.status(200).json({
      message: "File Fetched Successfully",
      View,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}

// ----- get product by id Controller -----
export const GetProductById = async(req,res)=>{
    try {   
        // ----- Get the id from the request params -----
        const {id} = req.params

        // ----- fetch specific documents from the database by id -----
        const View = await ImageModel.findOne({_id:id})
        
        // ----- Return the response -----
        return res.status(200).json({
      message: "File Fetched Successfully",
      View,
    });

    } catch (error) {
        return res.status(500).json({
            message:"Internal Server error",
            error:error.message
        })
    }
}

// ----- update product Controller -----
export const UpdateProduct = async (req, res) => {
  try {
    // ----- Get the id from the request params -----
    const { id } = req.params;

    // ----- Get the data from the request body -----
    const { description, name,price,category} = req.body;

    // ----- Get the files from the request -----
    const files = req.files;
        // ----- Check if required the fields are present -----
        if (!description||!name||!price||!category) {
            return res.status(400).json({ message: "All fields are required" });
        }


    // first get the existing document
    const existingDoc = await ImageModel.findOne({
        _id: id,
        user: req.User.email
    });
    let imageRecords = existingDoc.image; 

    // 
    if (files && files.length > 0) {
      // 1. Delete the existing images
      await Promise.all(existingDoc.image.map((img) => Delete_file(img.fileId)));

      // 2. Update the new images
      const Transfer = await Promise.all(
        files.map((elem) => Upload_files(elem.buffer, elem.originalname))
      );

      // 3. Update the imageRecords
      imageRecords = Transfer.map((elem) => ({
        url: elem.url,
        fileId: elem.fileId
      }));
    }

    // ----- Update the document in the database -----
    const Update = await ImageModel.findByIdAndUpdate(
      id,
      {
        category,
        price,
        description,
        name,
        image: imageRecords, 
      },
      { new: true }
    );
    // ----- Return the response -----
    return res.status(200).json({
      message: "File Updated Successfully",
      Update,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

// ----- delete product Controller -----
export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Get the document from the database
    const existingDoc = await ImageModel.findOne({
        _id: id,
        user: req.User.email
    });
    if (!existingDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 2. Delete the images
    if (existingDoc.image && existingDoc.image.length > 0) {
      await Promise.all(
        existingDoc.image.map((img) => Delete_file(img.fileId))
      );
    }

    // 3. and finally delete the document from the database
    const Delete = await ImageModel.findByIdAndDelete(id);
    
    // ----- Return the response -----
    return res.status(200).json({
      message: "File and Data Deleted Successfully",
      Delete,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}