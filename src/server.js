import express from "express";
import cors from "cors";
import reviewsRouter from "./reviews/reviews.js";
import errorHandler from "./middleware/error-handlers.js";
import listEndpoints from "express-list-endpoints";
import productsRouter from "./products/products.js";
import { publicFolderPath } from "./lib/fs-tools.js";

const server = express();
const port = process.env.PORT || 3001;

const whiteList = [process.env.FE_LOCAL_URL, process.env.FE_REMOTE_URL];

const corsOptions = {
  origin: function (origin, next) {
      console.log(origin);
    if (!origin || whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("Not allowed by CORS"));
    }
  },
};

server.use(cors(corsOptions));
server.use(express.json());
server.use(express.static(publicFolderPath));

server.use("/reviews", reviewsRouter);

server.use(errorHandler);

// ENDPOINTS HERE

server.use("/products", productsRouter);
console.table(listEndpoints(server));

// ENDPOINTS ENDS HERE

server.listen(port, () => {
  console.log(`Server Running On Port ${port}`);
});
