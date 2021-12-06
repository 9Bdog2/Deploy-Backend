import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const {readJSON, writeJSON, writeFile} = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../data')
const reviewsJSONPath = join(dataFolderPath, '/reviews.json')

const productsPublicFolderPath = (process.cwd(), "./public/img/products")

export const publicFolderPath = join(process.cwd(), 'public')
export const getReviews = () => readJSON(reviewsJSONPath)
export const writeReview = content => writeJSON(reviewsJSONPath, content)



const productJSONPath = join(dataFolderPath, "products.json")

export const getProducts = () => readJSON(productJSONPath)

export const writeProducts = (content) => writeJSON(productJSONPath, content)


export const saveProductImage = (fileName, contentAsABuffer) => writeFile(join(productsPublicFolderPath, fileName), contentAsABuffer)