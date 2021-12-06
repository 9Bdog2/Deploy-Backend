import express from 'express'
import uniqid from 'uniqid'
import multer from 'multer'
import {extname} from "path"
import { validationResult } from "express-validator"
import { productValidation } from './validation.js'

import { saveProductImage } from '../lib/fs-tools.js'

import { getProducts, writeProducts, getReviews } from "../lib/fs-tools.js"


const productsRouter = express.Router()


const uploader = multer({
    fileFilter: (request, file, next) => {
      if (file.mimetype !== "image/png") {
        next(createHttpError(400, "only pngs are allowed"))
      } else {
        next(null, true)
      }
    },
  }).single("image")
productsRouter.post("/:productId/uploadImage", uploader, async(request, response, next)=> {
    try {
        console.log("File", request.file);
        const fileName = `${request.params.productId}${extname(request.file.originalname)}`
 
        await saveProductImage(fileName, request.file.buffer)

        const image = `http://localhost:3001/img/products/${fileName}`


        const products = await getProducts()

        const productIndex = products.findIndex(product => product.id === request.params.productId)

        if(productIndex !== -1){
            products[productIndex].image = image

            await writeProducts(products)
            response.status(201).send({image})
        }
            
        } catch (error) {
            next(error)
        }
})
// HERE POSTING NEW PRODUCT
productsRouter.post("/", productValidation, async(request, response, next)=> {
    try {
        const error = validationResult(request)
        if(!error.isEmpty()){
            next("All the fields are required to fullfilled", {error})
        }
        console.log("Body", request.body);
        const newProduct = { ...request.body, createdAt: new Date(), id: uniqid() }
        const products = await getProducts()
        products.push(newProduct)
     
        await writeProducts(products)
        response.status(201).send({id: newProduct.id})
        
    } catch (error) {
        next(error)
    }
})
// END OF POSTING NEW PRODUCT 

// STARTING OF GETTING PRODUCT
productsRouter.get("/", async (req, res, next)=> {
    try {
        const products = await getProducts()
        if (Object.entries(req.query).length === 0) return res.send(products)
        switch (Object.keys(req.query)[0]) {
            case 'category': 
                const filteredProductsByCategory = products.filter(product => product.category.toLowerCase() === req.query.category.toLowerCase())
                res.send(filteredProductsByCategory)
                break;
            case 'maxPrice':
                const filteredProductsByMaxPrice = products.filter(product => product.price <= req.query.maxPrice)
                res.send(filteredProductsByMaxPrice)
        }        
    } catch (error) {
        next(error);
    }
})

// END OF GETTING PRODUCT

// STARTING OF GETTING PRODUCT BY ID

productsRouter.get("/:productId", async(request, response, next)=> {
    try {
        const products = await getProducts()
        console.log("Product id:", request.params.productId);

        const getById = products.find(product => product.id === request.params.productId)
        response.send(getById)
    } catch (error) {
        next(error)
    }
})

// END OF GETTING PRODUCT BY ID

// STARTING OF UPDATING THE PRODUCT

productsRouter.put("/:productId", async(request, response, next)=> {
    try {
        const products = await getProducts()
        console.log("Updation is:", request.body);
        const updatingProduct = products.findIndex(product => product.id === request.params.productId)
        const modifyProduct = products[updatingProduct]
        const updatedFields = request.body
        const updatedProduct = {...modifyProduct, ...updatedFields, updatedAt: new Date()}
        products[updatingProduct] = updatedProduct
        await writeProducts(products)
        response.send(updatedProduct) 
    } catch (error) {
        next(error)
    }
})

// END OF UPDATING THE PRODUCTS

// STARTING OF DELETING THE PRODUCT

productsRouter.delete("/:productId", async(request, response, next)=> {
    try {
        const products = await getProducts() 
        const deleteById = products.filter(product => product.id !== request.params.productId)
        await writeProducts(deleteById)
        response.status(204).send()
    } catch (error) {
        next(error)
    }
})

// END OF DELETING THE PRODUCTS


// START OFTHE PRODUCT SEARCH

productsRouter.get('/search/:query', async (req, res, next) => {
    try {
        const products = await getProducts()
        const filteredProducts = products.filter(({ name, description, brand }) => 
            name.toLowerCase().includes(req.params.query.toLowerCase()) || 
            description.toLowerCase().includes(req.params.query.toLowerCase()) || 
            brand.toLowerCase().includes(req.params.query.toLowerCase())
        )
        res.send(filteredProducts)
    } catch (error) {
        next(error)
    }
})

// END OF THE PRODUCT SEARCH


// START OFTHE PRODUCT REVIEWS

productsRouter.get('/:productId/reviews', async(req, res, next) => {
    try {
        const reviews = await getReviews()
        const productReviews = reviews.filter(review => review.productId === req.params.productId)
        if (productReviews.length === 0) return res.send('No Reviews For This Product')
        res.send(productReviews)
    } catch (error) {
        next(error)
    }
})

// END OF PRODUCT REVIEWS

export default productsRouter