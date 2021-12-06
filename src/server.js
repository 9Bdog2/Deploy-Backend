import express from 'express'
import cors from 'cors'
import reviewsRouter from './reviews/reviews.js'
import errorHandler from './middleware/error-handlers.js'
import listEndpoints from 'express-list-endpoints'
import productsRouter from './products/products.js'
import { publicFolderPath  } from './lib/fs-tools.js'


const server = express()
const port = 3001

server.use(cors())
server.use(express.json())
server.use(express.static(publicFolderPath))

server.use('/reviews', reviewsRouter)

server.use(errorHandler)

// ENDPOINTS HERE

server.use("/products", productsRouter)
// console.table(listEndpoints(server))


// ENDPOINTS ENDS HERE


server.listen(port, () => {
    console.log(`Server Running On Port ${port}`)
})