import express from "express";
import { AuthMiddleware } from "../Middlewares/auth.middleware.js";
import { Send_file } from "../Config/File.config.js";
import { CreateProduct, DeleteProduct, GetallProducts, GetProductById, UpdateProduct } from "../Controllers/product.controller.js";

const Routes = express()

// ----- create product api -----
Routes.post("/createProduct", AuthMiddleware , Send_file.array("image", 5), CreateProduct);

// ----- get all products api -----
Routes.get("/getallProducts", AuthMiddleware , GetallProducts);

// ----- get product by id api -----
Routes.get("/getProductById/:id",AuthMiddleware,GetProductById)

// ----- update product api -----
Routes.put("/UpdateProduct/:id", AuthMiddleware , Send_file.array("image", 5), UpdateProduct);

// ----- delete product api -----
Routes.delete("/DeleteProduct/:id", AuthMiddleware , DeleteProduct);

export default Routes