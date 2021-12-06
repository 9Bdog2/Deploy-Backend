import { body } from "express-validator"


export const productValidation = [
    body("name").exists().isLength({min:1}).withMessage("Name is a mandatory field!"), 
    body("description").exists().isLength({min:1}).withMessage("Description is a mandatory field!"), 
    body("brand").exists().isLength({min:1}).withMessage("Brand is a mandatory field!"),  
    body("price").exists().isLength({min:1}).withMessage("Price is a mandatory field!"), 
    body("category").exists().isLength({min:1}).withMessage("ReadTime unit is a mandatory field!"),
  ]